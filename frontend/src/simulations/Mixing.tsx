import { useEffect, useState, type CSSProperties } from 'react';
import { aiAssist, getReagents, mixReagents } from '../api';
import Formula, { toSub } from '../components/Formula';
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

const GAS_BUBBLES = [
  [296, 420, 4], [316, 424, 3], [334, 418, 5], [352, 426, 3], [370, 420, 4], [388, 424, 5],
  [406, 418, 3], [324, 428, 4], [380, 430, 3], [344, 414, 4], [300, 430, 3], [398, 414, 4],
];

const FLASK = 'M-10 -70h20v30l25 70q4 12-10 12h-50q-14 0-10-12l25-70z';

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

  // suyuqlik sathlari: birinchi suyuqlik 96, ikkinchisi ustiga 60
  let liquids = 0;
  const levels = slots.map((r) => {
    if (!r || isSolid(r)) return { y: 340, h: 96 };
    liquids += 1;
    return liquids === 1 ? { y: 340, h: 96 } : { y: 280, h: 60 };
  });
  const mixLevel = liquids === 2 ? { y: 280, h: 156 } : { y: 340, h: 96 };
  const mixColor = v?.liquid ?? '#d6ebff';
  const layerColor = v?.precipitate ?? '#ffffff';
  const depColor = v?.deposit ?? '#ffffff';

  const aLiquid = !!a && !isSolid(a);
  const bLiquid = !!b && !isSolid(b);
  const aSolid = isSolid(a);
  const bSolid = isSolid(b);
  const both = !!(a && b);

  return (
    <div className={playing ? 'lab play' : 'lab'}>
      <div className="stage">
        <svg key={`s${runKey}`} viewBox="0 0 700 480" role="img" aria-label="Ikki modda stakanga quyiladi va aralashadi">
          <defs>
            <clipPath id="mx-bkin"><path d="M272 200V416Q272 436 292 436H408Q428 436 428 416V200Z" /></clipPath>
            <clipPath id="mx-cf"><path d={FLASK} /></clipPath>
          </defs>

          <rect x="70" y="196" width="140" height="8" rx="4" fill="#1a2650" />
          <rect x="490" y="196" width="140" height="8" rx="4" fill="#1a2650" />
          <text x="140" y="234" textAnchor="middle" fontSize="17" fontWeight="700" fill="#eef1ff">{a ? toSub(a.formula) : '1-modda'}</text>
          <text x="560" y="234" textAnchor="middle" fontSize="17" fontWeight="700" fill="#eef1ff">{b ? toSub(b.formula) : '2-modda'}</text>
          <ellipse cx="350" cy="448" rx="100" ry="9" fill="#000" opacity=".35" />
          {v?.heat && <ellipse className="mx-heat" cx="350" cy="446" rx="110" ry="14" fill="#ff8a3d" style={{ filter: 'blur(8px)' }} />}

          {aLiquid && <rect className="mx-strA" x="288.5" y="176" width="5" height="170" rx="2.5" fill={colorOf(a)} />}
          {bLiquid && <rect className="mx-strB" x="406.5" y="176" width="5" height="170" rx="2.5" fill={colorOf(b)} />}

          <g clipPath="url(#mx-bkin)">
            <g style={{ filter: `drop-shadow(0 0 12px ${mixColor})` }}>
              {aLiquid && <rect className="mx-liqA" x="272" y={levels[0].y} width="156" height={levels[0].h} fill={colorOf(a)} />}
              {bLiquid && <rect className="mx-liqB" x="272" y={levels[1].y} width="156" height={levels[1].h} fill={colorOf(b)} />}
              {liquids > 0 && <rect className="mx-liqM" x="272" y={mixLevel.y} width="156" height={mixLevel.h} fill={mixColor} />}
            </g>
            {v?.precipitate && <rect className="mx-ppt" x="272" y="392" width="156" height="44" rx="6" fill={layerColor} />}
            {v?.gas &&
              GAS_BUBBLES.map(([cx, cy, r], i) => (
                <circle key={i} className="mx-gas" style={{ '--k': i } as CSSProperties} cx={cx} cy={cy} r={r} fill="#fff" />
              ))}
            {both && (
              <>
                <ellipse className="mx-swirl" cx="350" cy="330" rx="62" ry="15" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeDasharray="46 30" />
                <ellipse className="mx-swirl" cx="350" cy="370" rx="44" ry="11" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2.5" strokeDasharray="30 26" />
              </>
            )}
          </g>

          {aSolid && a && (
            <g className="mx-sa">
              <rect width="44" height="18" rx="5" fill={colorOf(a)} stroke="#cfd8ff" strokeOpacity=".5" />
              {v?.deposit && <rect className="mx-depo" x="-2" y="-2" width="48" height="22" rx="7" fill={depColor} />}
            </g>
          )}
          {bSolid && b && (
            <g className="mx-sb">
              <rect width="44" height="18" rx="5" fill={colorOf(b)} stroke="#cfd8ff" strokeOpacity=".5" />
              {v?.deposit && <rect className="mx-depo" x="-2" y="-2" width="48" height="22" rx="7" fill={depColor} />}
            </g>
          )}

          <path d="M272 200V416Q272 436 292 436H408Q428 436 428 416V200" fill="none" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
          <path d="M282 214V396" stroke="#fff" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
          <path d="M428 250h-12M428 290h-8M428 330h-12M428 370h-8" stroke="#9fabd6" strokeWidth="2" strokeLinecap="round" />
          {v?.heat && (
            <>
              <path className="mx-steam" d="M312 190c-9-11 9-17 0-28" />
              <path className="mx-steam" d="M350 190c-9-11 9-17 0-28" style={{ animationDelay: '7.2s' }} />
              <path className="mx-steam" d="M388 190c-9-11 9-17 0-28" style={{ animationDelay: '7.6s' }} />
            </>
          )}

          {aLiquid && (
            <g className="mx-fa">
              <g clipPath="url(#mx-cf)"><rect className="mx-dA" x="-40" y="-14" width="80" height="60" fill={colorOf(a)} /></g>
              <path d={FLASK} fill="rgba(255,255,255,0.05)" stroke="#cfd8ff" strokeWidth="3" strokeLinejoin="round" />
              <path d="M-14 -70h28" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
          {bLiquid && (
            <g className="mx-fb">
              <g clipPath="url(#mx-cf)"><rect className="mx-dB" x="-40" y="-14" width="80" height="60" fill={colorOf(b)} /></g>
              <path d={FLASK} fill="rgba(255,255,255,0.05)" stroke="#cfd8ff" strokeWidth="3" strokeLinejoin="round" />
              <path d="M-14 -70h28" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </svg>
        <div className="mx-prog"><i key={`p${runKey}`} /></div>
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
