import { useEffect, useState, type CSSProperties } from 'react';
import { getResults, getStats } from '../api';
import { useAuth } from '../auth/AuthContext';
import Backdrop from '../components/Backdrop';
import CountUp from '../components/CountUp';
import ResultsList from '../components/ResultsList';
import Vessel from '../components/Vessel';
import { SUBJECT_META, type ResultItem, type Subject, type SubjectStat } from '../types';

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

export default function Home({ onOpen }: { onOpen: (s: Subject, grade?: number) => void }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<SubjectStat[] | null>(null);
  const [error, setError] = useState('');
  const [last, setLast] = useState<ResultItem | null>(null);

  useEffect(() => {
    getStats().then(setStats).catch(() => setError("Ma'lumotlarni yuklab bo'lmadi. Backend ishlayaptimi?"));
  getResults(undefined, 1).then((r) => setLast(r[0] ?? null)).catch(() => undefined);
  }, []);

  const first = user?.fullName.split(' ')[0] ?? '';
  const totalDone = stats?.reduce((n, r) => n + r.doneTopics, 0) ?? 0;
  const totalReady = stats?.reduce((n, r) => n + r.ready, 0) ?? 0;
  const pct = totalReady ? Math.round((totalDone / totalReady) * 100) : 0;
  const subjects = Object.keys(SUBJECT_META) as Subject[];

  return (
    <>
    <Backdrop multi />
    <div className="page home">
      <section className="hero2">
        <div className="hero-copy">
          <h1>Salom, {first}</h1>
          <p>Fanni tanlang, parametrlarni o‘zgartiring va natijani o‘z ko‘zingiz bilan ko‘ring.</p>
          <div className="row">
            <button className="btn primary big" onClick={() => (last ? onOpen(last.subject, last.grade) : onOpen('physics', 9))}>
              {last ? `Davom etish: ${SUBJECT_META[last.subject].label}, ${last.grade}-sinf` : 'Birinchi tajribani boshlash'}
            </button>
          </div>
        </div>
        <div className="hero-progress" aria-label="Umumiy natija">
          <div className="ring" style={{ '--p': `${pct}%` } as CSSProperties}>
            <b>{stats ? <CountUp value={pct} /> : '…'}<small>%</small></b>
          </div>
          <div className="hp-text">
            <strong>{stats ? `${totalDone} ta tajriba bajarildi` : 'Yuklanmoqda'}</strong>
            <span>{stats ? `${totalReady} tadan` : ' '}</span>
          </div>
        </div>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="subject-grid">
        {subjects.map((s, idx) => {
          const st = stats?.find((r) => r.subject === s);
          const ratio = st && st.ready ? st.doneTopics / st.ready : 0;
          return (
            <article key={s} className="subject-card" data-subject={s} style={{ '--i': idx } as CSSProperties}>
              <div className="subject-text">
                <button className="card-open" onClick={() => onOpen(s)} aria-label={`${SUBJECT_META[s].label} laboratoriyasini ochish`}>
                  <span className="glyph-wrap"><Glyph subject={s} /></span>
                  <h2>{SUBJECT_META[s].label}</h2>
                </button>
                <p>{SUBJECT_META[s].blurb}</p>
                <div className="meter">
                  <div className="meter-top">
                    <b>{st ? <><CountUp value={st.doneTopics} /> / {st.ready}</> : '…'}</b>
                    <span>tajriba bajarildi</span>
                  </div>
                  <div className="bar"><i style={{ width: `${Math.max(ratio * 100, ratio > 0 ? 4 : 0)}%` }} /></div>
                </div>
              </div>
              <Vessel subject={s} ratio={ratio} index={idx} />
            <div className="grade-row" role="group" aria-label={`${SUBJECT_META[s].label}: sinfni tanlang`}>
              <span>Sinf</span>
              {SUBJECT_META[s].grades.map((g) => (
                <button key={g} className="grade" onClick={() => onOpen(s, g)} title={`${g}-sinf`}>{g}</button>
              ))}
            </div>
            </article>
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
