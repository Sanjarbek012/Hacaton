import { useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

const V_ACID = 25; // mL HCl
const C_ACID = 0.1; // mol/L

function pH(vBase: number, cBase: number) {
  const nA = V_ACID * C_ACID; // mmol
  const nB = vBase * cBase;
  const total = V_ACID + vBase;
  if (Math.abs(nA - nB) < 1e-9) return 7;
  if (nA > nB) return -Math.log10((nA - nB) / total);
  return 14 + Math.log10((nB - nA) / total);
}

export default function Titration({ topicId, onSaved }: SimProps) {
  const [cBase, setCBase] = useState(0.1);
  const [vol, setVol] = useState(0);
  const eq = (V_ACID * C_ACID) / cBase;
  const value = pH(vol, cBase);
  const pink = value >= 8.2;
  const passed = vol > eq + 2;

  const add = (d: number) => setVol((v) => Math.min(50, Math.round((v + d) * 10) / 10));

  // egri chiziq
  const cx = (v: number) => 230 + (v / 50) * 170;
  const cy = (p: number) => 300 - (p / 14) * 230;
  const curve = Array.from({ length: 101 }, (_, k) => k * 0.5).map((v) => `${cx(v)},${cy(pH(v, cBase))}`).join(' ');

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Titrlash">
          {/* byuretka */}
          <rect x="70" y="10" width="26" height="150" fill="#1a2650" stroke="#cfd8ff" strokeWidth="2" />
          <rect x="72" y={10 + (vol / 50) * 146 + 2} width="22" height={146 - (vol / 50) * 146} fill="#7fb2e6" />
          <path d="M79 160 h8 v14 h-8 z" fill="#cfd8ff" />
          {vol < 50 && <circle className="drip" cx="83" cy="178" r="3" fill="#7fb2e6" />}
          <text x="83" y="6" textAnchor="middle" fontSize="10">NaOH</text>
          {/* kolba */}
          <path d="M68 215 h30 l30 80 q4 14 -10 14 h-70 q-14 0 -10 -14 z" style={{ fill: pink ? '#ff5fae' : '#cfe3ff', fillOpacity: pink ? 0.75 : 0.9, transition: 'fill .7s ease, fill-opacity .7s ease' }} stroke="#cfd8ff" strokeWidth="2" />
          <text x="83" y="330" textAnchor="middle" fontSize="10">HCl + fenolftalein</text>
          {/* grafik */}
          <line x1="230" y1="300" x2="404" y2="300" stroke="#cfd8ff" />
          <line x1="230" y1="300" x2="230" y2="60" stroke="#cfd8ff" />
          <text x="404" y="318" fontSize="10" textAnchor="end">V(NaOH), mL</text>
          <text x="236" y="66" fontSize="10">pH</text>
          {[0, 7, 14].map((p) => <text key={p} x="224" y={cy(p) + 3} fontSize="10" textAnchor="end" fill="#9fabd6">{p}</text>)}
          {[0, 25, 50].map((v) => <text key={v} x={cx(v)} y="314" fontSize="10" textAnchor="middle" fill="#9fabd6">{v}</text>)}
          <line x1="230" x2="400" y1={cy(7)} y2={cy(7)} stroke="#2f3d75" strokeDasharray="3 3" />
          <polyline points={curve} fill="none" stroke="#2f3d75" strokeWidth="2" />
          <polyline points={Array.from({ length: Math.floor(vol / 0.5) + 1 }, (_, k) => k * 0.5).map((v) => `${cx(v)},${cy(pH(v, cBase))}`).join(' ')} fill="none" stroke="#3fdc9a" strokeWidth="3" />
          <circle cx={cx(vol)} cy={cy(value)} r="5" fill="#ff7a66" />
        </svg>
      </div>

      <div className="panel">
        <label>
          NaOH konsentratsiyasi
          <select value={cBase} onChange={(e) => { setCBase(+e.target.value); setVol(0); }}>
            <option value={0.1}>0.1 mol/L</option>
            <option value={0.2}>0.2 mol/L</option>
            <option value={0.25}>0.25 mol/L</option>
          </select>
        </label>
        <div className="row">
          <button className="btn" onClick={() => add(0.1)}>+0.1 mL</button>
          <button className="btn" onClick={() => add(1)}>+1 mL</button>
          <button className="btn primary" onClick={() => add(5)}>+5 mL</button>
          <button className="btn" onClick={() => setVol(0)}>Qayta</button>
        </div>
        <dl className="readout">
          <dt>Qo‘shilgan NaOH</dt><dd>{vol.toFixed(1)} mL</dd>
          <dt>pH</dt><dd>{value.toFixed(2)}</dd>
          <dt>Rang</dt><dd>{pink ? 'pushti' : 'rangsiz'}</dd>
        </dl>
        <div className="info">
          Kolbada 25 mL, 0.1 mol/L HCl. Fenolftalein pH ≈ 8.2 dan yuqorida pushti bo‘ladi. Rang o‘zgargan payt hajmni yozib oling va ekvivalentlik nuqtasi bilan solishtiring.
        </div>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={passed}
        hint="Rang o‘zgargandan keyin yana bir necha mL qo‘shing"
        onSaved={onSaved}
        data={{ 'NaOH (mol/L)': cBase, "qo'shilgan hajm (mL)": vol, pH: +value.toFixed(2), 'ekvivalent hajm (mL)': +eq.toFixed(2) }}
      />
    </div>
  );
}
