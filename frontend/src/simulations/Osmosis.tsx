import { useEffect, useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

const INSIDE = 0.9; // hujayra ichidagi tuz konsentratsiyasi, %
const DURATION = 6; // s

function targetChange(c: number) {
  return c < INSIDE ? ((INSIDE - c) / INSIDE) * 12 : -(c - INSIDE) * 14;
}

export default function Osmosis({ topicId, onSaved }: SimProps) {
  const [c, setC] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [p, setP] = useState(0);

  const target = targetChange(c);
  const change = target * p;
  const done = p >= 1;

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / 1000 / DURATION);
      setP(1 - Math.pow(1 - x, 2));
      if (x >= 1) { setP(1); setRunning(false); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const radius = 60 * (1 + (change / 100) * 1.6);
  const direction = target > 0.5 ? 'in' : target < -0.5 ? 'out' : 'none';
  const kind = c < INSIDE - 0.05 ? 'gipotonik' : c > INSIDE + 0.05 ? 'gipertonik' : 'izotonik';

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Osmos: hujayra tuz eritmasida">
          <rect x="40" y="70" width="340" height="240" rx="10" fill="#1c4a7a" stroke="#cfd8ff" strokeWidth="2" />
          <text x="210" y="60" textAnchor="middle" fontSize="12" fill="#9fabd6">NaCl eritmasi: {c.toFixed(1)}%</text>
          <circle cx="210" cy="200" r={radius} fill="#fff2cc" stroke="#ffb84d" strokeWidth="3" />
          <circle cx="210" cy="200" r={radius * 0.32} fill="#b7a5e8" />
          {[-1, 0, 1].map((k) => (
            <g key={k} opacity={running ? 1 : 0.35}>
              {direction === 'in' && <path d={`M${120 + k * 90} 120 L${150 + k * 60} 160`} className="flow" stroke="#5b8cff" strokeWidth="3" markerEnd="url(#a)" />}
              {direction === 'out' && <path d={`M${180 + k * 30} 150 L${140 + k * 60} 105`} className="flow" stroke="#ff7a66" strokeWidth="3" markerEnd="url(#b)" />}
            </g>
          ))}
          <defs>
            <marker id="a" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#5b8cff" /></marker>
            <marker id="b" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#ff7a66" /></marker>
          </defs>
        </svg>
      </div>

      <div className="panel">
        <label>
          Tashqi eritma (NaCl): {c.toFixed(1)}%
          <input type="range" min={0} max={3} step={0.1} value={c} disabled={running} onChange={(e) => { setC(+e.target.value); setP(0); }} />
        </label>
        <div className="row">
          <button className="btn primary" disabled={running || done} onClick={() => setRunning(true)}>Boshlash</button>
          <button className="btn" onClick={() => { setRunning(false); setP(0); }}>Qayta</button>
        </div>
        <dl className="readout">
          <dt>Eritma turi</dt><dd>{kind}</dd>
          <dt>Massa o‘zgarishi</dt><dd>{change >= 0 ? '+' : ''}{change.toFixed(1)}%</dd>
        </dl>
        <p className="note">Hujayra ichida 0.9% tuz bor. Tashqi eritma kuchsiz bo‘lsa, suv hujayraga kiradi va u bo‘rtadi. Kuchli bo‘lsa, suv chiqib, hujayra kichrayadi (plazmoliz).</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={done}
        onSaved={onSaved}
        data={{ 'tashqi NaCl (%)': c, 'eritma turi': kind, "massa o'zgarishi (%)": +target.toFixed(1) }}
      />
    </div>
  );
}
