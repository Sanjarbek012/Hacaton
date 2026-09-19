import { useEffect, useRef, useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

const PLANETS: Record<string, number> = { Yer: 9.81, Oy: 1.62, Mars: 3.71, Yupiter: 24.79 };

export default function FreeFall({ topicId, onSaved }: SimProps) {
  const [h, setH] = useState(20);
  const [planet, setPlanet] = useState('Yer');
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  const g = PLANETS[planet];
  const total = Math.sqrt((2 * h) / g);
  const fallen = Math.min(h, 0.5 * g * t * t);
  const v = g * t;
  const done = t >= total && t > 0;

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    const tick = (now: number) => {
      const el = (now - start) / 1000;
      if (el >= total) {
        setT(total);
        setRunning(false);
        return;
      }
      setT(el);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function reset() {
    setRunning(false);
    setT(0);
  }

  const top = 30;
  const ground = 300;
  const ballY = top + (fallen / h) * (ground - top - 14);

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Erkin tushayotgan jism">
          <rect x="0" y={ground} width="420" height="40" fill="#1a2650" />
          <line x1="90" y1={top} x2="90" y2={ground} stroke="#5a6aa5" strokeWidth="2" />
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="82" x2="98" y1={top + f * (ground - top)} y2={top + f * (ground - top)} stroke="#5a6aa5" />
              <text x="66" y={top + f * (ground - top) + 4} fontSize="11" textAnchor="end" fill="#9fabd6">
                {Math.round(h * (1 - f))} m
              </text>
            </g>
          ))}
          <circle cx="210" cy={ballY} r="14" fill="#5b8cff" />
          <line x1="210" y1={top} x2="210" y2={ground} stroke="#2f3d75" strokeDasharray="4 4" />
          {v > 0 && (
            <line x1="245" y1={ballY} x2="245" y2={ballY + Math.min(70, v * 1.2)} stroke="#ff7a66" strokeWidth="3" markerEnd="url(#arr)" />
          )}
          <defs>
            <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="#ff7a66" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="panel">
        <label>
          Balandlik: {h} m
          <input type="range" min={1} max={100} value={h} disabled={running} onChange={(e) => { setH(+e.target.value); setT(0); }} />
        </label>
        <label>
          Osmon jismi
          <select value={planet} disabled={running} onChange={(e) => { setPlanet(e.target.value); setT(0); }}>
            {Object.entries(PLANETS).map(([n, val]) => (
              <option key={n} value={n}>{n} (g = {val} m/s²)</option>
            ))}
          </select>
        </label>
        <div className="row">
          <button className="btn primary" disabled={running || done} onClick={() => setRunning(true)}>Qo‘yib yuborish</button>
          <button className="btn" onClick={reset}>Qayta</button>
        </div>
        <dl className="readout">
          <dt>Vaqt</dt><dd>{t.toFixed(2)} s</dd>
          <dt>Yo‘l</dt><dd>{fallen.toFixed(2)} m</dd>
          <dt>Tezlik</dt><dd>{v.toFixed(2)} m/s</dd>
        </dl>
        <p className="note">Formula: h = g·t²/2, v = g·t. Havo qarshiligi hisobga olinmagan.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={done}
        onSaved={onSaved}
        data={{ 'balandlik (m)': h, 'osmon jismi': planet, 'g (m/s²)': g, 'tushish vaqti (s)': +total.toFixed(3), 'oxirgi tezlik (m/s)': +(g * total).toFixed(2) }}
      />
    </div>
  );
}
