# Serverga joylash (Docker'siz)

Kerak: Ubuntu 22.04/24.04 serveri (VPS), kamida 1 GB RAM, root yoki sudo huquqi.

## Birinchi marta

1. Loyihani serverga ko'chiring, masalan `/opt/virtual-lab` papkaga:
   `scp -r virtual-lab root@SERVER_IP:/opt/`  (Windows'da WinSCP yoki `scp` ishlatsa bo'ladi).
2. Serverga kiring: `ssh root@SERVER_IP`, keyin `cd /opt/virtual-lab`.
3. Sozlamalar: `cp backend/.env.example backend/.env && nano backend/.env`
   - `PORT=3000`, `DB_HOST=localhost`, `DB_PORT=5432`
   - `DB_USER`, `DB_PASS`, `DB_NAME`: o'zingiz o'ylab toping (skript shu nom bilan baza yaratadi)
   - `DB_SYNC=true` (hozircha migratsiya yo'q, jadvallar o'zi yaratiladi)
   - `JWT_SECRET`: uzun tasodifiy matn (`openssl rand -hex 32`)
   - `AI_PROVIDER=groq`, `GROQ_API_KEY=...`
4. O'rnatish: `sudo bash deploy/server-setup.sh`
   Domeningiz bo'lsa: `DOMAIN=lab.example.uz sudo -E bash deploy/server-setup.sh`
5. Brauzerda `http://SERVER_IP` ni oching.

Skript nginx, PostgreSQL va Node.js 20 ni o'rnatadi, baza yaratadi, backend va frontend'ni yig'adi,
backend'ni systemd xizmati sifatida ishga tushiradi (server qayta yonsa ham o'zi turadi).

## Yangilash
Yangi kodni ko'chirib (`.env` ni o'chirmang), `sudo bash deploy/server-setup.sh` ni qayta ishga tushiring.
Baza va foydalanuvchilar saqlanadi.

## Foydali buyruqlar
- Backend holati: `systemctl status virtual-lab`
- Loglar: `journalctl -u virtual-lab -f`
- Qayta ishga tushirish: `systemctl restart virtual-lab`

## HTTPS (domen bilan)
Domen A-yozuvi serverning IP'siga qaratilgan bo'lsa:
`apt install -y certbot python3-certbot-nginx && certbot --nginx -d lab.example.uz`

## Xavfsizlik
- Serverda faqat 22, 80, 443 portlar ochiq bo'lsin: `ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw enable`
- PostgreSQL tashqaridan ochilmaydi (faqat localhost).
