import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';

export type V = Record<string, number>;
export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
/** 0..L oralig'ida ping-pong (devorga urilib qaytish) */
export const tri = (u: number, L: number) => L - Math.abs((((u % (2 * L)) + 2 * L) % (2 * L)) - L);
export const fmt = (n: number, d = 2) => {
  if (!Number.isFinite(n)) return '—';
  const p = 10 ** d;
  return String(Math.round(n * p) / p);
};
export const range = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
export const bell = (x: number, mu: number, sd: number) => Math.exp(-(((x - mu) / sd) ** 2));
/** Tasodifiy emas, lekin "tasodifiydek" ko'rinadigan barqaror son (0..1) */
export const rnd = (i: number, seed = 1) => {
  const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const K = { b: '#5b8cff', g: '#cfd8ff', m: '#9fabd6', a: '#ffb84d', r: '#ff7a66', gr: '#3fdc9a', v: '#b07bff', l: '#2f3d75', d: '#0d1531', w: '#1c4a7a' };

/** Doimiy ishlaydigan soat (soniya) */
export function useClock(): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const s = performance.now();
    const tick = (n: number) => {
      setT(Math.max(0, (n - s) / 1000)); // birinchi kadrda vaqt salgina manfiy bo'lishi mumkin
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return t;
}

export interface Var {
  id: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  d?: number;
  options?: { label: string; value: number }[];
}
/** Qisqa yozuv: slayder va tanlov */
export const num = (id: string, label: string, unit: string, min: number, max: number, step: number, value: number, d = 2): Var => ({ id, label, unit, min, max, step, value, d });
export const sel = (id: string, label: string, options: [string, number][], value?: number): Var => ({
  id, label, min: 0, max: 0, step: 1, value: value ?? options[0][1], options: options.map(([l, v]) => ({ label: l, value: v })),
});

export function Control({ v, value, onChange, disabled }: { v: Var; value: number; onChange: (x: number) => void; disabled?: boolean }) {
  if (v.options) {
    return (
      <label>
        {v.label}
        <select value={value} disabled={disabled} onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(Number(e.target.value))}>
          {v.options.map((o) => (
            <option key={o.label} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label>
      {v.label}: {fmt(value, v.d ?? 2)} {v.unit ?? ''}
      <input type="range" min={v.min} max={v.max} step={v.step} value={value} disabled={disabled} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))} />
    </label>
  );
}

export interface Series {
  name: string;
  color: string;
  pts: [number, number][];
}

/** Ko'p chiziqli oddiy grafik. progress (0..1) bo'lsa, chiziq asta-sekin chiziladi. */
export function LineGraph({ series, xl, yl, progress = 1 }: { series: Series[]; xl: string; yl: string; progress?: number }) {
  const all = series.flatMap((s) => s.pts);
  if (all.length === 0) return null;
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys, 0), y1 = Math.max(...ys);
  if (y1 - y0 < 1e-9) y1 = y0 + 1;
  const ox = 46, oy = 176, W = 340, H = 150;
  const sx = (x: number) => ox + ((x - x0) / (x1 - x0 || 1)) * W;
  const sy = (y: number) => oy - ((y - y0) / (y1 - y0)) * H;
  const label = (n: number) => fmt(n, Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : 2);
  return (
    <svg viewBox="0 0 400 220" role="img" aria-label={`${yl} ga qarshi ${xl} grafigi`}>
      <path d={`M${ox} ${oy}H${ox + W}M${ox} ${oy}V${oy - H}`} stroke={K.m} strokeWidth="1.5" fill="none" />
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <text x={sx(x0 + (x1 - x0) * f)} y={oy + 15} fontSize="10" textAnchor="middle" fill={K.m}>{label(x0 + (x1 - x0) * f)}</text>
          <text x={ox - 5} y={sy(y0 + (y1 - y0) * f) + 3} fontSize="10" textAnchor="end" fill={K.m}>{label(y0 + (y1 - y0) * f)}</text>
        </g>
      ))}
      <text x={ox + W} y={oy + 30} fontSize="11" textAnchor="end" fill={K.m}>{xl}</text>
      <text x={ox + 4} y={oy - H - 6} fontSize="11" fill={K.m}>{yl}</text>
      {series.map((s) => {
        const n = Math.max(2, Math.ceil(s.pts.length * progress));
        const shown = s.pts.slice(0, n);
        return (
          <g key={s.name}>
            <polyline points={shown.map((p) => `${sx(p[0])},${sy(p[1])}`).join(' ')} fill="none" stroke={s.color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
            {progress < 1 && shown.length > 0 && <circle cx={sx(shown[shown.length - 1][0])} cy={sy(shown[shown.length - 1][1])} r="4" fill={s.color} />}
          </g>
        );
      })}
      {series.length > 1 && (
        <g fontSize="11">
          {series.map((s, i) => (
            <g key={s.name} transform={`translate(${ox + 10},${oy - H + 6 + i * 15})`}>
              <rect width="10" height="4" y="3" fill={s.color} />
              <text x="15" y="9" fill={K.g}>{s.name}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

export const Svg = ({ children, h = 230 }: { children: ReactNode; h?: number }) => (
  <svg viewBox={`0 0 420 ${h}`} role="img">{children}</svg>
);
