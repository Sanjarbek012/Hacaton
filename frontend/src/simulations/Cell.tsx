import { useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

interface Organelle {
  id: string;
  name: string;
  info: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  fill: string;
  stroke: string;
  only?: 'plant' | 'animal';
  plant?: Partial<Pick<Organelle, 'x' | 'y' | 'rx' | 'ry'>>;
}

const ORGANELLES: Organelle[] = [
  { id: 'nucleus', name: 'Yadro', info: 'Irsiy axborot (DNK) saqlanadi va hujayra faoliyati boshqariladi.', x: 170, y: 160, rx: 42, ry: 42, fill: '#b7a5e8', stroke: '#6a55b8' },
  { id: 'mito', name: 'Mitoxondriya', info: 'Hujayraning “energiya stansiyasi”: ATF hosil qiladi.', x: 300, y: 90, rx: 30, ry: 15, fill: '#f0a38b', stroke: '#ff7a66' },
  { id: 'chloro', name: 'Xloroplast', info: 'Fotosintez shu yerda boradi. Xlorofill yorug‘lik energiyasini yutadi.', x: 110, y: 90, rx: 30, ry: 17, fill: '#7fcf7f', stroke: '#3fdc9a', only: 'plant' },
  { id: 'vacuole', name: 'Vakuola', info: 'Hujayra shirasi va suv zaxirasi. O‘simlik hujayrasida katta, hayvonnikida kichik.', x: 320, y: 215, rx: 20, ry: 18, fill: '#2b5d8f', stroke: '#5a9bc0', plant: { x: 305, y: 205, rx: 62, ry: 55 } },
  { id: 'golgi', name: 'Golji apparati', info: 'Moddalarni qayta ishlaydi, o‘rab, hujayra ichida va tashqariga yuboradi.', x: 240, y: 145, rx: 22, ry: 10, fill: '#f5d68a', stroke: '#b8892a' },
  { id: 'er', name: 'Endoplazmatik to‘r', info: 'Oqsil va lipidlar sintezi va tashilishi uchun kanallar tizimi.', x: 175, y: 225, rx: 40, ry: 12, fill: '#f7c2d6', stroke: '#c2527a' },
  { id: 'ribo', name: 'Ribosoma', info: 'Oqsil sintezi bajariladigan mayda zarrachalar.', x: 110, y: 240, rx: 8, ry: 8, fill: '#cfd8ff', stroke: '#cfd8ff' },
  { id: 'wall', name: 'Hujayra devori', info: 'Sellyulozadan iborat qattiq qobiq: hujayraga shakl beradi va himoya qiladi.', x: 0, y: 0, rx: 0, ry: 0, fill: 'none', stroke: '#3fdc9a', only: 'plant' },
  { id: 'membrane', name: 'Hujayra membranasi', info: 'Hujayraga moddalar kirishi va chiqishini tartibga soladi.', x: 0, y: 0, rx: 0, ry: 0, fill: 'none', stroke: '#ffb84d' },
];

export default function Cell({ topicId, onSaved }: SimProps) {
  const [kind, setKind] = useState<'plant' | 'animal'>('plant');
  const [sel, setSel] = useState<string>('nucleus');
  const [viewed, setViewed] = useState<string[]>(['nucleus']);

  const list = ORGANELLES.filter((o) => !o.only || o.only === kind);
  const current = list.find((o) => o.id === sel) ?? list[0];

  function pick(id: string) {
    setSel(id);
    setViewed((v) => (v.includes(id) ? v : [...v, id]));
  }

  const shapes = list.filter((o) => o.id !== 'wall' && o.id !== 'membrane');

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 460 340" role="img" aria-label="Hujayra tuzilishi">
          {kind === 'plant' ? (
            <>
              <rect x="20" y="20" width="420" height="300" rx="14" fill="#0f2a26" stroke="#3fdc9a" strokeWidth={sel === 'wall' ? 8 : 5} onClick={() => pick('wall')} style={{ cursor: 'pointer' }} />
              <rect x="34" y="34" width="392" height="272" rx="10" fill="#0d1531" stroke="#ffb84d" strokeWidth={sel === 'membrane' ? 5 : 2} onClick={() => pick('membrane')} style={{ cursor: 'pointer' }} />
            </>
          ) : (
            <ellipse cx="230" cy="170" rx="205" ry="145" fill="#161e3f" stroke="#ffb84d" strokeWidth={sel === 'membrane' ? 6 : 3} onClick={() => pick('membrane')} style={{ cursor: 'pointer' }} />
          )}
          {shapes.map((o, idx) => {
            const g = kind === 'plant' && o.plant ? { ...o, ...o.plant } : o;
            const active = o.id === sel;
            return (
              <g key={o.id} className="bob" onClick={() => pick(o.id)} style={{ cursor: 'pointer', animationDelay: `${(idx % 5) * 0.45}s` }} role="button" aria-label={o.name}>
                {o.id === 'ribo' ? (
                  <>
                    {[0, 1, 2, 3].map((k) => <circle key={k} cx={g.x + k * 16} cy={g.y + (k % 2) * 10} r="4" fill="#cfd8ff" />)}
                    {active && <rect x={g.x - 10} y={g.y - 10} width="72" height="32" fill="none" stroke="#ff7a66" strokeWidth="2" strokeDasharray="4 3" />}
                  </>
                ) : (
                  <ellipse cx={g.x} cy={g.y} rx={g.rx} ry={g.ry} fill={o.fill} stroke={active ? '#ff7a66' : o.stroke} strokeWidth={active ? 4 : 2} />
                )}
                {o.id === 'nucleus' && <circle cx={g.x + 8} cy={g.y - 6} r="11" fill="#6a55b8" />}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="panel">
        <div className="row">
          <button className={kind === 'plant' ? 'btn primary' : 'btn'} onClick={() => { setKind('plant'); setSel('nucleus'); }}>O‘simlik hujayrasi</button>
          <button className={kind === 'animal' ? 'btn primary' : 'btn'} onClick={() => { setKind('animal'); setSel('nucleus'); }}>Hayvon hujayrasi</button>
        </div>
        <div className="info">
          <b>{current.name}</b>
          {current.info}
        </div>
        <div className="row">
          {list.map((o) => (
            <button key={o.id} className={o.id === sel ? 'chip active' : 'chip'} onClick={() => pick(o.id)}>{o.name}</button>
          ))}
        </div>
        <p className="note">Shaklni bosing yoki ro‘yxatdan tanlang. Ko‘rib chiqilgan qismlar: {viewed.length}.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={viewed.length >= 5}
        hint="Kamida 5 ta qismni ko‘rib chiqing"
        onSaved={onSaved}
        data={{ 'hujayra turi': kind === 'plant' ? "o'simlik" : 'hayvon', "ko'rilgan qismlar": viewed.map((id) => ORGANELLES.find((o) => o.id === id)?.name ?? id) }}
      />
    </div>
  );
}
