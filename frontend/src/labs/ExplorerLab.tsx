import { useState, type ComponentType } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';

export interface ExploreDef {
  intro: string;
  items: { title: string; sub?: string; text: string }[];
}

/** Interaktiv ma'lumot xaritasi: bo'limlarni bosib ko'riladi. */
export function makeExplorerLab(def: ExploreDef): ComponentType<SimProps> {
  return function ExplorerLab({ topicId, onSaved }: SimProps) {
    const [sel, setSel] = useState(0);
    const [seen, setSeen] = useState<number[]>([0]);
    const it = def.items[sel];
    const need = Math.min(4, def.items.length);
    function go(i: number) {
      setSel(i);
      setSeen((s) => (s.includes(i) ? s : [...s, i]));
    }
    return (
      <div className="lab">
        <div className="stage">
          <div className="exp-stage">
            <div className="exp-track">
              {def.items.map((x, i) => (
                <button key={x.title} className={i === sel ? 'exp-dot on' : seen.includes(i) ? 'exp-dot seen' : 'exp-dot'} onClick={() => go(i)} aria-label={x.title}>
                  <i>{i + 1}</i>
                </button>
              ))}
            </div>
            <div key={sel} className="exp-card">
              <h3>{it.title}</h3>
              {it.sub && <span className="exp-sub">{it.sub}</span>}
              <p>{it.text}</p>
            </div>
            <div className="row">
              <button className="btn" disabled={sel === 0} onClick={() => go(sel - 1)}>Oldingi</button>
              <button className="btn primary" disabled={sel === def.items.length - 1} onClick={() => go(sel + 1)}>Keyingi</button>
            </div>
          </div>
        </div>
        <div className="panel">
          <p className="note">{def.intro}</p>
          <div className="row">
            {def.items.map((x, i) => (
              <button key={x.title} className={i === sel ? 'chip active' : 'chip'} onClick={() => go(i)}>{x.title}</button>
            ))}
          </div>
          <dl className="readout"><dt>Ko‘rilgan bo‘limlar</dt><dd>{seen.length} / {def.items.length}</dd></dl>
        </div>
        <SaveBar topicId={topicId} canSave={seen.length >= need} hint={`Kamida ${need} ta bo‘limni ko‘rib chiqing`} onSaved={onSaved} data={{ 'Ko‘rilgan bo‘limlar': seen.length, 'Oxirgi bo‘lim': it.title }} />
      </div>
    );
  };
}
