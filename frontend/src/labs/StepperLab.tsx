import { useEffect, useState, type ComponentType } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';
import { K, Svg } from './common';

export interface StepDef {
  intro: string;
  steps: { title: string; text: string; art?: number }[];
}

/** Mitoz fazalari: xromosomalar CSS-o'tish bilan siljiydi. art = faza raqami (0..5) */
const armPos = (ph: number, i: number, arm: number): [number, number, number] => {
  const rot = arm ? 24 : -24;
  switch (ph) {
    case 0: return [188 + (i % 2) * 42 + arm * 4, 96 + (i >> 1) * 36, arm ? 80 : 100];
    case 1: return [165 + (i % 2) * 78 + arm * 3, 82 + (i >> 1) * 64, rot];
    case 2: return [210 + arm * 2, 66 + i * 32, rot];
    case 3: return [arm ? 268 : 152, 66 + i * 32, arm ? 12 : -12];
    case 4: return [arm ? 292 : 128, 84 + i * 21, 0];
    default: return [arm ? 292 : 128, 84 + i * 21, 0];
  }
};
function Mitosis({ ph }: { ph: number }) {
  return (
    <Svg>
      {ph < 4 && <ellipse cx="210" cy="115" rx="112" ry="92" fill="#1f3a5f" stroke={K.g} strokeWidth="3" />}
      {ph === 4 && <path d="M210 30C150 20 84 60 84 115s66 95 126 85c60 10 126-30 126-85S270 20 210 30z" fill="#1f3a5f" stroke={K.g} strokeWidth="3" />}
      {ph === 5 && <><ellipse cx="128" cy="115" rx="70" ry="82" fill="#1f3a5f" stroke={K.g} strokeWidth="3" /><ellipse cx="292" cy="115" rx="70" ry="82" fill="#1f3a5f" stroke={K.g} strokeWidth="3" /></>}
      {ph === 0 && <circle cx="210" cy="115" r="56" fill="none" stroke={K.v} strokeWidth="2.5" strokeDasharray="6 4" />}
      {ph >= 4 && <><circle cx="128" cy="115" r="46" fill="none" stroke={K.v} strokeWidth="2.5" strokeDasharray="6 4" /><circle cx="292" cy="115" r="46" fill="none" stroke={K.v} strokeWidth="2.5" strokeDasharray="6 4" /></>}
      {(ph === 2 || ph === 3) && [0, 1, 2, 3].map((i) => (
        <g key={i} stroke={K.m} strokeWidth="1" opacity=".55"><path d={`M110 115L${210} ${66 + i * 32}`} /><path d={`M310 115L${210} ${66 + i * 32}`} /></g>
      ))}
      {[0, 1, 2, 3].map((i) => [0, 1].map((arm) => {
        const [x, y, r] = armPos(ph, i, arm);
        return <line key={`${i}${arm}`} x1="0" y1="-13" x2="0" y2="13" stroke={i % 2 ? K.a : K.gr} strokeWidth="5" strokeLinecap="round" style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)`, transition: 'transform .9s ease' }} />;
      }))}
    </Svg>
  );
}

function Flow({ steps, i }: { steps: StepDef['steps']; i: number }) {
  const n = steps.length, gap = Math.min(64, 340 / Math.max(1, n - 1));
  const x0 = 210 - (gap * (n - 1)) / 2;
  return (
    <Svg>
      <path d={`M${x0} 115H${x0 + gap * (n - 1)}`} stroke={K.l} strokeWidth="4" />
      <path d={`M${x0} 115H${x0 + gap * i}`} stroke={K.gr} strokeWidth="4" style={{ transition: 'all .5s' }} />
      {steps.map((s, k) => <g key={s.title}><circle cx={x0 + gap * k} cy="115" r={k === i ? 20 : 13} fill={k <= i ? K.gr : '#26315f'} style={{ transition: 'all .4s' }} /><text x={x0 + gap * k} y={k === i ? 121 : 119} fontSize={k === i ? 15 : 11} textAnchor="middle" fill="#0a1024" fontWeight="700">{k + 1}</text></g>)}
      <text x="210" y="190" fontSize="16" textAnchor="middle" fontWeight="700">{steps[i].title}</text>
    </Svg>
  );
}

/** Bosqichma-bosqich jarayon: oldinga-orqaga yoki avtomatik ijro. */
export function makeStepperLab(def: StepDef): ComponentType<SimProps> {
  return function StepperLab({ topicId, onSaved }: SimProps) {
    const [i, setI] = useState(0);
    const [auto, setAuto] = useState(false);
    const [max, setMax] = useState(0);
    const n = def.steps.length;
    useEffect(() => {
      if (!auto) return;
      const h = window.setInterval(() => setI((x) => { if (x >= n - 1) { setAuto(false); return x; } return x + 1; }), 2600);
      return () => window.clearInterval(h);
    }, [auto, n]);
    useEffect(() => setMax((m) => Math.max(m, i)), [i]);
    const s = def.steps[i];
    return (
      <div className="lab">
        <div className="stage">
          {s.art !== undefined ? <Mitosis ph={s.art} /> : <Flow steps={def.steps} i={i} />}
          <div key={i} className="step-text"><b>{i + 1}. {s.title}</b><p>{s.text}</p></div>
        </div>
        <div className="panel">
          <p className="note">{def.intro}</p>
          <div className="row">
            <button className="btn" disabled={i === 0} onClick={() => { setAuto(false); setI(i - 1); }}>Orqaga</button>
            <button className="btn primary" disabled={i === n - 1} onClick={() => { setAuto(false); setI(i + 1); }}>Oldinga</button>
          </div>
          <button className="btn" onClick={() => { if (i >= n - 1) setI(0); setAuto((a) => !a); }}>{auto ? 'To‘xtatish' : 'Avtomatik ijro'}</button>
          <div className="row">{def.steps.map((x, k) => <button key={x.title} className={k === i ? 'chip active' : 'chip'} onClick={() => { setAuto(false); setI(k); }}>{k + 1}</button>)}</div>
          <dl className="readout"><dt>Bosqich</dt><dd>{i + 1} / {n}</dd></dl>
        </div>
        <SaveBar topicId={topicId} canSave={max >= n - 1} hint="Jarayonni oxirigacha ko‘rib chiqing" onSaved={onSaved} data={{ 'Ko‘rilgan bosqichlar': max + 1, 'Jami bosqich': n }} />
      </div>
    );
  };
}
