import { useState, type ComponentType } from 'react';
import Formula from '../components/Formula';
import PourStage, { type PVisual } from '../components/PourStage';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

export interface RSub { id: string; name: string; formula: string; color: string; solid?: boolean }
export interface ROut {
  liquid: string;
  ppt?: string;
  dep?: string;
  gas?: boolean;
  heat?: boolean;
  obs: string;
  eq?: string;
  tests?: { label: string; result: string }[];
}
export interface ReagentDef {
  subs: RSub[];
  rx: [string, string, ROut][];
  note?: string;
}
const NEUTRAL = '#e2f0fb';
const item = (s: RSub | undefined) => (s ? { formula: s.formula, color: s.color, solid: !!s.solid } : null);

/** Reagent laboratoriyasi: ikki modda tanlanadi, aralashtiriladi, natija ko'rsatiladi. */
export function makeReagentLab(def: ReagentDef): ComponentType<SimProps> {
  return function ReagentLab({ topicId, onSaved }: SimProps) {
    const [slots, setSlots] = useState<(string | null)[]>([null, null]);
    const [res, setRes] = useState<{ out: ROut; known: boolean } | null>(null);
    const [runKey, setRunKey] = useState(0);
    const [test, setTest] = useState('');
    const [tried, setTried] = useState<string[]>([]);
    const find = (id: string | null) => def.subs.find((s) => s.id === id);
    const a = find(slots[0]);
    const b = find(slots[1]);

    function pick(id: string) {
      setRes(null);
      setTest('');
      setSlots(([x, y]) => (x === id ? [null, y] : y === id ? [x, null] : !x ? [id, y] : !y ? [x, id] : [x, id]));
    }
    function mix() {
      if (!a || !b) return;
      const hit = def.rx.find(([p, q]) => (p === a.id && q === b.id) || (p === b.id && q === a.id));
      const base = [a, b].find((s) => !s.solid && s.color !== NEUTRAL)?.color ?? NEUTRAL;
      const out: ROut = hit ? hit[2] : { liquid: base, obs: 'Ko‘zga ko‘rinadigan o‘zgarish kuzatilmadi: bu juftlik o‘zaro reaksiyaga kirishmaydi.' };
      setRes({ out, known: !!hit });
      setTest('');
      setRunKey((k) => k + 1);
      setTried((t) => (t.includes(`${a.name}+${b.name}`) ? t : [...t, `${a.name}+${b.name}`]));
    }
    const visual: PVisual | null = res ? { liquid: res.out.liquid, precipitate: res.out.ppt ?? null, deposit: res.out.dep ?? null, gas: !!res.out.gas, heat: !!res.out.heat } : null;

    return (
      <div className={res ? 'lab play' : 'lab'}>
        <div className="stage"><PourStage a={item(a)} b={item(b)} v={visual} runKey={runKey} /></div>
        <div className="panel">
          <div className="slots">
            {[a, b].map((s, i) => (
              <div key={i} className={s ? 'slot filled' : 'slot'}>
                {s ? <><b><Formula text={s.formula} /></b><span>{s.name}</span></> : <span>{i === 0 ? '1-modda' : '2-modda'}</span>}
              </div>
            ))}
          </div>
          <div className="row">
            <button className="btn primary" disabled={!a || !b} onClick={mix}>Aralashtirish</button>
            <button className="btn" onClick={() => { setSlots([null, null]); setRes(null); setTest(''); }}>Tozalash</button>
          </div>
          <div className="row">
            {def.subs.map((s) => (
              <button key={s.id} className={slots.includes(s.id) ? 'chip active reagent' : 'chip reagent'} onClick={() => pick(s.id)} title={s.name}>
                <i style={{ background: s.color, color: s.color }} />
                <Formula text={s.formula} />
              </button>
            ))}
          </div>
          {def.note && <p className="note">{def.note}</p>}
        </div>
        {res && (
          <div key={`r${runKey}`} className="info wide">
            <div className="mx-result mx-reveal">
              <span className="mx-chip">{res.known ? 'Reaksiya' : 'Reaksiya yo‘q'}</span>
              {res.out.eq && <div className="equation"><Formula text={res.out.eq} /></div>}
              <p>{res.out.obs}</p>
              {res.out.tests && (
                <div className="row">
                  {res.out.tests.map((t) => <button key={t.label} className="btn" onClick={() => setTest(t.result)}>{t.label}</button>)}
                </div>
              )}
              {test && <div className="ai-explain"><b>Natija</b><p>{test}</p></div>}
            </div>
          </div>
        )}
        <SaveBar
          topicId={topicId}
          canSave={!!res}
          hint="Ikki modda tanlab, aralashtiring"
          onSaved={onSaved}
          data={res ? { '1-modda': a?.name ?? '', '2-modda': b?.name ?? '', kuzatish: res.out.obs, tenglama: res.out.eq ?? '—', 'sinalgan juftliklar': tried.length } : { '1-modda': a?.name ?? '—', '2-modda': b?.name ?? '—' }}
        />
      </div>
    );
  };
}
