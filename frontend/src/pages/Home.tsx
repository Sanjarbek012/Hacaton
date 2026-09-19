import { useEffect, useState, type CSSProperties } from 'react';
import { getStats } from '../api';
import { useAuth } from '../auth/AuthContext';
import Backdrop from '../components/Backdrop';
import CountUp from '../components/CountUp';
import ResultsList from '../components/ResultsList';
import Vessel from '../components/Vessel';
import { SUBJECT_META, type Subject, type SubjectStat } from '../types';

function Glyph({ subject }: { subject: Subject }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className="glyph" viewBox="0 0 64 64" aria-hidden="true">
      {subject === 'physics' && (
        <>
          <path d="M14 8h36" {...p} />
          <g className="g-swing">
            <path d="M32 8l14 34" {...p} />
            <circle cx="47" cy="47" r="8" {...p} />
          </g>
        </>
      )}
      {subject === 'chemistry' && (
        <>
          <path d="M26 8h12M28 8v16L12 52a4 4 0 0 0 4 6h32a4 4 0 0 0 4-6L36 24V8" {...p} />
          <path d="M18 42h28" {...p} />
          {[24, 32, 40].map((x, i) => (
            <circle key={x} className="g-bub" cx={x} cy="50" r="2.2" fill="currentColor" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </>
      )}
      {subject === 'biology' && (
        <g className="g-sway">
          <path d="M12 52C10 28 24 12 52 10c2 28-12 42-36 44" {...p} />
          <path d="M12 52C24 40 32 32 44 22" {...p} />
        </g>
      )}
    </svg>
  );
}

export default function Home({ onOpen }: { onOpen: (s: Subject) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<SubjectStat[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats().then(setStats).catch(() => setError("Ma'lumotlarni yuklab bo'lmadi. Backend ishlayaptimi?"));
  }, []);

  const first = user?.fullName.split(' ')[0] ?? '';
  const totalDone = stats?.reduce((s, r) => s + r.attempts, 0) ?? 0;

  return (
    <>
    <Backdrop multi />
    <div className="page">
      <section className="hero">
        <h1>Salom, {first}</h1>
        <p>
          {totalDone > 0
            ? `Siz hozircha ${totalDone} ta tajriba natijasini saqlagansiz. Davom eting.`
            : 'Fanni tanlang va birinchi tajribangizni boshlang.'}
        </p>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="subject-grid">
        {(Object.keys(SUBJECT_META) as Subject[]).map((s, idx) => {
          const st = stats?.find((r) => r.subject === s);
          const ratio = st && st.ready ? st.doneTopics / st.ready : 0;
          return (
            <button key={s} className="subject-card" data-subject={s} style={{ '--i': idx } as CSSProperties} onClick={() => onOpen(s)}>
              <div className="subject-text">
                <span className="glyph-wrap">
                  <Glyph subject={s} />
                </span>
                <h2>{SUBJECT_META[s].label}</h2>
                <p>{SUBJECT_META[s].blurb}</p>
                <div className="stats">
                  <div className="stat">
                    <b>{st ? <CountUp value={st.total} /> : '…'}</b>
                    <span>mavzu</span>
                  </div>
                  <div className="stat">
                    <b>{st ? <CountUp value={st.ready} /> : '…'}</b>
                    <span>tayyor tajriba</span>
                  </div>
                  <div className="stat">
                    <b>{st ? <><CountUp value={st.doneTopics} />/{st.ready}</> : '…'}</b>
                    <span>siz bajardingiz</span>
                  </div>
                </div>
              </div>
              <Vessel subject={s} ratio={ratio} index={idx} />
            </button>
          );
        })}
      </div>

      <ResultsList
        title="So‘nggi natijalarim"
        limit={6}
        showTopic
        emptyText="Hali natija yo‘q. Tajriba tugagach “Natijani saqlash” tugmasini bosing."
      />
    </div>
    </>
  );
}
