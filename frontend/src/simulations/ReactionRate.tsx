import { useEffect, useRef, useState } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

interface P { x: number; y: number; vx: number; vy: number; kind: 'A' | 'B'; flash: number }

const W = 420, H = 300, R = 6;

export default function ReactionRate({ topicId, onSaved }: SimProps) {
  const [T, setT] = useState(25);
  const [conc, setConc] = useState(1);
  const [cat, setCat] = useState(false);
  const [stats, setStats] = useState({ hits: 0, reactions: 0 });

  const canvas = useRef<HTMLCanvasElement>(null);
  const params = useRef({ T, cat });
  const particles = useRef<P[]>([]);
  const events = useRef<{ t: number; effective: boolean }[]>([]);
  const [measured, setMeasured] = useState(false);

  params.current = { T, cat };

  // zarrachalar soni konsentratsiyaga bog'liq
  useEffect(() => {
    const n = Math.round(conc * 24) * 2;
    particles.current = Array.from({ length: n }, (_, i) => {
      const a = Math.random() * Math.PI * 2;
      return { x: R + Math.random() * (W - 2 * R), y: R + Math.random() * (H - 2 * R), vx: Math.cos(a), vy: Math.sin(a), kind: i % 2 ? 'A' : 'B', flash: 0 };
    });
    events.current = [];
    setMeasured(false);
  }, [conc]);

  useEffect(() => {
    events.current = [];
    setMeasured(false);
  }, [T, cat]);

  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!;
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { T, cat } = params.current;
      const speed = 70 * Math.sqrt((T + 273) / 298);
      // samarali to'qnashuv ehtimoli (Arrhenius'ga o'xshash o'sish, katalizator ehtimolni oshiradi)
      const pEff = Math.min(1, 0.08 * Math.pow(2, (T - 25) / 10) * (cat ? 4 : 1));
      const ps = particles.current;

      for (const p of ps) {
        const m = Math.hypot(p.vx, p.vy) || 1;
        p.x += (p.vx / m) * speed * dt;
        p.y += (p.vy / m) * speed * dt;
        if (p.x < R || p.x > W - R) { p.vx = -p.vx; p.x = Math.max(R, Math.min(W - R, p.x)); }
        if (p.y < R || p.y > H - R) { p.vy = -p.vy; p.y = Math.max(R, Math.min(H - R, p.y)); }
        p.flash = Math.max(0, p.flash - dt);
      }
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          if (a.kind === b.kind) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy < 4 * R * R) {
            const effective = Math.random() < pEff;
            events.current.push({ t: now, effective });
            if (effective) { a.flash = 0.25; b.flash = 0.25; }
            // sekin qaytish
            const tx = a.vx; const ty = a.vy;
            a.vx = b.vx; a.vy = b.vy; b.vx = tx; b.vy = ty;
            a.x += dx * 0.3; a.y += dy * 0.3; b.x -= dx * 0.3; b.y -= dy * 0.3;
          }
        }
      }
      events.current = events.current.filter((e) => now - e.t < 5000);

      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
        ctx.fillStyle = p.flash > 0 ? '#f5c518' : p.kind === 'A' ? '#5b8cff' : '#ffb84d';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const id = setInterval(() => {
      const ev = events.current;
      setStats({ hits: ev.length / 5, reactions: ev.filter((e) => e.effective).length / 5 });
    }, 500);
    const mark = setTimeout(() => setMeasured(true), 6000);
    return () => { cancelAnimationFrame(raf); clearInterval(id); clearTimeout(mark); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [T, cat, conc]);

  return (
    <div className="lab">
      <div className="stage">
        <canvas ref={canvas} width={W} height={H} style={{ background: '#0a1024', borderRadius: 6 }} aria-label="Zarrachalar to‘qnashuvi" />
      </div>

      <div className="panel">
        <label>
          Temperatura: {T} °C
          <input type="range" min={10} max={80} step={5} value={T} onChange={(e) => setT(+e.target.value)} />
        </label>
        <label>
          Konsentratsiya: {conc.toFixed(1)} mol/L
          <input type="range" min={0.2} max={2} step={0.2} value={conc} onChange={(e) => setConc(+e.target.value)} />
        </label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={cat} onChange={(e) => setCat(e.target.checked)} />
          Katalizator qo‘shish
        </label>
        <dl className="readout">
          <dt>To‘qnashuv / s</dt><dd>{stats.hits.toFixed(1)}</dd>
          <dt>Reaksiya / s</dt><dd>{stats.reactions.toFixed(1)}</dd>
        </dl>
        <p className="note">Ko‘k va to‘q sariq zarrachalar A + B reaksiyasi. Sariq chaqnash — samarali to‘qnashuv. Temperatura, konsentratsiya va katalizator reaksiya tezligini oshiradi.</p>
      </div>

      <SaveBar
        topicId={topicId}
        canSave={measured}
        hint="Qiymat barqarorlashguncha 6 soniya kuting"
        onSaved={onSaved}
        data={{ 'temperatura (°C)': T, 'konsentratsiya (mol/L)': conc, katalizator: cat, 'reaksiya tezligi (1/s)': +stats.reactions.toFixed(1) }}
      />
    </div>
  );
}
