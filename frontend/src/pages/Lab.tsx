import { useEffect, useState } from 'react';
import { getTopics } from '../api';
import AiPanel from '../components/AiPanel';
import Backdrop from '../components/Backdrop';
import FlaskArt from '../components/FlaskArt';
import Loader from '../components/Loader';
import ResultsList from '../components/ResultsList';
import { SimStateContext } from '../components/SimStateContext';
import { SIMULATIONS } from '../registry';
import { SUBJECT_META, type Subject, type Topic } from '../types';

const SUBJECTS = Object.keys(SUBJECT_META) as Subject[];

interface Props {
  subject: Subject;
  grade: number;
  onSubject: (s: Subject) => void;
  onGrade: (g: number) => void;
}

export default function Lab({ subject, grade, onSubject, onGrade }: Props) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [simState, setSimState] = useState<Record<string, unknown>>({});

  useEffect(() => {
    let alive = true;
    setError(null);
    getTopics(subject, grade)
      .then((list) => {
        if (!alive) return;
        setTopics(list);
        const first = list.find((t) => t.simKey && SIMULATIONS[t.simKey]) ?? list[0];
        setSelectedId(first ? first.id : null);
      })
      .catch(() => alive && setError("Serverga ulanib bo'lmadi. Backend ishga tushganini tekshiring."));
    return () => {
      alive = false;
    };
  }, [subject, grade]);

  const selected = topics.find((t) => t.id === selectedId) ?? null;
  const Sim = selected?.simKey ? SIMULATIONS[selected.simKey] : undefined;

  return (
    <div className="lab-page" data-subject={subject}>
      <Backdrop />
      <div className="lab-top">
        <nav className="tabs" aria-label="Fanlar">
          {SUBJECTS.map((s) => (
            <button key={s} className={s === subject ? 'tab active' : 'tab'} data-subject={s} aria-pressed={s === subject} onClick={() => onSubject(s)}>
              {SUBJECT_META[s].label}
            </button>
          ))}
        </nav>
      </div>

      <div className="body">
        <aside className="side">
          <div className="grades" role="group" aria-label="Sinf">
            {SUBJECT_META[subject].grades.map((g) => (
              <button key={g} className={g === grade ? 'chip active' : 'chip'} onClick={() => onGrade(g)}>
                {g}-sinf
              </button>
            ))}
          </div>
          {error && <p className="error">{error}</p>}
          <ul className="topics">
            {topics.length === 0 && !error && Array.from({ length: 7 }, (_, i) => <li key={i} className="skeleton" aria-hidden="true" />)}
            {topics.map((t) => {
              const ready = !!(t.simKey && SIMULATIONS[t.simKey]);
              return (
                <li key={t.id}>
                  <button className={t.id === selectedId ? 'topic active' : 'topic'} onClick={() => setSelectedId(t.id)}>
                    <span>{t.title}</span>
                    {ready ? <em className="ready">tajriba</em> : <em className="soon">tez orada</em>}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="main">
          {selected ? (
            <div key={selected.id} className="swap-in">
              <h2>{selected.title}</h2>
              <p className="meta">
                {SUBJECT_META[selected.subject].label}, {selected.grade}-sinf
              </p>
              {Sim ? (
                <SimStateContext.Provider value={setSimState}>
                  <Sim key={selected.id} topicId={selected.id} onSaved={() => setRefreshKey((k) => k + 1)} />
                  <AiPanel key={`ai-${selected.id}`} topicId={selected.id} state={simState} />
                  <ResultsList title="Mening natijalarim" topicId={selected.id} refreshKey={refreshKey} />
                </SimStateContext.Provider>
              ) : (
                <div className="soon-panel">
                  <FlaskArt size={110} />
                  <p>Bu mavzu uchun tajriba hali tayyor emas.</p>
                  <p>Tayyor tajribalar chap ro‘yxatda “tajriba” belgisi bilan ko‘rsatilgan.</p>
                </div>
              )}
            </div>
          ) : (
            !error && <Loader label="Mavzular yuklanmoqda..." />
          )}
        </main>
      </div>
    </div>
  );
}
