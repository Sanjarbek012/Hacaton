import { useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

interface Pt { v: number; i: number }

export default function Ohm({ topicId, onSaved }: SimProps) {
  const [V, setV] = useState(6);
  const [R, setR] = useState(20);
  const [pts, setPts] = useState<Pt[]>([]);
  const I = V / R;
  const yMax = 12 / R;

  const W = 340, ox = 44, oy = 175;
  const sx = (v: number) => ox + (v / 12) * (W - ox - 12);
  const sy = (i: number) => oy - (i / yMax) * (oy - 16);

  function addPoint() {
    if (V === 0 || pts.some((p) => p.v === V)) return;
    setPts([...pts, { v: V, i: I }].sort((a, b) => a.v - b.v));
  }
  const flowSeconds = Math.min(6, Math.max(0.3, 0.6 / Math.max(I, 0.05)));
  const measuredR = pts.length ? pts.reduce((s, p) => s + p.v / p.i, 0) / pts.length : null;

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Elektr zanjiri va I(U) grafigi">
          {/* zanjir */}
          <rect x="30" y="20" width="360" height="110" fill="none" stroke="#cfd8ff" strokeWidth="2" rx="6" />
          <rect className="wire-flow" x="30" y="20" width="360" height="110" rx="6" fill="none" stroke="#ffb84d" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 14" style={{ animationDuration: `${flowSeconds}s`, opacity: V === 0 ? 0 : 1 }} />
          <rect x="60" y="9" width="70" height="22" fill="#0d1531" stroke="#cfd8ff" strokeWidth="2" />
          <text x="95" y="25" textAnchor="middle" fontSize="12" fontWeight="700">{V.toFixed(1)} V</text>
          <rect x="260" y="9" width="80" height="22" fill="#0d1531" stroke="#ffb84d" strokeWidth="2" />
          <text x="300" y="25" textAnchor="middle" fontSize="12" fontWeight="700">R = {R} Ω</text>
          <circle cx="210" cy="130" r="17" fill="#0d1531" stroke="#5b8cff" strokeWidth="2" />
          <text x="210" y="127" textAnchor="middle" fontSize="9" fontWeight="700">A</text>
          <text x="210" y="139" textAnchor="middle" fontSize="9">{I.toFixed(2)}</text>
          <circle cx="390" cy="75" r="17" fill="#0d1531" stroke="#3fdc9a" strokeWidth="2" />
          <text x="390" y="72" textAnchor="middle" fontSize="9" fontWeight="700">V</text>
          <text x="390" y="84" textAnchor="middle" fontSize="9">{V.toFixed(1)}</text>
          {/* grafik */}
          <g transform="translate(40,150)">
            <line x1={ox} y1={oy} x2={W} y2={oy} stroke="#cfd8ff" />
            <line x1={ox} y1={oy} x2={ox} y2="10" stroke="#cfd8ff" />
            <text x={W - 6} y={oy + 16} fontSize="11" textAnchor="end">U (V)</text>
            <text x={ox + 6} y="16" fontSize="11">I (A)</text>
            {[0, 4, 8, 12].map((v) => (
              <text key={v} x={sx(v)} y={oy + 14} fontSize="10" textAnchor="middle" fill="#9fabd6">{v}</text>
            ))}
            <text x={ox - 6} y={sy(yMax) + 4} fontSize="10" textAnchor="end" fill="#9fabd6">{yMax.toFixed(2)}</text>
            <polyline fill="none" stroke="#5b8cff" strokeWidth="2" points={pts.map((p) => `${sx(p.v)},${sy(p.i)}`).join(' ')} />
            {pts.map((p) => <circle key={p.v} cx={sx(p.v)} cy={sy(p.i)} r="4" fill="#5b8cff" />)}
            <circle cx={sx(V)} cy={sy(I)} r="5" fill="none" stroke="#ff7a66" strokeWidth="2" />
          </g>
        </svg>
      </div>

      <div className="panel">
        <label>
          Kuchlanish: {V.toFixed(1)} V
          <input type="range" min={0} max={12} step={0.5} value={V} onChange={(e) => setV(+e.target.value)} />
        </label>
        <label>
          Qarshilik: {R} Ω
          <input type="range" min={5} max={100} step={5} value={R} onChange={(e) => { setR(+e.target.value); setPts([]); }} />
        </label>
        <div className="row">
          <button className="btn primary" onClick={addPoint}>Nuqta qo‘shish</button>
          <button className="btn" onClick={() => setPts([])}>Tozalash</button>
        </div>
        <dl className="readout">
          <dt>Tok kuchi</dt><dd>{I.toFixed(3)} A</dd>
          <dt>Nuqtalar</dt><dd>{pts.length}</dd>
          <dt>R = U / I</dt><dd>{measuredR ? measuredR.toFixed(1) + ' Ω' : '—'}</dd>
        </dl>
        <p className="note">I = U / R. Kuchlanishni o‘zgartirib nuqta qo‘shing: grafik to‘g‘ri chiziq bo‘ladi, qiyaligi 1/R ga teng. Qarshilikni o‘zgartirsangiz nuqtalar tozalanadi.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={pts.length >= 3}
        hint="Kamida 3 ta nuqta qo‘shing"
        onSaved={onSaved}
        data={{ 'qarshilik (Ω)': R, nuqtalar: pts.map((p) => `${p.v}V→${p.i.toFixed(3)}A`), "o'lchangan R (Ω)": measuredR ? +measuredR.toFixed(1) : 0 }}
      />
    </div>
  );
}
