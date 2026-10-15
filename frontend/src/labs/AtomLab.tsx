import { useState, type ChangeEvent } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';
import { K, Svg, fmt, useClock } from './common';

const hue = (l: number) => `hsl(${270 - ((Math.min(Math.max(l, 400), 700) - 400) / 300) * 270} 100% 60%)`;

/** 11-fizika: vodorod atomi uchun Bor modeli. Elektron sathlar orasida sakraydi, foton chiqaradi yoki yutadi. */
export function BohrLab({ topicId, onSaved }: SimProps) {
  const t = useClock();
  const [n, setN] = useState(1);
  const [ev, setEv] = useState<{ from: number; to: number; t0: number } | null>(null);
  const [moves, setMoves] = useState(0);
  const En = (k: number) => -13.6 / (k * k);
  const R = (k: number) => 14 + k * 17;
  const jump = (to: number) => {
    if (to === n) return;
    setEv({ from: n, to, t0: t });
    setN(to);
    setMoves((m) => m + 1);
  };
  const dE = ev ? Math.abs(En(ev.from) - En(ev.to)) : 0;
  const lam = dE ? 1239.84 / dE : 0;
  const emit = !!ev && ev.from > ev.to;
  const region = !lam ? '' : lam < 380 ? 'ultrabinafsha' : lam > 750 ? 'infraqizil' : 'ko‘rinadigan yorug‘lik';
  const series = !ev ? '' : Math.min(ev.from, ev.to) === 1 ? 'Layman seriyasi' : Math.min(ev.from, ev.to) === 2 ? 'Balmer seriyasi' : Math.min(ev.from, ev.to) === 3 ? 'Pashen seriyasi' : 'yuqori seriya';
  const age = ev ? t - ev.t0 : 99;
  const ang = t * (2.2 - n * 0.25);
  const ex = 150 + R(n) * Math.cos(ang), ey = 115 + R(n) * Math.sin(ang);
  const col = lam >= 380 && lam <= 750 ? hue(lam) : K.m;
  const px = emit ? 150 + R(ev!.to) + age * 90 : 20 + age * 90;
  return (
    <div className="lab">
      <div className="stage">
        <Svg>
          {[1, 2, 3, 4, 5, 6].map((k) => <circle key={k} cx="150" cy="115" r={R(k)} fill="none" stroke={k === n ? K.b : K.l} strokeDasharray="4 5" />)}
          <circle cx="150" cy="115" r="7" fill={K.r} /><text x="150" y="119" fontSize="9" textAnchor="middle" fill="#0a1024">p⁺</text>
          <circle cx={ex} cy={ey} r="6" fill={K.a} />
          {ev && age < 3.5 && <path d={`M${px} 115q6 -14 12 0t12 0t12 0`} fill="none" stroke={col} strokeWidth="3.5" opacity={1 - age / 3.5} />}
          {ev && age < 3.5 && <text x="270" y="30" fontSize="13" fill={col}>{emit ? 'foton chiqdi' : 'foton yutildi'}</text>}
          <text x="270" y="60" fontSize="13">n = {n}</text><text x="270" y="82" fontSize="13">E = {fmt(En(n), 2)} eV</text>
          {ev && <text x="270" y="104" fontSize="12" fill={K.m}>{ev.from} → {ev.to}</text>}
        </Svg>
      </div>
      <div className="panel">
        <p className="note">Elektronni boshqa energetik sathga o‘tkazing: pastga sakrasa foton chiqadi, yuqoriga chiqarish uchun foton yutiladi.</p>
        <div className="row">{[1, 2, 3, 4, 5, 6].map((k) => <button key={k} className={k === n ? 'chip active' : 'chip'} onClick={() => jump(k)}>n = {k}</button>)}</div>
        <dl className="readout">
          <dt>Foton energiyasi</dt><dd>{ev ? `${fmt(dE, 2)} eV` : '—'}</dd>
          <dt>To‘lqin uzunligi</dt><dd>{ev ? `${fmt(lam, 0)} nm` : '—'}</dd>
          <dt>Soha</dt><dd>{region || '—'}</dd>
          <dt>Seriya</dt><dd>{series || '—'}</dd>
        </dl>
        <p className="note">ΔE = |Eₙ − Eₘ|, Eₙ = −13,6/n² eV. Balmer seriyasi (n → 2) ko‘rinadigan sohada.</p>
      </div>
      <SaveBar topicId={topicId} canSave={moves >= 2} hint="Kamida ikkita o‘tishni bajaring" onSaved={onSaved} data={{ 'O‘tishlar soni': moves, 'Hozirgi sath n': n, 'Oxirgi o‘tish': ev ? `${ev.from} → ${ev.to}` : '—', 'Foton energiyasi (eV)': Number(fmt(dE, 2)), 'To‘lqin uzunligi (nm)': Number(fmt(lam, 0)) }} />
    </div>
  );
}

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr'.split(' ');
const NAME = 'Vodorod|Geliy|Litiy|Berilliy|Bor|Uglerod|Azot|Kislorod|Ftor|Neon|Natriy|Magniy|Alyuminiy|Kremniy|Fosfor|Oltingugurt|Xlor|Argon|Kaliy|Kalsiy|Skandiy|Titan|Vanadiy|Xrom|Marganets|Temir|Kobalt|Nikel|Mis|Rux|Galliy|Germaniy|Mishyak|Selen|Brom|Kripton'.split('|');
const ORDER: [string, number, number][] = [['1s', 1, 2], ['2s', 2, 2], ['2p', 2, 6], ['3s', 3, 2], ['3p', 3, 6], ['4s', 4, 2], ['3d', 3, 10], ['4p', 4, 6]];
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (x: number) => String(x).split('').map((d) => SUP[Number(d)]).join('');

/** Elektron konfiguratsiyani Aufbau (qurish) tartibida hisoblaydi. */
function fill(z: number): Record<string, number> {
  const out: Record<string, number> = {};
  let left = z;
  ORDER.forEach(([k, , cap]) => {
    const e = Math.min(cap, left);
    out[k] = e;
    left -= e;
  });
  if (z === 24) { out['4s'] = 1; out['3d'] = 5; }
  if (z === 29) { out['4s'] = 1; out['3d'] = 10; }
  return out;
}

/** 11-kimyo: atom orbitallari va elektron konfiguratsiya (Z = 1–36). */
export function OrbitalLab({ topicId, onSaved }: SimProps) {
  const [z, setZ] = useState(8);
  const [moves, setMoves] = useState(0);
  const cfg = fill(z);
  const written = ORDER.filter(([k]) => cfg[k] > 0).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const str = written.map(([k]) => `${k}${sup(cfg[k])}`).join(' ');
  const top = Math.max(...written.map((w) => w[1]));
  const outer = written.filter((w) => w[1] === top).reduce((s, w) => s + cfg[w[0]], 0);
  const rows = ORDER.filter(([k]) => cfg[k] > 0);
  return (
    <div className="lab">
      <div className="stage">
        <Svg h={240}>
          <text x="20" y="30" fontSize="20" fontWeight="700">{SYM[z - 1]}</text><text x="60" y="30" fontSize="13" fill={K.m}>{NAME[z - 1]}, Z = {z}</text>
          {rows.map(([k, , cap], i) => {
            const boxes = cap / 2, e = cfg[k];
            return (
              <g key={k} transform={`translate(20 ${50 + i * 22})`}>
                <text x="0" y="14" fontSize="13">{k}</text>
                {Array.from({ length: boxes }, (_, b) => {
                  const up = e > b, down = e > boxes + b;
                  return (
                    <g key={b} transform={`translate(${34 + b * 28} 0)`}>
                      <rect width="24" height="20" rx="3" fill="none" stroke={K.g} strokeWidth="1.6" />
                      {up && <path d="M8 16V5m-3 3l3-3l3 3" stroke={K.a} strokeWidth="2" fill="none" />}
                      {down && <path d="M16 4v11m-3-3l3 3l3-3" stroke={K.gr} strokeWidth="2" fill="none" />}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </Svg>
      </div>
      <div className="panel">
        <label>Element raqami Z: {z} ({SYM[z - 1]})
          <input type="range" min={1} max={36} step={1} value={z} onChange={(e: ChangeEvent<HTMLInputElement>) => { setZ(Number(e.target.value)); setMoves((m) => m + 1); }} />
        </label>
        <dl className="readout">
          <dt>Konfiguratsiya</dt><dd>{str}</dd>
          <dt>Elektronlar</dt><dd>{z}</dd>
          <dt>Tashqi qavat ({top}-qavat)</dt><dd>{outer}</dd>
        </dl>
        <p className="note">Elektronlar past energiyali orbitallardan boshlab to‘ldiriladi. Bir orbitalga eng ko‘pi bilan 2 ta qarama-qarshi spinli elektron sig‘adi, bir xil energiyali orbitallarda avval har biriga bittadan (Xund qoidasi). Xrom (24) va mis (29) da 4s→3d o‘tish bor.</p>
      </div>
      <SaveBar topicId={topicId} canSave={moves >= 3} hint="Kamida uch xil elementni ko‘ring" onSaved={onSaved} data={{ Element: `${SYM[z - 1]} (${z})`, 'Elektron konfiguratsiya': str, 'Tashqi qavat elektronlari': outer, 'Ko‘rilgan elementlar': moves }} />
    </div>
  );
}
