#!/usr/bin/env bash
# Virtual laboratoriyani Ubuntu serveriga (Docker'siz) joylash.
# Ishlatish (root yoki sudo bilan, loyiha papkasi ichidan):
#   cp backend/.env.example backend/.env && nano backend/.env     # birinchi marta
#   DOMAIN=lab.example.uz sudo -E bash deploy/server-setup.sh     # DOMAIN ixtiyoriy
# Skript qayta ishga tushirilsa ham xavfsiz: yangilash uchun ham shu buyruq.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "Root (sudo) bilan ishga tushiring."; exit 1; }
APP="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="${DOMAIN:-_}"
SVC_USER=vlab

[ -f "$APP/backend/.env" ] || { echo "backend/.env topilmadi. Avval: cp backend/.env.example backend/.env va to'ldiring."; exit 1; }
set -a; . "$APP/backend/.env"; set +a
for v in DB_USER DB_PASS DB_NAME JWT_SECRET; do [ -n "${!v:-}" ] || { echo "backend/.env da $v bo'sh."; exit 1; }; done
export PORT="${PORT:-3000}"

echo "==> 1/6 Paketlar (nginx, PostgreSQL, Node.js 20)"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx postgresql curl ca-certificates
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo "==> 2/6 PostgreSQL: foydalanuvchi va baza"
systemctl enable --now postgresql
sudo -u postgres psql -v ON_ERROR_STOP=1 -v u="$DB_USER" -v pw="$DB_PASS" -v d="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'u', :'pw') WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'u') \gexec
SELECT format('CREATE DATABASE %I OWNER %I', :'d', :'u') WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'d') \gexec
SQL

echo "==> 3/6 Backend'ni yig'ish"
id "$SVC_USER" >/dev/null 2>&1 || useradd --system --home "$APP" --shell /usr/sbin/nologin "$SVC_USER"
chown -R "$SVC_USER":"$SVC_USER" "$APP"
chmod 600 "$APP/backend/.env"
sudo -u "$SVC_USER" bash -c "cd '$APP/backend' && npm ci && npm run build"

echo "==> 4/6 Frontend'ni yig'ish"
sudo -u "$SVC_USER" bash -c "cd '$APP/frontend' && npm ci && npm run build"
chmod o+x "$(dirname "$APP")" 2>/dev/null || true   # nginx fayllarni o'qiy olishi uchun

echo "==> 5/6 Backend xizmati (systemd)"
cat > /etc/systemd/system/virtual-lab.service <<UNIT
[Unit]
Description=Virtual laboratoriya (backend)
After=network.target postgresql.service

[Service]
User=$SVC_USER
WorkingDirectory=$APP/backend
EnvironmentFile=$APP/backend/.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable virtual-lab
systemctl restart virtual-lab

echo "==> 6/6 Nginx"
cat > /etc/nginx/sites-available/virtual-lab <<NGINX
server {
  listen 80;
  server_name $DOMAIN;
  root $APP/frontend/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_read_timeout 90s;
  }
  location / {
    try_files \$uri /index.html;
  }
}
NGINX
ln -sf /etc/nginx/sites-available/virtual-lab /etc/nginx/sites-enabled/virtual-lab
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx

sleep 3
if systemctl is-active --quiet virtual-lab; then
  echo; echo "Tayyor. Brauzerda serveringiz IP manzilini (yoki domenni) oching."
else
  echo; echo "Backend ishga tushmadi. Sababi: journalctl -u virtual-lab -n 50 --no-pager"; exit 1
fi
