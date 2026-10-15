import type { ReactNode } from 'react';
import { K, Svg, clamp, fmt, rnd, tri, type V } from './common';

export interface OutVal { label: string; unit: string; val: number | string; bar?: { max: number; color?: string } }
type Scene = (v: V, t: number, o: OutVal[]) => ReactNode;

const dash = (t: number, sp = 20) => -t * sp;
const Arrow = ({ x, y, dx, dy, c }: { x: number; y: number; dx: number; dy: number; c: string }) => {
  const l = Math.hypot(dx, dy) || 1;
  const ux = dx / l, uy = dy / l;
  return (
    <g>
      <path d={`M${x} ${y}L${x + dx} ${y + dy}`} stroke={c} strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M${x + dx} ${y + dy}l${-ux * 9 - uy * 5} ${-uy * 9 + ux * 5}l${uy * 10} ${-ux * 10}z`} fill={c} />
    </g>
  );
};
const Beaker = ({ x = 110, y = 40, w = 200, h = 160, level = 0.6, color = K.w, op = 0.75 }: { x?: number; y?: number; w?: number; h?: number; level?: number; color?: string; op?: number }) => (
  <g>
    <rect x={x + 3} y={y + h * (1 - level)} width={w - 6} height={h * level - 2} fill={color} opacity={op} />
    <path d={`M${x} ${y}V${y + h - 12}q0 12 12 12H${x + w - 12}q12 0 12-12V${y}`} fill="none" stroke={K.g} strokeWidth="3.5" strokeLinecap="round" />
  </g>
);
const hue = (l: number) => `hsl(${270 - ((clamp(l, 400, 700) - 400) / 300) * 270} 100% 60%)`;
const PH = ['#d7263d', '#e4572e', '#f3722c', '#f8961e', '#f9c74f', '#c5d86d', '#7bc96f', '#43aa8b', '#3d9db3', '#4d90fe', '#4a6fe3', '#5b5fd6', '#6a4fc4', '#7a3ea8', '#5e2a8c'];
export const selFreq = (p0: number, s: number, env: number, gens: number) => {
  let p = p0;
  const k = env === 1 ? s : -s;
  for (let i = 0; i < gens; i += 1) p = (p * (1 + k)) / (1 + k * p);
  return p;
};

export const SCENES: Record<string, Scene> = {
  none: () => null,

  ruler: (v) => {
    const rd = Math.round(v.len / v.res) * v.res;
    return (
      <Svg h={200}>
        <rect x="30" y="118" width="360" height="42" rx="4" fill="#1a2650" stroke={K.g} />
        {Array.from({ length: 151 }, (_, i) => (
          <line key={i} x1={30 + i * 2.4} x2={30 + i * 2.4} y1="118" y2={118 + (i % 10 === 0 ? 20 : i % 5 === 0 ? 14 : 8)} stroke={K.g} strokeWidth={i % 10 === 0 ? 1.6 : 1} />
        ))}
        {Array.from({ length: 16 }, (_, i) => <text key={i} x={30 + i * 24} y="152" fontSize="11" textAnchor="middle">{i}</text>)}
        <rect x="30" y="78" width={v.len * 24} height="26" rx="4" fill={K.b} />
        <path d={`M${30 + rd * 24} 60V112`} stroke={K.a} strokeWidth="2.5" />
        <text x={30 + rd * 24 + 6} y="60" fontSize="13" fill={K.a}>{fmt(rd, 1)} sm</text>
      </Svg>
    );
  },

  track: (v, t) => {
    const T = 6, tau = t % T, a = v.a ?? 0;
    const s = v.v0 * tau + 0.5 * a * tau * tau, smax = v.v0 * T + 0.5 * a * T * T;
    const px = 30 + (smax > 0 ? (s / smax) * 320 : 0), vel = v.v0 + a * tau, len = clamp(vel * 5, 0, 110);
    return (
      <Svg h={200}>
        <path d="M20 150H400" stroke={K.m} strokeWidth="3" />
        {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${30 + i * 33} 150v9`} stroke={K.m} />)}
        <rect x={px} y="112" width="44" height="26" rx="7" fill={K.b} />
        <circle cx={px + 11} cy="142" r="7" fill={K.g} /><circle cx={px + 33} cy="142" r="7" fill={K.g} />
        {len > 4 && <Arrow x={px + 44} y={125} dx={len} dy={0} c={K.a} />}
        <text x="30" y="60" fontSize="14">t = {fmt(tau, 1)} s,  s = {fmt(s, 1)} m,  v = {fmt(vel, 1)} m/s</text>
      </Svg>
    );
  },

  buoy: (v, t) => {
    const side = 30 + Math.cbrt(v.V) * 6, floats = v.rb < v.rl, frac = floats ? v.rb / v.rl : 1, surf = 100;
    const top = floats ? surf - (1 - frac) * side + Math.sin(t * 2) * 2 : 200 - side;
    const fw = v.rb * v.V, fa = v.rl * v.V * frac, mx = Math.max(fw, fa, 1);
    return (
      <Svg>
        <Beaker x={90} y={40} w={240} h={160} level={0.625} />
        <rect x={210 - side / 2} y={top} width={side} height={side} rx="4" fill={K.a} />
        <Arrow x={210} y={top + side / 2} dx={0} dy={(fw / mx) * 50} c={K.r} />
        <Arrow x={210 + side / 2 + 16} y={top + side / 2} dx={0} dy={-(fa / mx) * 50} c={K.gr} />
        <text x="100" y="30" fontSize="12" fill={K.r}>og‘irlik</text>
        <text x="180" y="30" fontSize="12" fill={K.gr}>Arximed kuchi</text>
        <text x="100" y="222" fontSize="13">{floats ? 'suzadi' : 'cho‘kadi'}</text>
      </Svg>
    );
  },

  pressure: (v) => {
    const lv = clamp(v.h / 8, 0.1, 1), top = 200 - lv * 165;
    return (
      <Svg>
        <rect x="120" y="35" width="180" height="165" rx="6" fill="none" stroke={K.g} strokeWidth="3" />
        <rect x="123" y={top} width="174" height={200 - top - 1} fill={K.w} opacity=".75" />
        {[0.25, 0.5, 0.75, 1].map((f) => <Arrow key={f} x={123} y={top + f * (200 - top - 8)} dx={f * 70 + 6} dy={0} c={K.a} />)}
        <text x="310" y={top + 4} fontSize="13">h = {fmt(v.h, 1)} m</text>
        <text x="16" y="60" fontSize="12" fill={K.a}>bosim chuqurlikka ko‘ra ortadi</text>
      </Svg>
    );
  },

  spring: (v, t) => {
    const stretch = clamp(((v.m * 9.81) / v.k) * 300, 4, 120), tt = t % 8, e = 1 - Math.exp(-0.7 * tt) * Math.cos(6 * tt), L = 60 + stretch * e;
    const pts = Array.from({ length: 13 }, (_, i) => `${i === 0 || i === 12 ? 210 : 210 + (i % 2 ? 16 : -16)},${24 + (i / 12) * L}`).join(' ');
    const s = 22 + v.m * 16;
    return (
      <Svg>
        <path d="M150 22H270" stroke={K.m} strokeWidth="6" strokeLinecap="round" />
        <polyline points={pts} fill="none" stroke={K.g} strokeWidth="3" />
        <rect x={210 - s / 2} y={24 + L} width={s} height={s} rx="4" fill={K.a} />
        <text x="300" y="120" fontSize="13">x = {fmt(((v.m * 9.81) / v.k) * 100, 1)} sm</text>
      </Svg>
    );
  },

  friction: (v, t) => {
    const fmax = v.mu * v.m * 9.81, moves = v.F > fmax, a = moves ? (v.F - fmax) / v.m : 0, tau = t % 5;
    const x = 40 + clamp(0.5 * a * tau * tau * 12, 0, 280);
    return (
      <Svg h={200}>
        <path d="M20 160H400" stroke={K.m} strokeWidth="3" />
        <rect x={x} y="110" width="70" height="50" rx="6" fill={K.b} />
        <Arrow x={x + 70} y={135} dx={clamp(v.F * 2, 4, 100)} dy={0} c={K.gr} />
        <Arrow x={x} y={150} dx={-clamp(Math.min(v.F, fmax) * 2, 4, 100)} dy={0} c={K.r} />
        <text x="30" y="60" fontSize="13">{moves ? `tezlanish a = ${fmt((v.F - fmax) / v.m, 2)} m/s²` : 'jism qo‘zg‘almaydi'}</text>
      </Svg>
    );
  },

  lever: (v) => {
    const m1 = v.F1 * v.d1, m2 = v.F2 * v.d2, ang = clamp(((m2 - m1) / (Math.max(m1, m2) + 1e-6)) * 15, -15, 15);
    return (
      <Svg>
        <path d="M210 150l-22 45h44z" fill={K.m} />
        <g transform={`rotate(${ang} 210 150)`}>
          <rect x="30" y="144" width="360" height="12" rx="4" fill={K.g} />
          <rect x={210 - v.d1 * 30 - 15} y={100} width="30" height="44" rx="4" fill={K.b} />
          <rect x={210 + v.d2 * 30 - 15} y={100} width="30" height="44" rx="4" fill={K.a} />
          <text x={210 - v.d1 * 30} y="92" fontSize="12" textAnchor="middle">{v.F1} N</text>
          <text x={210 + v.d2 * 30} y="92" fontSize="12" textAnchor="middle">{v.F2} N</text>
        </g>
        <text x="30" y="30" fontSize="13">{Math.abs(m1 - m2) < 0.05 ? 'muvozanat' : m1 > m2 ? 'chap tomon og‘ir' : 'o‘ng tomon og‘ir'}</text>
      </Svg>
    );
  },

  energy: (v, t) => {
    const L = 2, th0 = Math.acos(clamp(1 - v.h0 / L, -1, 1)), th = th0 * Math.cos(Math.sqrt(9.81 / L) * t), h = L * (1 - Math.cos(th));
    const tot = v.m * 9.81 * v.h0, pe = v.m * 9.81 * h, ke = Math.max(0, tot - pe), bx = 150 + 130 * Math.sin(th), by = 24 + 130 * Math.cos(th);
    const bar = (x: number, val: number, c: string, n: string) => (
      <g key={n}><rect x={x} y={200 - (val / (tot || 1)) * 130} width="24" height={(val / (tot || 1)) * 130} fill={c} /><text x={x + 12} y="216" fontSize="10" textAnchor="middle">{n}</text></g>
    );
    return (
      <Svg>
        <path d="M110 22H190" stroke={K.m} strokeWidth="6" strokeLinecap="round" />
        <path d={`M150 24L${bx} ${by}`} stroke={K.g} strokeWidth="2" />
        <circle cx={bx} cy={by} r="14" fill={K.b} />
        {bar(320, pe, K.b, 'Ep')}{bar(350, ke, K.a, 'Ek')}{bar(380, tot, K.gr, 'E')}
      </Svg>
    );
  },

  gasbox: (v, t) => {
    const n = Math.min(60, Math.round(v.N)), w = 80 + (v.V ?? 10) * 14, sp = Math.sqrt(v.T) * 2.2;
    return (
      <Svg>
        <rect x="20" y="30" width={w} height="150" rx="6" fill="none" stroke={K.g} strokeWidth="3" />
        {Array.from({ length: n }, (_, i) => {
          const k = 0.5 + rnd(i, 3);
          return <circle key={i} cx={26 + tri(rnd(i, 1) * (w - 12) + sp * k * t, w - 12)} cy={36 + tri(rnd(i, 2) * 138 + sp * (0.6 + rnd(i, 4)) * t, 138)} r="3.5" fill={k > 1 ? K.a : K.b} />;
        })}
        <text x={w + 40} y="60" fontSize="13">T = {fmt(v.T, 0)} K</text>
        <text x={w + 40} y="82" fontSize="12" fill={K.m}>tez zarralar sariq</text>
      </Svg>
    );
  },

  heater: (v, t) => {
    const tr = (t % 10) * 60, T = 20 + (v.P * tr) / (v.c * v.m), frac = clamp((T - 20) / 80, 0, 1), fl = 0.5 + (v.P / 2000) * 0.9 + Math.sin(t * 12) * 0.05;
    return (
      <Svg>
        <Beaker x={90} y={50} w={170} h={120} level={0.3 + v.m * 0.25} />
        <path d={`M175 ${205 - 30 * fl}q-16 20 0 30q16-10 0-30z`} fill={K.a} />
        <rect x="320" y="40" width="14" height="130" rx="7" fill="#1a2650" stroke={K.g} />
        <rect x="323" y={165 - frac * 120} width="8" height={frac * 120 + 2} rx="4" fill={K.r} />
        <text x="290" y="30" fontSize="13">T = {fmt(T, 0)} °C,  t = {fmt(tr / 60, 1)} daq</text>
      </Svg>
    );
  },

  phase: (v, t) => {
    const T = v.T, st = T < 0 ? 0 : T < 100 ? 1 : 2, n = 36, amp = 1 + ((T + 30) / 160) * 4, col = st === 0 ? '#9fc2ff' : st === 1 ? K.b : K.a;
    return (
      <Svg>
        <rect x="60" y="30" width="300" height="170" rx="6" fill="none" stroke={K.g} strokeWidth="3" />
        {Array.from({ length: n }, (_, i) => {
          const gx = 96 + (i % 9) * 28, gy = st === 0 ? 100 + Math.floor(i / 9) * 26 : 130 + Math.floor(i / 9) * 17;
          const x = st === 2 ? 68 + tri(rnd(i, 1) * 280 + 60 * (0.5 + rnd(i, 4)) * t, 280) : gx + Math.sin(t * (st === 0 ? 9 : 2) + i) * amp * (st === 1 ? 3 : 1);
          const y = st === 2 ? 38 + tri(rnd(i, 2) * 154 + 50 * (0.5 + rnd(i, 3)) * t, 154) : gy + Math.cos(t * (st === 0 ? 8 : 2.4) + i * 2) * amp * (st === 1 ? 2 : 1);
          return <circle key={i} cx={x} cy={y} r="7" fill={col} />;
        })}
        <text x="70" y="24" fontSize="13">{st === 0 ? 'muz (qattiq)' : st === 1 ? 'suv (suyuq)' : 'bug‘ (gaz)'},  {fmt(T, 0)} °C</text>
      </Svg>
    );
  },

  charges: (v) => {
    const d = 20 + v.r * 4, x1 = 210 - d / 2, x2 = 210 + d / 2, F = (9e9 * Math.abs(v.q1 * v.q2) * 1e-12) / ((v.r / 100) ** 2), len = clamp(Math.log10(F + 1) * 28, 4, 90), att = v.q1 * v.q2 < 0;
    const c = (q: number) => (q >= 0 ? K.r : K.b);
    return (
      <Svg h={200}>
        <circle cx={x1} cy="100" r={12 + Math.abs(v.q1) * 1.4} fill={c(v.q1)} /><text x={x1} y="106" fontSize="18" textAnchor="middle" fill="#0a1024">{v.q1 >= 0 ? '+' : '−'}</text>
        <circle cx={x2} cy="100" r={12 + Math.abs(v.q2) * 1.4} fill={c(v.q2)} /><text x={x2} y="106" fontSize="18" textAnchor="middle" fill="#0a1024">{v.q2 >= 0 ? '+' : '−'}</text>
        <Arrow x={x1} y={150} dx={att ? len : -len} dy={0} c={K.a} />
        <Arrow x={x2} y={150} dx={att ? -len : len} dy={0} c={K.a} />
        <text x="20" y="40" fontSize="13">{att ? 'tortishadi' : 'itarishadi'}</text>
      </Svg>
    );
  },

  circuit: (v) => {
    const par = v.mode === 1, R2 = v.R2 ?? 0, dur = clamp(0.6 / Math.max(v.I ?? 0.1, 0.05), 0.3, 6);
    const path = par ? 'M60 60H360M60 170H360M60 60V170M180 60V170M300 60V170' : 'M60 60H360V170H60Z';
    const box = (x: number, y: number, w: number, h: number, l: string) => (
      <g key={l + x}><rect x={x} y={y} width={w} height={h} rx="3" fill="#0d1531" stroke={K.g} strokeWidth="2.5" /><text x={x + w / 2} y={y + h / 2 + 4} fontSize="11" textAnchor="middle">{l}</text></g>
    );
    return (
      <Svg>
        <path d={path} fill="none" stroke={K.l} strokeWidth="3" />
        <path className="wire-flow" d={path} fill="none" stroke={K.a} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="0.1 14" style={{ animationDuration: `${dur}s` }} />
        <rect x="46" y="100" width="28" height="30" fill="#0d1531" /><path d="M50 104h20M56 114h8M50 124h20" stroke={K.g} strokeWidth="3" strokeLinecap="round" />
        {par ? <>{box(168, 100, 24, 40, 'R₁')}{box(288, 100, 24, 40, 'R₂')}</> : <>{box(140, 46, 50, 28, 'R₁')}{R2 > 0 && box(260, 46, 50, 28, 'R₂')}</>}
        <text x="20" y="30" fontSize="13">{par ? 'parallel ulanish' : 'ketma-ket ulanish'},  I = {fmt(v.I ?? 0, 2)} A</text>
      </Svg>
    );
  },

  magwire: (v, t) => {
    const cx = 150, cy = 115, rp = 20 + v.r * 3, sway = Math.sin(t * 3) * 6 * Math.exp(-((t % 4) * 1.2));
    return (
      <Svg>
        {[30, 60, 90].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={K.m} strokeDasharray="6 6" strokeDashoffset={dash(t, 14)} />)}
        <circle cx={cx} cy={cy} r="10" fill={K.a} /><circle cx={cx} cy={cy} r="3" fill="#0a1024" />
        <g transform={`translate(${cx + rp} ${cy}) rotate(${sway})`}><path d="M0 -16V0" stroke={K.r} strokeWidth="5" /><path d="M0 0V16" stroke={K.b} strokeWidth="5" /></g>
        <text x="270" y="110" fontSize="13">B = {fmt(v.B ?? 0, 1)} μT</text>
        <text x="270" y="132" fontSize="12" fill={K.m}>kompas maydonga urinma</text>
      </Svg>
    );
  },

  refraction: (v) => {
    const t1 = (v.ang * Math.PI) / 180, s2 = (v.n1 * Math.sin(t1)) / v.n2, tir = s2 > 1, t2 = tir ? 0 : Math.asin(s2), cx = 210, cy = 115, L = 100;
    return (
      <Svg>
        <rect x="20" y="10" width="380" height="105" fill={K.b} opacity={0.05 + v.n1 * 0.05} />
        <rect x="20" y="115" width="380" height="105" fill={K.b} opacity={0.05 + v.n2 * 0.05} />
        <path d="M20 115H400" stroke={K.g} strokeWidth="2" /><path d="M210 15V215" stroke={K.m} strokeDasharray="5 5" />
        <path d={`M${cx - L * Math.sin(t1)} ${cy - L * Math.cos(t1)}L${cx} ${cy}`} stroke={K.a} strokeWidth="3" />
        <path d={`M${cx} ${cy}L${cx + L * Math.sin(t1)} ${cy - L * Math.cos(t1)}`} stroke={K.a} strokeWidth="2" opacity=".55" />
        {!tir && <path d={`M${cx} ${cy}L${cx + L * Math.sin(t2)} ${cy + L * Math.cos(t2)}`} stroke={K.gr} strokeWidth="3" />}
        <text x="26" y="30" fontSize="13">n₁ = {v.n1}</text><text x="26" y="210" fontSize="13">n₂ = {v.n2}</text>
        {tir && <text x="230" y="180" fontSize="13" fill={K.r}>to‘liq ichki qaytish</text>}
      </Svg>
    );
  },

  orbit: (v, t) => {
    const T = Math.sqrt(v.r ** 3 / v.M), a = (2 * Math.PI * t) / (T * 1.25 + 0.2), R = 18 + v.r * 20, px = 210 + R * Math.cos(a), py = 115 + R * Math.sin(a);
    const fl = clamp((v.M / v.r ** 2) * 16, 6, 60);
    return (
      <Svg>
        <circle cx="210" cy="115" r={R} fill="none" stroke={K.l} strokeDasharray="4 5" />
        <circle cx="210" cy="115" r={9 + v.M * 5} fill={K.a} />
        <circle cx={px} cy={py} r="7" fill={K.b} />
        <Arrow x={px} y={py} dx={((210 - px) / R) * fl} dy={((115 - py) / R) * fl} c={K.r} />
        <text x="20" y="28" fontSize="13">T = {fmt(T, 2)} yil</text>
      </Svg>
    );
  },

  collision: (v, t) => {
    const tau = t % 6, tc = 2, xc = 230, w1 = 26 + v.m1 * 4, w2 = 26 + v.m2 * 4, k = 22;
    const v1p = (v.v1 * (v.m1 - v.e * v.m2)) / (v.m1 + v.m2), v2p = (v.v1 * v.m1 * (1 + v.e)) / (v.m1 + v.m2);
    const x1 = clamp(tau < tc ? xc - w1 - k * v.v1 * (tc - tau) : xc - w1 + k * v1p * (tau - tc), 6, 410 - w1);
    const x2 = clamp(tau < tc ? xc : xc + k * v2p * (tau - tc), 6, 410 - w2);
    return (
      <Svg h={200}>
        <path d="M10 160H410" stroke={K.m} strokeWidth="3" />
        <rect x={x1} y={160 - 20 - v.m1 * 2} width={w1} height={20 + v.m1 * 2} rx="4" fill={K.b} />
        <rect x={x2} y={160 - 20 - v.m2 * 2} width={w2} height={20 + v.m2 * 2} rx="4" fill={K.a} />
        <text x="20" y="40" fontSize="13">{v.e >= 1 ? 'absolyut elastik urilish' : v.e <= 0 ? 'noelastik (yopishadi)' : 'qisman elastik urilish'}</text>
      </Svg>
    );
  },

  wave: (v, t) => {
    const vis = v.audio ? v.f / 100 : v.f, A = 8 + v.A * 7, ph = vis * t * 0.5;
    const pts = Array.from({ length: 96 }, (_, i) => `${20 + i * 4},${115 - A * Math.sin(2 * Math.PI * ((i * 4) / 120 - ph))}`).join(' ');
    return (
      <Svg>
        <path d="M20 115H400" stroke={K.l} />
        <polyline points={pts} fill="none" stroke={K.b} strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 40h120M20 34v12M140 34v12" stroke={K.a} strokeWidth="2" /><text x="80" y="30" fontSize="13" textAnchor="middle" fill={K.a}>λ</text>
        <path d={`M410 115v${-A}`} stroke={K.gr} strokeWidth="3" /><text x="392" y={115 - A / 2} fontSize="12" fill={K.gr}>A</text>
      </Svg>
    );
  },

  induction: (v, t) => {
    const w = v.w * 0.6, x = 90 * Math.sin(w * t), emfMax = v.N * v.B * 0.005 * v.w, needle = clamp(Math.cos(w * t) * (emfMax > 0 ? Math.min(1, emfMax / 40) : 0) * 55, -55, 55), n = Math.min(12, Math.round(v.N));
    return (
      <Svg>
        {Array.from({ length: n }, (_, i) => <ellipse key={i} cx={190 + i * 4} cy="90" rx="16" ry="34" fill="none" stroke={K.a} strokeWidth="2.5" />)}
        <g transform={`translate(${x} 0)`}><rect x="140" y="77" width="35" height="26" fill={K.r} /><rect x="175" y="77" width="35" height="26" fill={K.b} /><text x="157" y="95" fontSize="13" textAnchor="middle" fill="#0a1024">N</text><text x="192" y="95" fontSize="13" textAnchor="middle" fill="#0a1024">S</text></g>
        <path d="M150 200a55 55 0 0 1 110 0" fill="none" stroke={K.g} strokeWidth="3" />
        <path d={`M205 200L${205 + 50 * Math.sin((needle * Math.PI) / 180)} ${200 - 50 * Math.cos((needle * Math.PI) / 180)}`} stroke={K.gr} strokeWidth="3" />
        <text x="290" y="180" fontSize="13">galvanometr</text>
      </Svg>
    );
  },

  circular: (v, t) => {
    const R = 80, cx = 210, cy = 115, th = (v.v / v.r) * t, bx = cx + R * Math.cos(th), by = cy + R * Math.sin(th), lv = clamp(v.v * 8, 8, 80), la = clamp(((v.v * v.v) / v.r) * 6, 8, 80);
    return (
      <Svg>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={K.l} strokeDasharray="4 5" /><circle cx={cx} cy={cy} r="3" fill={K.m} />
        <circle cx={bx} cy={by} r="10" fill={K.b} />
        <Arrow x={bx} y={by} dx={-Math.sin(th) * lv} dy={Math.cos(th) * lv} c={K.a} />
        <Arrow x={bx} y={by} dx={-Math.cos(th) * la} dy={-Math.sin(th) * la} c={K.r} />
        <text x="20" y="28" fontSize="12" fill={K.a}>tezlik (urinma)</text><text x="20" y="46" fontSize="12" fill={K.r}>markazga intilma tezlanish</text>
      </Svg>
    );
  },

  projectile: (v, t) => {
    const th = (v.ang * Math.PI) / 180, T = (2 * v.v0 * Math.sin(th)) / v.g, R = (v.v0 ** 2 * Math.sin(2 * th)) / v.g, H = (v.v0 * Math.sin(th)) ** 2 / (2 * v.g);
    const s = Math.min(370 / Math.max(R, 1), 150 / Math.max(H, 0.5)), tau = Math.min(T, t % (T + 1.5));
    const pos = (q: number): [number, number] => [25 + v.v0 * Math.cos(th) * q * s, 200 - (v.v0 * Math.sin(th) * q - 0.5 * v.g * q * q) * s];
    const pts = Array.from({ length: 41 }, (_, i) => pos((T * i) / 40).join(',')).join(' '), [bx, by] = pos(tau);
    return (
      <Svg>
        <path d="M10 200H410" stroke={K.m} strokeWidth="3" />
        <polyline points={pts} fill="none" stroke={K.l} strokeWidth="2" strokeDasharray="5 5" />
        <circle cx={bx} cy={by} r="8" fill={K.a} />
        <text x="20" y="30" fontSize="13">t = {fmt(tau, 2)} s</text>
      </Svg>
    );
  },

  incline: (v, t) => {
    const th = (v.ang * Math.PI) / 180, g = 9.81, a = g * (Math.sin(th) - v.mu * Math.cos(th)), moves = a > 0, L = 290, ex = 60 + L * Math.cos(th), ey = 205 - L * Math.sin(th);
    const u = clamp(20 + (moves ? 0.5 * a * (t % 4) ** 2 * 14 : 0), 20, L - 24), bx = ex - u * Math.cos(th), by = ey + u * Math.sin(th);
    return (
      <Svg>
        <path d={`M60 205L${ex} 205L${ex} ${ey}Z`} fill="#17224a" stroke={K.g} strokeWidth="2.5" strokeLinejoin="round" />
        <g transform={`translate(${bx} ${by}) rotate(${-v.ang})`}><rect x="-16" y="-24" width="32" height="24" rx="3" fill={K.b} /></g>
        <text x="20" y="28" fontSize="13">{moves ? `sirpanadi, a = ${fmt(a, 2)} m/s²` : 'ishqalanish ushlab turadi'}</text>
      </Svg>
    );
  },

  piston: (v, t) => {
    const P = (v.n * 8.314 * v.T) / v.V, py = 200 - (v.V / 30) * 150, sp = Math.sqrt(v.T) * 1.6, fl = clamp(v.T / 600, 0.2, 1);
    return (
      <Svg>
        <path d="M140 30V200H280V30" fill="none" stroke={K.g} strokeWidth="3" />
        <rect x="142" y={py} width="136" height="10" fill={K.m} /><path d={`M210 ${py}V20`} stroke={K.m} strokeWidth="6" />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={150 + tri(rnd(i, 1) * 118 + sp * (0.5 + rnd(i, 3)) * t, 118)} cy={py + 18 + tri(rnd(i, 2) * (170 - (py - 30)) + sp * (0.6 + rnd(i, 4)) * t, Math.max(10, 200 - py - 26))} r="3.5" fill={K.b} />)}
        <path d={`M210 ${212 - 22 * fl}q-14 12 0 20q14-8 0-20z`} fill={K.a} />
        <rect x="320" y={200 - clamp((P / 1000) * 120, 4, 120)} width="26" height={clamp((P / 1000) * 120, 4, 120)} fill={K.r} /><text x="333" y="216" fontSize="11" textAnchor="middle">p</text>
      </Svg>
    );
  },

  capacitor: (v, t) => {
    const tau = v.R * v.C * 1e-3, tt = ((t % 6) / 6) * 5 * tau, f = 1 - Math.exp(-tt / tau), k = Math.round(f * 8);
    return (
      <Svg>
        <path d="M100 115H170M250 115H320" stroke={K.g} strokeWidth="3" /><rect x="168" y="50" width="8" height="130" fill={K.b} /><rect x="244" y="50" width="8" height="130" fill={K.a} />
        {Array.from({ length: k }, (_, i) => <g key={i}><text x="155" y={68 + i * 14} fontSize="14" fill={K.r}>+</text><text x="258" y={68 + i * 14} fontSize="14" fill={K.b}>−</text></g>)}
        <text x="20" y="28" fontSize="13">U_C = {fmt(v.U * f, 2)} V  ({fmt(f * 100, 0)} %)</text>
      </Svg>
    );
  },

  lc: (v, t) => {
    const w = clamp(v.f / 100, 0.6, 8), ph = w * t, c = Math.cos(ph) ** 2, l = Math.sin(ph) ** 2;
    return (
      <Svg>
        <rect x="60" y="80" width="80" height="120" fill="none" stroke={K.g} strokeWidth="3" /><text x="100" y="72" fontSize="12" textAnchor="middle">kondensator</text>
        <rect x={60} y={200 - c * 120} width="80" height={c * 120} fill={K.b} opacity=".8" />
        <rect x="200" y="80" width="80" height="120" fill="none" stroke={K.g} strokeWidth="3" /><text x="240" y="72" fontSize="12" textAnchor="middle">g‘altak</text>
        <rect x={200} y={200 - l * 120} width="80" height={l * 120} fill={K.a} opacity=".8" />
        <text x="310" y="120" fontSize="13">energiya almashadi</text>
      </Svg>
    );
  },

  ac: (v, t) => {
    const ph = (v.f / 10) * t * 2 * Math.PI, A = (v.Em / 311) * 60 + 10, mx = 200 + ((ph / (2 * Math.PI)) % 1) * 200;
    const pts = Array.from({ length: 51 }, (_, i) => `${200 + i * 4},${115 - A * Math.sin((i / 50) * 2 * Math.PI)}`).join(' ');
    return (
      <Svg>
        <rect x="20" y="30" width="20" height="170" fill={K.r} opacity=".6" /><rect x="160" y="30" width="20" height="170" fill={K.b} opacity=".6" />
        <ellipse cx="100" cy="115" rx={Math.max(4, Math.abs(Math.cos(ph)) * 44)} ry="60" fill="none" stroke={K.a} strokeWidth="4" />
        <path d="M200 115H400" stroke={K.l} /><polyline points={pts} fill="none" stroke={K.gr} strokeWidth="3" />
        <circle cx={mx} cy={115 - A * Math.sin(ph)} r="5" fill={K.a} />
      </Svg>
    );
  },

  emwave: (v, t) => {
    const lp = clamp(60 + (Math.log10(300 / v.f) + 0.5) * 45, 40, 220), ph = t * 0.6;
    const pt = (base: number, amp: number) => Array.from({ length: 96 }, (_, i) => `${20 + i * 4},${base - amp * Math.sin(2 * Math.PI * ((i * 4) / lp - ph))}`).join(' ');
    return (
      <Svg>
        <polyline points={pt(85, 50)} fill="none" stroke={K.b} strokeWidth="3" /><polyline points={pt(170, 30)} fill="none" stroke={K.a} strokeWidth="3" strokeDasharray="6 4" />
        <text x="20" y="24" fontSize="13" fill={K.b}>E (elektr maydon)</text><text x="20" y="215" fontSize="13" fill={K.a}>B (magnit maydon, ⟂ E)</text>
      </Svg>
    );
  },

  lens: (v) => {
    const s = 3, cx = 210, cy = 115, inf = Math.abs(v.d - v.f) < 0.4, di = inf ? 1e9 : 1 / (1 / v.f - 1 / v.d), ox = cx - v.d * s, oy = cy - v.h * s, ix = cx + di * s, iy = cy + (v.h * di * s) / v.d;
    const real = di > 0 && !inf;
    return (
      <Svg>
        <path d={`M20 ${cy}H400`} stroke={K.l} /><ellipse cx={cx} cy={cy} rx="8" ry="80" fill={K.b} opacity=".35" stroke={K.g} strokeWidth="2" />
        <path d={`M${cx - v.f * s} ${cy - 5}v10M${cx + v.f * s} ${cy - 5}v10`} stroke={K.m} strokeWidth="2" />
        <Arrow x={ox} y={cy} dx={0} dy={-v.h * s} c={K.a} />
        {!inf && real && ix < 405 && <>
          <path d={`M${ox} ${oy}H${cx}L${ix} ${iy}`} stroke={K.gr} strokeWidth="2" fill="none" /><path d={`M${ox} ${oy}L${ix} ${iy}`} stroke={K.gr} strokeWidth="2" opacity=".7" />
          <Arrow x={ix} y={cy} dx={0} dy={iy - cy} c={K.r} /></>}
        {!inf && !real && <Arrow x={ix < 15 ? 15 : ix} y={cy} dx={0} dy={iy - cy} c={K.r} />}
        <text x="20" y="28" fontSize="13">{inf ? 'tasvir cheksizlikda' : real ? 'haqiqiy, teskari tasvir' : 'mavhum, to‘g‘ri tasvir'}</text>
      </Svg>
    );
  },

  slit: (v) => {
    const pts = Array.from({ length: 181 }, (_, i) => {
      const y = (i - 90) / 9;
      const I = Math.cos((Math.PI * v.d * y * 1000) / (v.lambda * v.L)) ** 2;
      return `${20 + i * 2.1},${205 - I * 120}`;
    }).join(' ');
    return (
      <Svg>
        <path d="M20 205H400" stroke={K.l} />
        <polygon points={`20,205 ${pts} 400,205`} fill={hue(v.lambda)} opacity=".85" />
        <text x="20" y="28" fontSize="13">ekrandagi yorug‘lik intensivligi (±10 mm)</text>
      </Svg>
    );
  },

  relativity: (v, t) => {
    const g = 1 / Math.sqrt(1 - v.v * v.v), x = 20 + ((t * 30) % 320);
    return (
      <Svg h={200}>
        <rect x={x} y="70" width={Math.max(14, 120 / g)} height="40" rx="14" fill={K.b} />
        <text x="30" y="150" fontSize="13">tinch soat: {Math.floor(t)} s</text><text x="230" y="150" fontSize="13" fill={K.a}>harakatdagi soat: {Math.floor(t / g)} s</text>
        <text x="30" y="40" fontSize="13">uzunlik {fmt(120 / g, 0)} birlik (tinchlikda 120)</text>
      </Svg>
    );
  },

  photoeffect: (v, t) => {
    const ke = 0.4136 * v.f - v.W, n = Math.max(1, Math.round(v.I / 2));
    return (
      <Svg>
        <rect x="200" y="40" width="20" height="150" fill={K.m} />
        {Array.from({ length: n }, (_, i) => { const p = ((t * 60 + i * 55) % 190); return <path key={i} d={`M${10 + p} ${60 + i * 26 + p * 0.1}q6 -8 12 0t12 0`} stroke={hue(760 - v.f * 30)} strokeWidth="2.5" fill="none" />; })}
        {ke > 0 && Array.from({ length: n }, (_, i) => { const p = ((t * (30 + Math.sqrt(ke) * 50) + i * 40) % 170); return <circle key={i} cx={225 + p} cy={70 + i * 24} r="4" fill={K.gr} />; })}
        <text x="20" y="220" fontSize="13">{ke > 0 ? `elektronlar chiqadi, Ek = ${fmt(ke, 2)} eV` : 'foton energiyasi yetmaydi, elektron chiqmaydi'}</text>
      </Svg>
    );
  },

  conduct: (v, t) => {
    const br = clamp(v.c * v.alpha * 1.6, 0, 1), n = Math.round(v.c * v.alpha * 40);
    return (
      <Svg>
        <circle cx="210" cy="50" r="24" fill={K.a} opacity={0.1 + br * 0.9} stroke={K.g} strokeWidth="2.5" /><path d="M210 74V94M180 94H240" stroke={K.g} strokeWidth="3" />
        <Beaker x={120} y={100} w={180} h={110} level={0.65} />
        <rect x="150" y="96" width="6" height="90" fill={K.m} /><rect x="264" y="96" width="6" height="90" fill={K.m} />
        {Array.from({ length: n }, (_, i) => <circle key={i} cx={165 + tri(rnd(i, 1) * 90 + 12 * t * (0.5 + rnd(i, 2)), 90)} cy={125 + tri(rnd(i, 3) * 60 + 8 * t, 60)} r="3" fill={i % 2 ? K.r : K.b} />)}
      </Svg>
    );
  },

  flask: (v, t) => {
    const lev = clamp(v.lev ?? 0.6, 0.15, 0.95), it = clamp(v.int ?? 0.5, 0, 1), und = clamp(v.und ?? 0, 0, 1);
    return (
      <Svg>
        <Beaker x={130} y={30} w={160} h={170} level={lev} color={K.v} op={0.15 + it * 0.75} />
        {und > 0 && <rect x="135" y="192" width="150" height={und * 40} rx="4" fill="#f4f4ee" opacity=".9" />}
        {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={150 + i * 22} cy={190 - ((t * 20 + i * 30) % 100) * lev} r="2.5" fill="#fff" opacity=".4" />)}
      </Svg>
    );
  },

  balloon: (v) => {
    const r = 22 + Math.cbrt(v.V) * 24;
    return (
      <Svg>
        <path d={`M210 ${190 - r * 0.2}l-8 24h16z`} fill={K.m} /><ellipse cx="210" cy={160 - r} rx={r} ry={r * 1.12} fill={K.b} opacity=".85" />
        <text x="210" y={165 - r} fontSize="15" textAnchor="middle" fill="#0a1024">{fmt(v.V, 1)} L</text>
      </Svg>
    );
  },

  equil: (v) => {
    const f = clamp(v.frac, 0, 1);
    return (
      <Svg>
        <rect x="150" y="40" width="50" height="150" rx="10" fill={`rgba(160,80,20,${0.1 + f * 0.85})`} stroke={K.g} strokeWidth="3" />
        <text x="175" y="210" fontSize="12" textAnchor="middle">NO₂ / N₂O₄</text>
        <rect x="260" y={190 - f * 140} width="40" height={f * 140} fill="#a05014" /><rect x="320" y={190 - (1 - f) * 140} width="40" height={(1 - f) * 140} fill={K.g} opacity=".7" />
        <text x="280" y="208" fontSize="11" textAnchor="middle">NO₂</text><text x="340" y="208" fontSize="11" textAnchor="middle">N₂O₄</text>
      </Svg>
    );
  },

  chain: (v, t) => {
    const n = Math.round(v.n);
    return (
      <Svg>
        {Array.from({ length: n }, (_, i) => { const x = 36 + (i % 10) * 36, y = 80 + Math.floor(i / 10) * 60 + Math.sin(t * 2 + i) * 4; return <g key={i}>{i % 10 !== 9 && i < n - 1 && <path d={`M${x + 10} ${y}H${x + 26}`} stroke={K.g} strokeWidth="3" />}<circle cx={x} cy={y} r="11" fill={i % 2 ? K.b : K.v} /></g>; })}
        <text x="20" y="30" fontSize="13">n = {n} zveno (monomer)</text>
      </Svg>
    );
  },

  ediagram: (v) => {
    const ya = 130, yt = clamp(ya - v.Ea * 0.5, 30, 130), yb = clamp(ya - v.dH * 0.5, 50, 210);
    return (
      <Svg>
        <path d="M30 20V215H400" stroke={K.m} fill="none" /><text x="36" y="32" fontSize="12" fill={K.m}>E</text>
        <path d={`M50 ${ya}H130C170 ${ya} 170 ${yt} 210 ${yt}S250 ${yb} 290 ${yb}H380`} fill="none" stroke={K.a} strokeWidth="3.5" />
        <path d={`M80 ${ya}V${yt}`} stroke={K.r} strokeDasharray="4 4" /><text x="86" y={(ya + yt) / 2} fontSize="12" fill={K.r}>Ea</text>
        <path d={`M340 ${ya}V${yb}`} stroke={K.gr} strokeDasharray="4 4" /><text x="346" y={(ya + yb) / 2} fontSize="12" fill={K.gr}>ΔH</text>
        <text x="50" y="215" fontSize="12">reagentlar</text><text x="330" y="215" fontSize="12">mahsulotlar</text>
      </Svg>
    );
  },

  phstrip: (v) => (
    <Svg>
      <Beaker x={130} y={30} w={160} h={170} level={0.7} color={PH[clamp(Math.round(v.pH), 0, 14)]} op={0.85} />
      {PH.map((c, i) => <rect key={i} x={30 + i * 24} y="214" width="22" height="10" fill={c} stroke={Math.round(v.pH) === i ? '#fff' : 'none'} strokeWidth="2" />)}
    </Svg>
  ),

  electrolysis: (v, t) => {
    const f = clamp(v.mf ?? 0.3, 0.02, 1);
    return (
      <Svg>
        <Beaker x={100} y={50} w={220} h={150} level={0.7} color="#3b7ea1" />
        <rect x="150" y="30" width="16" height="130" fill={K.m} /><rect x="254" y="30" width="16" height="130" fill={K.m} />
        <rect x={140} y="100" width={10 + f * 10} height="60" fill={K.a} opacity=".9" />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx={262 + Math.sin(t * 3 + i) * 6} cy={150 - ((t * 30 + i * 22) % 100)} r="3" fill="#fff" opacity=".7" />)}
        <text x="140" y="24" fontSize="12">katod (−)</text><text x="240" y="24" fontSize="12">anod (+)</text>
      </Svg>
    );
  },

  galvanic: (v) => {
    const E = Math.abs(v.e1 - v.e2), needle = clamp(E / 2.2, 0, 1) * 70 - 35;
    return (
      <Svg>
        <Beaker x={40} y={80} w={110} h={110} level={0.6} color={K.b} /><Beaker x={270} y={80} w={110} h={110} level={0.6} color={K.a} />
        <rect x="88" y="60" width="14" height="100" fill={K.m} /><rect x="318" y="60" width="14" height="100" fill={K.r} />
        <path d="M95 60V30H325V60" fill="none" stroke={K.g} strokeWidth="3" /><circle cx="210" cy="30" r="22" fill="#0d1531" stroke={K.g} strokeWidth="2.5" />
        <path d={`M210 40L${210 + 16 * Math.sin((needle * Math.PI) / 180)} ${40 - 16 * Math.cos((needle * Math.PI) / 180)}`} stroke={K.gr} strokeWidth="3" />
        <path d="M150 130H270" stroke={K.m} strokeWidth="8" opacity=".5" /><text x="210" y="124" fontSize="11" textAnchor="middle">tuz ko‘prigi</text>
        <text x="210" y="70" fontSize="13" textAnchor="middle">E = {fmt(E, 2)} V</text>
      </Svg>
    );
  },

  rust: (v) => {
    const f = clamp(v.rust / 100, 0, 1);
    return (
      <Svg>
        <rect x="120" y="100" width="200" height="26" rx="13" fill={`rgb(${120 + 60 * f} ${130 - 70 * f} ${140 - 110 * f})`} />
        {Array.from({ length: Math.round(f * 30) }, (_, i) => <circle key={i} cx={130 + rnd(i, 1) * 180} cy={104 + rnd(i, 2) * 18} r={2 + rnd(i, 3) * 3} fill="#8b4513" />)}
        <text x="120" y="80" fontSize="13">mix zang bosishi: {fmt(v.rust, 0)} %</text>
      </Svg>
    );
  },

  biceps: (v) => {
    const s = 5.5, ox = 130, oy = 110, W = v.m * 9.81, Fm = v.Fm ?? (W * v.L) / v.dm;
    const ax = ox + v.dm * s, lx = ox + v.L * s, wl = clamp(W * 0.3, 6, 70), fl = clamp(Fm * 0.3, 6, 70);
    return (
      <Svg>
        <rect x={ox - 12} y="22" width="24" height={oy - 22} rx="11" fill="#1a2650" stroke={K.g} strokeWidth="2.5" />
        <rect x={ox - 12} y={oy - 11} width={lx - ox + 24} height="22" rx="11" fill="#1a2650" stroke={K.g} strokeWidth="2.5" />
        <path d={`M${ox - 3} 48L${ax} ${oy - 11}`} stroke={K.r} strokeWidth={clamp(4 + Fm / 90, 4, 14)} strokeLinecap="round" opacity=".85" />
        <circle cx={ox} cy={oy} r="6" fill={K.m} />
        <rect x={lx - 13} y={oy + 12} width="26" height="20" rx="4" fill={K.a} />
        <Arrow x={lx} y={oy + 32} dx={0} dy={wl} c={K.r} />
        <Arrow x={ax} y={oy - 13} dx={0} dy={-fl} c={K.gr} />
        <text x="215" y="30" fontSize="12" fill={K.gr}>muskul kuchi Fₘ = {fmt(Fm, 0)} N</text>
        <text x="215" y="48" fontSize="12" fill={K.r}>yuk og‘irligi P = {fmt(W, 0)} N</text>
        <text x={ox + 16} y={oy + 46} fontSize="11" fill={K.m}>tayanch (tirsak)</text>
      </Svg>
    );
  },

  microscope: (v) => {
    const s = v.mag / 4 + 6;
    return (
      <Svg>
        <clipPath id="mv"><circle cx="210" cy="115" r="95" /></clipPath>
        <circle cx="210" cy="115" r="95" fill="#101c3f" stroke={K.g} strokeWidth="4" />
        <g clipPath="url(#mv)">
          {Array.from({ length: 200 }, (_, i) => { const x = 210 - 100 + (i % 14) * s * 1.1 + ((Math.floor(i / 14) % 2) * s) / 2, y = 15 + Math.floor(i / 14) * s * 1; return x < 330 && y < 220 ? <g key={i}><circle cx={x} cy={y} r={s / 2.2} fill="#3f8f7a" opacity=".55" stroke={K.gr} /><circle cx={x} cy={y} r={s / 7} fill={K.v} /></g> : null; })}
        </g>
        <text x="210" y="225" fontSize="13" textAnchor="middle">×{v.mag}</text>
      </Svg>
    );
  },

  yeast: (v, t) => {
    const r = 14 + clamp((t % 8) / 8, 0, 1) * (v.rate ?? 1) * 5;
    return (
      <Svg>
        <Beaker x={150} y={100} w={120} h={110} level={0.6} color={K.a} op={0.5} />
        <path d="M195 100h30v-18h-30z" fill={K.m} /><ellipse cx="210" cy={78 - r} rx={r} ry={r * 1.2} fill={K.gr} opacity=".85" />
        {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={170 + rnd(i, 1) * 80} cy={200 - ((t * 25 + i * 25) % 90)} r="3" fill="#fff" opacity=".5" />)}
      </Svg>
    );
  },

  xylem: (v, t) => {
    const lv = ((t % 6) / 6) * clamp((v.rate ?? 50) / 100, 0.05, 1) * 150;
    return (
      <Svg>
        <rect x="200" y="30" width="18" height="170" rx="6" fill="none" stroke={K.g} strokeWidth="2.5" /><rect x="203" y={197 - lv} width="12" height={lv} fill={K.r} opacity=".85" />
        <ellipse cx="160" cy="70" rx="40" ry="16" fill={K.gr} opacity=".8" /><ellipse cx="262" cy="110" rx="42" ry="16" fill={K.gr} opacity=".8" />
        <path d="M209 200q-40 10-70 24M209 200q40 10 70 24" stroke={K.g} strokeWidth="3" fill="none" />
        <text x="20" y="214" fontSize="12">bo‘yalgan suv naycha bo‘ylab ko‘tariladi</text>
      </Svg>
    );
  },

  seed: (v, t) => {
    const k = Math.round((v.germ ?? 50) / 10);
    return (
      <Svg h={200}>
        <rect x="20" y="150" width="380" height="40" fill="#5a3b1e" />
        {Array.from({ length: 10 }, (_, i) => { const on = i < k, h = on ? clamp(((t % 6) / 6) * 60, 4, 60) : 0; return <g key={i}><ellipse cx={45 + i * 36} cy="150" rx="7" ry="5" fill="#c8a165" />{on && <><path d={`M${45 + i * 36} 150V${150 - h}`} stroke={K.gr} strokeWidth="3" /><ellipse cx={45 + i * 36} cy={150 - h} rx="7" ry="4" fill={K.gr} /></>}</g>; })}
        <text x="20" y="40" fontSize="13">unib chiqqan: {k} / 10</text>
      </Svg>
    );
  },

  heart: (v, t) => {
    const sc = 1 + 0.12 * Math.max(0, Math.sin(2 * Math.PI * (v.pulse / 60) * t)) ** 3;
    return (
      <Svg>
        <g transform={`translate(210 110) scale(${sc}) translate(-210 -110)`}><path d="M210 175C120 120 140 60 185 62c14 0 24 8 25 20 1-12 11-20 25-20 45-2 65 58-25 113z" fill={K.r} /></g>
        <polyline points={Array.from({ length: 40 }, (_, i) => `${20 + i * 9},${205 - (Math.floor(i + t * 8 * (v.pulse / 70)) % 10 === 4 ? 26 : Math.floor(i + t * 8 * (v.pulse / 70)) % 10 === 5 ? -8 : 0)}`).join(' ')} fill="none" stroke={K.gr} strokeWidth="2" />
      </Svg>
    );
  },

  lungs: (v, t) => {
    const b = 1 + 0.1 * Math.sin(2 * Math.PI * (v.rate / 60) * 2 * t) * (v.tidal / 700);
    return (
      <Svg>
        <path d="M210 30V110M210 110l-30 24M210 110l30 24" stroke={K.g} strokeWidth="5" fill="none" />
        <ellipse cx="160" cy="150" rx={45 * b} ry={62 * b} fill={K.r} opacity=".6" /><ellipse cx="260" cy="150" rx={45 * b} ry={62 * b} fill={K.r} opacity=".6" />
        <text x="20" y="28" fontSize="13">{Math.sin(2 * Math.PI * (v.rate / 60) * 2 * t) > 0 ? 'nafas olish' : 'nafas chiqarish'}</text>
      </Svg>
    );
  },

  enzyme: (v, t) => {
    const rate = clamp((v.act ?? 50) / 100, 0, 1);
    return (
      <Svg>
        {Array.from({ length: 16 }, (_, i) => { const broken = rnd(i, 2) < (((t * rate * 0.35) % 1.2)); const x = 40 + (i % 8) * 46, y = 60 + Math.floor(i / 8) * 70 + Math.sin(t * 2 + i) * 4; return broken ? <g key={i}><circle cx={x - 8} cy={y} r="8" fill={K.gr} /><circle cx={x + 8} cy={y} r="8" fill={K.a} /></g> : <g key={i}><circle cx={x - 4} cy={y} r="9" fill={K.b} /><circle cx={x + 8} cy={y} r="9" fill={K.b} /></g>; })}
        <path d="M30 210q30 -30 60 0z" fill={K.v} /><text x="100" y="208" fontSize="12">ferment</text>
      </Svg>
    );
  },

  eye: (v) => {
    const pup = 8 + (1 - v.light / 100) * 36;
    return (
      <Svg>
        <ellipse cx="210" cy="115" rx="130" ry="75" fill="#eef1ff" /><circle cx="210" cy="115" r="62" fill={K.v} /><circle cx="210" cy="115" r={pup} fill="#0a1024" /><circle cx="228" cy="98" r="8" fill="#fff" opacity=".8" />
        <text x="20" y="28" fontSize="13">qorachiq: {fmt(pup / 6.4, 1)} mm</text>
      </Svg>
    );
  },

  pyramid: (_v, _t, o) => {
    const vals = o.filter((x) => typeof x.val === 'number' && x.bar).map((x) => x.val as number);
    const mx = Math.max(...vals, 1);
    return (
      <Svg>
        {vals.map((val, i) => { const w = Math.max(24, (val / mx) * 340); return <g key={i}><rect x={210 - w / 2} y={30 + i * 48} width={w} height="38" rx="5" fill={[K.gr, K.b, K.a, K.r][i % 4]} /><text x="210" y={54 + i * 48} fontSize="12" textAnchor="middle" fill="#0a1024">{fmt(val, 0)} kJ</text></g>; })}
      </Svg>
    );
  },

  greenhouse: (v) => {
    const dT = 3 * Math.log2(v.co2 / 280);
    return (
      <Svg>
        <circle cx="180" cy="130" r="70" fill={K.b} opacity=".7" /><circle cx="180" cy="130" r="96" fill="none" stroke={K.a} strokeDasharray="6 6" opacity={0.2 + Math.min(0.8, v.co2 / 1000)} />
        <Arrow x={30} y={40} dx={90} dy={50} c={K.a} /><Arrow x={300} y={120} dx={-60} dy={-40} c={K.r} />
        <rect x="350" y="40" width="14" height="150" rx="7" fill="#1a2650" stroke={K.g} /><rect x="353" y={190 - clamp(dT / 5, 0, 1) * 145} width="8" height={clamp(dT / 5, 0, 1) * 145 + 1} rx="4" fill={K.r} />
      </Svg>
    );
  },

  moths: (v, t) => {
    const g = Math.floor(clamp((t % 9) / 6, 0, 1) * 30), p = selFreq(v.p0, v.s, v.env, g);
    return (
      <Svg>
        <rect x="20" y="30" width="380" height="170" rx="10" fill={v.env === 1 ? '#3a3a44' : '#d8d2c4'} />
        {Array.from({ length: 48 }, (_, i) => <ellipse key={i} cx={40 + (i % 12) * 30} cy={55 + Math.floor(i / 12) * 38} rx="10" ry="6" fill={rnd(i, 5) < p ? '#15151c' : '#f4f1ea'} stroke="#888" />)}
        <text x="24" y="222" fontSize="13">{g}-avlod: to‘q kuyalar ulushi {fmt(p * 100, 0)} %</text>
      </Svg>
    );
  },

  split: (v) => {
    const d = clamp((v.delta ?? 0) * 60, 0, 150);
    return (
      <Svg h={200}>
        <circle cx={210 - d} cy="100" r="34" fill={K.b} opacity=".8" /><circle cx={210 + d} cy="100" r="34" fill={K.a} opacity=".8" />
        <text x="20" y="28" fontSize="13">ikki populyatsiya orasidagi farq: {fmt(v.delta ?? 0, 2)}</text>
      </Svg>
    );
  },

  atoms: (v, t) => {
    const tt = clamp((t % 9) / 7, 0, 1) * 5 * v.th;
    return (
      <Svg>
        {Array.from({ length: 120 }, (_, i) => { const tau = (-v.th / Math.LN2) * Math.log(1 - rnd(i, v.seed ?? 1) * 0.999); return <circle key={i} cx={40 + (i % 20) * 17} cy={60 + Math.floor(i / 20) * 24} r="6" fill={tt > tau ? '#26315f' : K.gr} />; })}
        <text x="24" y="30" fontSize="13">t = {fmt(tt, 1)} s: yemirilmagan yadrolar yashil</text>
      </Svg>
    );
  },

  colony: (v, t) => {
    const n = Math.min(220, Math.round(Math.log2(1 + (v.N ?? 4)) * 16 * clamp((t % 8) / 6, 0.1, 1)));
    return (
      <Svg>
        <circle cx="210" cy="115" r="100" fill="#22305c" stroke={K.g} strokeWidth="3" />
        {Array.from({ length: n }, (_, i) => { const a = rnd(i, 1) * 6.28, r = Math.sqrt(rnd(i, 2)) * 90; return <circle key={i} cx={210 + r * Math.cos(a)} cy={115 + r * Math.sin(a)} r="3" fill={K.a} />; })}
      </Svg>
    );
  },

  bars: (_v, _t, o) => {
    const rows = o.filter((x) => x.bar && typeof x.val === 'number');
    return (
      <Svg>
        {rows.map((x, i) => { const w = clamp(((x.val as number) / (x.bar?.max ?? 1)) * 260, 2, 260); return <g key={x.label}><text x="20" y={44 + i * 44} fontSize="12" fill={K.m}>{x.label}</text><rect x="20" y={52 + i * 44} width={w} height="18" rx="4" fill={x.bar?.color ?? K.b} /><text x={28 + w} y={66 + i * 44} fontSize="12">{fmt(x.val as number, 2)} {x.unit}</text></g>; })}
      </Svg>
    );
  },
};
