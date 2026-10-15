import { useEffect, useState } from 'react';
import { aiAssist, getReagents, mixReagents } from '../api';
import Formula from '../components/Formula';
import PourStage from '../components/PourStage';
import SaveBar from '../components/SaveBar';
import type { MixResult, Reagent, SimProps } from '../types';

const GROUPS: { key: Reagent['group']; label: string }[] = [
  { key: 'kislota', label: 'Kislotalar' },
  { key: 'asos', label: 'Asoslar' },
  { key: 'tuz', label: 'Tuzlar' },
  { key: 'metall', label: 'Metallar' },
  { key: 'indikator', label: 'Indikator' },
];

/** Moddalarning idishdagi rangi (qattiq moddalar uchun bo'lakning rangi) */
const COLORS: Record<string, string> = {
  hcl: '#d6ebff', h2so4: '#d6ebff', naoh: '#d6ebff', cuso4: '#5da2ea', agno3: '#e2f0fb', nacl: '#e2f0fb',
  bacl2: '#e2f0fb', na2co3: '#e2f0fb', phph: '#eef3fa',
  zn: '#aeb8c6', mg: '#e3e7ee', fe: '#7d8794', cu: '#d98a4f', caco3: '#f1ead9',
};
const colorOf = (r: Reagent | null) => (r ? COLORS[r.id] ?? '#d6ebff' : '#d6ebff');
const isSolid = (r: Reagent | null) => !!r && (r.group === 'metall' || r.id === 'caco3');
const toItem = (r: Reagent) => ({ formula: r.formula, color: colorOf(r), solid: isSolid(r) });

interface AiState {
  text: string;
  loading: boolean;
  error?: string;
}

export default function Mixing({ topicId, onSaved }: SimProps) {
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [slots, setSlots] = useState<(Reagent | null)[]>([null, null]);
  const [result, setResult] = useState<MixResult | null>(null);
  const [playing, setPlaying] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ai, setAi] = useState<AiState | null>(null);

  useEffect(() => {
    getReagents().then(setReagents).catch(() => setError("Moddalar ro'yxatini yuklab bo'lmadi"));
  }, []);

  function reset() {
    setResult(null);
    setAi(null);
    setPlaying(false);
    setRunKey((k) => k + 1);
  }

  function pick(r: Reagent) {
    reset();
    setSlots(([a, b]) => {
      if (a?.id === r.id) return [null, b];
      if (b?.id === r.id) return [a, null];
      if (!a) return [r, b];
      if (!b) return [a, r];
      return [a, r];
    });
  }

  function clear() {
    reset();
    setSlots([null, null]);
    setError('');
  }

  async function mix() {
    const [a, b] = slots;
    if (!a || !b) return;
    setBusy(true);
    setError('');
    setAi(null);
    try {
      const res = await mixReagents(a.id, b.id);
      setResult(res);
      setPlaying(true);
      setRunKey((k) => k + 1);
      void explain(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xato');
    } finally {
      setBusy(false);
    }
  }

  async function explain(res: MixResult) {
    setAi({ text: '', loading: true });
    try {
      const { answer } = await aiAssist({
        topicId,
        mode: 'explain',
        state: {
          'A modda': `${res.a.name} (${res.a.formula})`,
          'B modda': `${res.b.name} (${res.b.formula})`,
          tenglama: res.reaction.equation,
          'reaksiya turi': res.reaction.type,
          kuzatish: res.reaction.observation,
          'jadvalda bor reaksiya': res.known,
        },
      });
      setAi({ text: answer, loading: false });
    } catch (e) {
      setAi({ text: '', loading: false, error: e instanceof Error ? e.message : 'AI javob bermadi' });
    }
  }

  const [a, b] = slots;
  const v = result?.reaction.visual;

  const both = !!(a && b);

  return (
    <div className={playing ? 'lab play' : 'lab'}>
      <div className="stage">
        <PourStage a={a ? toItem(a) : null} b={b ? toItem(b) : null} v={v ?? null} runKey={runKey} />
      </div>

      <div className="panel">
        <div className="slots">
          {[a, b].map((s, i) => (
            <div key={i} className={s ? 'slot filled' : 'slot'}>
              {s ? (
                <>
                  <b><Formula text={s.formula} /></b>
                  <span>{s.name}</span>
                </>
              ) : (
                <span>{i === 0 ? '1-modda' : '2-modda'}</span>
              )}
            </div>
          ))}
        </div>

        <div className="row">
          <button className="btn primary" disabled={!both || busy} onClick={mix}>
            {busy ? 'Kuting...' : 'Aralashtirish'}
          </button>
          <button className="btn" onClick={clear}>Tozalash</button>
        </div>
        <p className="note">{both ? 'Taxminan 9 soniya davom etadi.' : 'Pastdagi ro‘yxatdan ikki modda tanlang.'}</p>

        {GROUPS.map((g) => (
          <div key={g.key}>
            <h4 className="group-title">{g.label}</h4>
            <div className="row">
              {reagents.filter((r) => r.group === g.key).map((r) => (
                <button key={r.id} className={slots.some((s) => s?.id === r.id) ? 'chip active reagent' : 'chip reagent'} onClick={() => pick(r)} title={r.name}>
                  <i style={{ background: colorOf(r), color: colorOf(r) }} />
                  <Formula text={r.formula} />
                </button>
              ))}
            </div>
          </div>
        ))}
        {error && <p className="error">{error}</p>}
      </div>

      {result && playing && (
        <div key={`r${runKey}`} className="info wide">
          <div className="mx-result mx-reveal">
            <span className="mx-chip">{result.reaction.type}</span>
            {result.known && result.reaction.equation !== '—' && (
              <div className="equation"><Formula text={result.reaction.equation} /></div>
            )}
            <p>{result.reaction.observation}</p>
            {ai?.loading && <p className="note">AI tushuntirmoqda...</p>}
            {ai?.text && (
              <div className="ai-explain">
                <b>AI tushuntirishi</b>
                <p>{ai.text}</p>
              </div>
            )}
            {ai?.error && <p className="note">AI tushuntirishi mavjud emas: {ai.error}</p>}
            {!result.known && <p className="note">Bu juftlik reaksiyalar jadvalida yo‘q, shuning uchun maktab darajasida sezilarli o‘zgarish kuzatilmaydi deb ko‘rsatildi.</p>}
          </div>
        </div>
      )}

      <SaveBar
        topicId={topicId}
        canSave={!!result}
        hint="Ikki modda tanlab, aralashtiring"
        onSaved={onSaved}
        data={
          result
            ? { '1-modda': result.a.name, '2-modda': result.b.name, tenglama: result.reaction.equation, 'reaksiya turi': result.reaction.type }
            : { '1-modda': a?.name ?? '—', '2-modda': b?.name ?? '—' }
        }
      />
    </div>
  );
}
