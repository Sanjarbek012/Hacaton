import { useEffect, useRef, useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

const G = 9.81;
const PX = 85; // 1 m = 85 px

export default function Pendulum({ topicId, onSaved }: SimProps) {
  const [L, setL] = useState(1);
  const [amp, setAmp] = useState(20);
  const [running, setRunning] = useState(false);
  const [theta, setTheta] = useState((20 * Math.PI) / 180);
  const [measured, setMeasured] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const raf = useRef(0);

  const theoretical = 2 * Math.PI * Math.sqrt(L / G);

  useEffect(() => {
    if (!running) return;
    let th = (amp * Math.PI) / 180;
    let om = 0;
    let simT = 0;
    let lastUp: number | null = null;
    let last = performance.now();
    setMeasured(null);

    const tick = (now: number) => {
      let dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const step = 0.002;
      while (dt > 0) {
        const s = Math.min(step, dt);
        om += (-(G / L) * Math.sin(th)) * s;
        const prev = th;
        th += om * s;
        simT += s;
        dt -= s;
        if (prev < 0 && th >= 0) {
          if (lastUp !== null) setMeasured(simT - lastUp);
          lastUp = simT;
        }
      }
      setTheta(th);
      setTime(simT);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function stop() {
    setRunning(false);
  }
  function reset() {
    setRunning(false);
    setTheta((amp * Math.PI) / 180);
    setMeasured(null);
    setTime(0);
  }

  const px = 210, py = 30;
  const bx = px + L * PX * Math.sin(theta);
  const by = py + L * PX * Math.cos(theta);

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Matematik mayatnik">
          <line x1="140" y1={py} x2="280" y2={py} stroke="#9fabd6" strokeWidth="6" />
          <line x1={px} y1={py} x2={px} y2={py + L * PX} stroke="#2f3d75" strokeDasharray="4 4" />
          <line x1={px} y1={py} x2={bx} y2={by} stroke="#cfd8ff" strokeWidth="2" />
          <circle cx={bx} cy={by} r="14" fill="#5b8cff" />
        </svg>
      </div>

      <div className="panel">
        <label>
          Uzunlik: {L.toFixed(2)} m
          <input type="range" min={0.2} max={3} step={0.05} value={L} disabled={running} onChange={(e) => { setL(+e.target.value); setMeasured(null); }} />
        </label>
        <label>
          Boshlang‘ich burchak: {amp}°
          <input type="range" min={5} max={60} step={1} value={amp} disabled={running} onChange={(e) => { const a = +e.target.value; setAmp(a); setTheta((a * Math.PI) / 180); setMeasured(null); }} />
        </label>
        <div className="row">
          <button className="btn primary" disabled={running} onClick={() => setRunning(true)}>Boshlash</button>
          <button className="btn" disabled={!running} onClick={stop}>To‘xtatish</button>
          <button className="btn" onClick={reset}>Qayta</button>
        </div>
        <dl className="readout">
          <dt>Vaqt</dt><dd>{time.toFixed(1)} s</dd>
          <dt>Nazariy davr</dt><dd>{theoretical.toFixed(3)} s</dd>
          <dt>O‘lchangan davr</dt><dd>{measured ? measured.toFixed(3) + ' s' : '—'}</dd>
        </dl>
        <p className="note">T = 2π√(l/g). Davr amplitudaga deyarli bog‘liq emas, uzunlikka bog‘liq. Katta burchaklarda o‘lchangan davr biroz oshadi.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={measured !== null}
        onSaved={onSaved}
        data={{ 'uzunlik (m)': L, 'burchak (°)': amp, 'nazariy davr (s)': +theoretical.toFixed(3), "o'lchangan davr (s)": measured ? +measured.toFixed(3) : 0 }}
      />
    </div>
  );
}
