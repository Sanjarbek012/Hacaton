import { useMemo, useState, type ComponentType } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';
import { rnd } from './common';

export interface SortDef {
  cats: { id: string; label: string }[];
  items: { text: string; cat: string; hint: string }[];
  intro: string;
}

/** Tasniflash mashqi: kartochka chiqadi, o'quvchi to'g'ri guruhni tanlaydi. */
export function makeSorterLab(def: SortDef): ComponentType<SimProps> {
  return function SorterLab({ topicId, onSaved }: SimProps) {
    const order = useMemo(() => def.items.map((_, i) => i).sort((a, b) => rnd(a, 7) - rnd(b, 7)), []);
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [fb, setFb] = useState<{ ok: boolean; msg: string } | null>(null);
    const done = idx >= order.length;
    const it = done ? null : def.items[order[idx]];

    function answer(cat: string) {
      if (!it || fb) return;
      const ok = cat === it.cat;
      setFb({ ok, msg: ok ? it.hint : `To‘g‘ri javob: ${def.cats.find((c) => c.id === it.cat)?.label}. ${it.hint}` });
      if (ok) setScore((s) => s + 1);
      else setWrong((w) => w + 1);
    }
    function next() {
      setFb(null);
      setIdx((i) => i + 1);
    }
    function restart() {
      setIdx(0);
      setScore(0);
      setWrong(0);
      setFb(null);
    }

    return (
      <div className="lab">
        <div className="stage">
          <div className="sort-stage">
            {done ? (
              <div className="sort-card done" key="done">
                <b>{score} / {order.length}</b>
                <span>{score === order.length ? 'Ajoyib, hammasi to‘g‘ri!' : 'Yaxshi urinish! Xatolarni tuzatish uchun qayta boshlang.'}</span>
              </div>
            ) : (
              <div key={idx} className={fb ? (fb.ok ? 'sort-card ok' : 'sort-card bad') : 'sort-card'}>
                <small>{idx + 1} / {order.length}</small>
                <b>{it?.text}</b>
              </div>
            )}
            {fb && !done && <p className="sort-fb">{fb.msg}</p>}
          </div>
        </div>
        <div className="panel">
          <p className="note">{def.intro}</p>
          {def.cats.map((c) => (
            <button key={c.id} className="btn" disabled={done || !!fb} onClick={() => answer(c.id)}>{c.label}</button>
          ))}
          {fb && !done && <button className="btn primary" onClick={next}>Keyingisi</button>}
          {done && <button className="btn primary" onClick={restart}>Qayta boshlash</button>}
          <dl className="readout"><dt>To‘g‘ri</dt><dd>{score}</dd><dt>Xato</dt><dd>{wrong}</dd></dl>
        </div>
        <SaveBar topicId={topicId} canSave={done} hint="Barcha kartochkalarni tasniflab chiqing" onSaved={onSaved} data={{ 'To‘g‘ri javoblar': score, Xatolar: wrong, Jami: order.length }} />
      </div>
    );
  };
}
