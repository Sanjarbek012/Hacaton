import { useEffect, useState } from 'react';
import { saveResult } from '../api';
import { usePublishSimState } from './SimStateContext';

interface Props {
  topicId: number;
  data: Record<string, unknown>;
  canSave: boolean;
  hint?: string;
  onSaved: () => void;
}

export default function SaveBar({ topicId, data, canSave, hint, onSaved }: Props) {
  const publish = usePublishSimState();
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');
  const snapshot = JSON.stringify(data);

  // AI yordamchi shu holatni ko'radi
  useEffect(() => {
    publish(JSON.parse(snapshot) as Record<string, unknown>);
  }, [snapshot, publish]);

  // Parametrlar o'zgarsa, "Saqlandi" belgisi o'chadi
  useEffect(() => {
    setStatus('idle');
  }, [snapshot]);

  async function submit() {
    setStatus('saving');
    try {
      await saveResult(topicId, data);
      setStatus('ok');
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xato');
      setStatus('error');
    }
  }

  return (
    <div className="savebar">
      <button className="btn primary" disabled={!canSave || status === 'saving'} onClick={submit}>
        Natijani saqlash
      </button>
      <span className="savebar-note" role="status">
        {status === 'ok' && (
          <>
            <svg className="check" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
              <circle cx="10" cy="10" r="9" fill="none" />
              <path d="M5.5 10.5l3 3 6-6.5" pathLength="1" fill="none" />
            </svg>
            Saqlandi. Natijalaringiz pastda ko‘rinadi.
          </>
        )}
        {status === 'error' && `Saqlab bo‘lmadi: ${error}`}
        {status === 'idle' && !canSave && (hint ?? 'Avval tajribani bajaring')}
      </span>
    </div>
  );
}
