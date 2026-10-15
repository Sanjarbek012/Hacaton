import { useEffect, useRef, useState, type ComponentType } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';
import { Control, LineGraph, fmt, useClock, type Series, type V, type Var } from './common';
import { SCENES, type OutVal } from './scenes';

export interface Out {
  id?: string;
  label: string;
  unit?: string;
  fn: (v: V) => number | string;
  d?: number;
  hidden?: boolean;
  bar?: { max: number; color?: string };
}
export interface GraphDef {
  xl: string;
  yl: string;
  series: (v: V) => Series[];
  /** true bo'lsa, grafik asta-sekin chiziladi */
  anim?: boolean;
}
export interface FormulaDef {
  scene: string;
  vars: Var[];
  outs: Out[];
  graph?: GraphDef;
  note?: string;
  audio?: boolean;
  hint?: string;
}

/** Formula asosidagi tajriba: slayderlar, hisob-kitob, jonli sahna va grafik. */
export function makeFormulaLab(def: FormulaDef): ComponentType<SimProps> {
  return function FormulaLab({ topicId, onSaved }: SimProps) {
    const [v, setV] = useState<V>(() => Object.fromEntries(def.vars.map((x) => [x.id, x.value])));
    const [touched, setTouched] = useState(false);
    const [sound, setSound] = useState(false);
    const audio = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);
    const t = useClock();

    const outs: (OutVal & { hidden?: boolean; d?: number })[] = def.outs.map((o) => ({ label: o.label, unit: o.unit ?? '', val: o.fn(v), bar: o.bar, hidden: o.hidden, d: o.d }));
    const merged: V = { ...v };
    def.outs.forEach((o, i) => {
      const val = outs[i].val;
      if (o.id && typeof val === 'number') merged[o.id] = val;
    });

    useEffect(() => {
      if (!def.audio || !sound) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain).connect(ctx.destination);
      gain.gain.value = 0.02;
      osc.start();
      audio.current = { ctx, osc, gain };
      return () => {
        osc.stop();
        void ctx.close();
        audio.current = null;
      };
    }, [sound]);
    useEffect(() => {
      if (audio.current) {
        audio.current.osc.frequency.value = v.f;
        audio.current.gain.gain.value = 0.01 * (v.A ?? 5);
      }
    }, [v.f, v.A]);

    const scene = SCENES[def.scene]?.(merged, t, outs);
    const series = def.graph ? def.graph.series(merged) : null;
    const progress = def.graph?.anim ? Math.min(1, (t % 9) / 6) : 1;

    const data: Record<string, unknown> = {};
    def.vars.forEach((x) => {
      const key = x.unit ? `${x.label} (${x.unit})` : x.label;
      data[key] = x.options ? x.options.find((o) => o.value === v[x.id])?.label ?? v[x.id] : Number(fmt(v[x.id], x.d ?? 2));
    });
    outs.forEach((o) => {
      if (!o.hidden) data[o.unit ? `${o.label} (${o.unit})` : o.label] = typeof o.val === 'number' ? Number(fmt(o.val, o.d ?? 2)) : o.val;
    });

    return (
      <div className="lab">
        <div className="stage">
          {scene}
          {series && <LineGraph series={series} xl={def.graph!.xl} yl={def.graph!.yl} progress={progress} />}
        </div>
        <div className="panel">
          {def.vars.map((x) => (
            <Control key={x.id} v={x} value={v[x.id]} onChange={(val) => { setV((p) => ({ ...p, [x.id]: val })); setTouched(true); }} />
          ))}
          {def.audio && <button className="btn" onClick={() => setSound((s) => !s)}>{sound ? 'Ovozni o‘chirish' : 'Ovoz chiqarish'}</button>}
          <dl className="readout">
            {outs.filter((o) => !o.hidden).map((o) => (
              <div key={o.label} style={{ display: 'contents' }}>
                <dt>{o.label}</dt>
                <dd>{typeof o.val === 'number' ? `${fmt(o.val, o.d ?? 2)} ${o.unit}` : o.val}</dd>
              </div>
            ))}
          </dl>
          {def.note && <p className="note">{def.note}</p>}
        </div>
        <SaveBar topicId={topicId} canSave={touched} hint={def.hint ?? 'Parametrlarni o‘zgartirib ko‘ring'} onSaved={onSaved} data={data} />
      </div>
    );
  };
}
