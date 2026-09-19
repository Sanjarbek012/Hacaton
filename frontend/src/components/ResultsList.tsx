import { useEffect, useState, type CSSProperties } from 'react';
import { getResults } from '../api';
import { SUBJECT_META, type ResultItem } from '../types';

function fmt(v: unknown): string {
  if (typeof v === 'number') return String(Math.round(v * 1000) / 1000);
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? 'ha' : "yo'q";
  return String(v);
}

interface Props {
  topicId?: number;
  refreshKey?: number;
  title: string;
  limit?: number;
  showTopic?: boolean;
  emptyText?: string;
}

export default function ResultsList({ topicId, refreshKey = 0, title, limit = 8, showTopic, emptyText }: Props) {
  const [items, setItems] = useState<ResultItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    getResults(topicId, limit)
      .then((r) => alive && setItems(r))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [topicId, refreshKey, limit]);

  if (items && items.length === 0 && !emptyText) return null;

  return (
    <section className="results">
      <h3>{title}</h3>
      {items && items.length === 0 && <p className="note">{emptyText}</p>}
      <ul>
        {(items ?? []).map((r, i) => (
          <li key={r.id} data-subject={r.subject} style={{ '--i': i } as CSSProperties}>
            <div className="results-head">
              <strong>{showTopic ? r.topicTitle : new Date(r.createdAt).toLocaleString('uz-UZ')}</strong>
              {showTopic && (
                <span className="results-sub">
                  {SUBJECT_META[r.subject].label}, {r.grade}-sinf
                </span>
              )}
              {showTopic && <time>{new Date(r.createdAt).toLocaleString('uz-UZ')}</time>}
            </div>
            <div className="results-data">
              {Object.entries(r.data).map(([k, v]) => (
                <span key={k}>
                  {k}: <b>{fmt(v)}</b>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
