import { useEffect, useRef, useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

interface Bubble { id: number; x: number; y: number; r: number }

export default function Photosynthesis({ topicId, onSaved }: SimProps) {
  const [light, setLight] = useState(60);
  const [co2, setCo2] = useState(60);
  const [temp, setTemp] = useState(25);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [collected, setCollected] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // tezlik: cheklovchi omil qoidasi (yorug'lik yoki CO2) x temperatura egri chizig'i
  const tempFactor = Math.exp(-Math.pow((temp - 30) / 12, 2));
  const rate = (Math.min(light, co2) / 100) * tempFactor; // 0..1
  const perMinute = Math.round(rate * 60);

  const params = useRef(rate);
  params.current = rate;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let nextId = 1;
    let list: Bubble[] = [];
    let popped = 0;
    let time = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      acc += params.current * 1 * dt; // 1 pufakcha/s eng yuqori tezlikda
      while (acc >= 1) {
        acc -= 1;
        list.push({ id: nextId++, x: 200 + (Math.random() - 0.5) * 60, y: 200, r: 3 + Math.random() * 3 });
      }
      list = list
        .map((b) => ({ ...b, y: b.y - 55 * dt, x: b.x + Math.sin(b.y / 12) * 0.3 }))
        .filter((b) => {
          if (b.y < 62) { popped++; return false; }
          return true;
        });
      setBubbles(list);
      setCollected(popped);
      setElapsed(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="lab">
      <div className="stage">
        <svg viewBox="0 0 420 340" role="img" aria-label="Suv o‘simligi va kislorod pufakchalari">
          <circle cx="60" cy="50" r={14 + light / 8} fill="#f5c518" fillOpacity={0.3 + light / 150} />
          <circle cx="60" cy="50" r="14" fill="#f5c518" />
          {light > 0 && [0, 1, 2].map((k) => (
            <line key={k} x1={80 + k * 8} y1={68 + k * 12} x2={150 + k * 20} y2={130 + k * 16} stroke="#f5c518" strokeOpacity={light / 100} strokeWidth="3" />
          ))}
          <rect x="130" y="60" width="140" height="240" fill="#0d1531" stroke="#cfd8ff" strokeWidth="2" rx="6" />
          <rect x="132" y="90" width="136" height="208" fill="#1c4a7a" />
          <path d="M200 296 C196 250 206 230 200 205 M200 260 C180 250 176 235 172 225 M200 245 C220 238 226 225 230 215" fill="none" stroke="#3fdc9a" strokeWidth="4" strokeLinecap="round" />
          {bubbles.map((b) => <circle key={b.id} cx={b.x} cy={b.y} r={b.r} fill="#fff" fillOpacity="0.85" stroke="#7fb3d5" />)}
          <text x="200" y="50" textAnchor="middle" fontSize="12" fill="#cfd8ff">O₂: {collected}</text>
        </svg>
      </div>

      <div className="panel">
        <label>
          Yorug‘lik: {light}%
          <input type="range" min={0} max={100} step={10} value={light} onChange={(e) => setLight(+e.target.value)} />
        </label>
        <label>
          CO₂ miqdori: {co2}%
          <input type="range" min={0} max={100} step={10} value={co2} onChange={(e) => setCo2(+e.target.value)} />
        </label>
        <label>
          Suv temperaturasi: {temp} °C
          <input type="range" min={5} max={45} step={5} value={temp} onChange={(e) => setTemp(+e.target.value)} />
        </label>
        <dl className="readout">
          <dt>Fotosintez tezligi</dt><dd>{perMinute} pufakcha/daq</dd>
          <dt>Yig‘ilgan O₂</dt><dd>{collected}</dd>
          <dt>Vaqt</dt><dd>{elapsed.toFixed(0)} s</dd>
        </dl>
        <p className="note">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Tezlikni eng kam omil cheklaydi. Temperatura 30 °C atrofida eng qulay, yuqorida fermentlar buziladi.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={elapsed > 10}
        hint="Kamida 10 soniya kuzating"
        onSaved={onSaved}
        data={{ 'yorug\u2019lik (%)': light, 'CO₂ (%)': co2, 'temperatura (°C)': temp, 'tezlik (pufakcha/daq)': perMinute }}
      />
    </div>
  );
}
