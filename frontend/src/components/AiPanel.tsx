import { useEffect, useRef, useState } from 'react';
import { aiAssist } from '../api';
import type { AiMode, ChatMsg } from '../types';

interface Props {
  topicId: number;
  state: Record<string, unknown>;
}

export default function AiPanel({ topicId, state }: Props) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [msgs, busy]);

  async function ask(mode: AiMode, label: string, q?: string) {
    if (busy) return;
    setError('');
    setBusy(true);
    const history = msgs.slice(-6);
    setMsgs((m) => [...m, { role: 'user', content: label }]);
    try {
      const { answer } = await aiAssist({ topicId, mode, state, question: q, history });
      setMsgs((m) => [...m, { role: 'assistant', content: answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI javob bermadi');
    } finally {
      setBusy(false);
    }
  }

  function submit() {
    const q = question.trim();
    if (!q) return;
    setQuestion('');
    void ask('ask', q, q);
  }

  return (
    <section className="ai" aria-label="AI yordamchi">
      <div className="ai-head">
        <h3>AI yordamchi</h3>
        <div className="row">
          <button className="chip" disabled={busy} onClick={() => ask('explain', 'Hozir nima sodir bo‘lyapti?')}>
            Nima sodir bo‘lyapti?
          </button>
          <button className="chip" disabled={busy} onClick={() => ask('steps', 'Ishni qanday bajaraman?')}>
            Ishni qanday bajaraman?
          </button>
        </div>
      </div>

      <div className="ai-log" aria-live="polite">
        {msgs.length === 0 && !busy && (
          <p className="note">
            Tajribani o‘zgartiring va “Nima sodir bo‘lyapti?” ni bosing. AI ko‘rayotgan qiymatlaringiz asosida sababini tushuntiradi.
          </p>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'bubble me' : 'bubble ai'}>
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="bubble ai typing" aria-label="AI yozmoqda">
            <i /><i /><i />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <div ref={endRef} />
      </div>

      <div className="ai-input">
        <input
          value={question}
          maxLength={500}
          placeholder="Savolingizni yozing..."
          aria-label="AI ga savol"
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn primary" disabled={busy || !question.trim()} onClick={submit}>
          Yuborish
        </button>
      </div>
    </section>
  );
}
