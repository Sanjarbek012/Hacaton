import { useState, type CSSProperties, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';

const FLASK_WAVE = 'M-40 120q10-8 20 0' + 't20 0'.repeat(13) + 'V130H-40z';
const DOTS = [
  { x: 8, y: 12, s: 14, t: 7, delay: 0 }, { x: 78, y: 8, s: 22, t: 9, delay: 1 }, { x: 60, y: 30, s: 10, t: 6, delay: 2 },
  { x: 90, y: 52, s: 18, t: 8, delay: 0.5 }, { x: 20, y: 60, s: 26, t: 10, delay: 1.5 }, { x: 45, y: 80, s: 12, t: 7, delay: 3 },
  { x: 85, y: 85, s: 16, t: 9, delay: 2.5 },
];

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'register' && fullName.trim().length < 2) return setError('Ismingizni kiriting');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Email noto‘g‘ri yozilgan');
    if (password.length < 6) return setError('Parol kamida 6 ta belgidan iborat bo‘lsin');
    setBusy(true);
    try {
      if (mode === 'login') await signIn(email, password);
      else await signUp(fullName, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xato yuz berdi');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <aside className="auth-brand">
        {DOTS.map((d, i) => (
          <span key={i} className="dot" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, '--t': `${d.t}s`, animationDelay: `${d.delay}s` } as CSSProperties} />
        ))}
        <h1>Virtual laboratoriya</h1>
        <p>Fizika, kimyo va biologiya tajribalarini xavfsiz, o‘zingiz sinab ko‘ring. AI yordamchi har qadamda nima sodir bo‘layotganini tushuntiradi.</p>
        <svg className="flask" viewBox="0 0 200 220" aria-hidden="true">
          <defs>
            <clipPath id="fl">
              <path d="M78 20h44v60l50 100q8 22-14 22H42q-22 0-14-22l50-100z" />
            </clipPath>
          </defs>
          <ellipse className="halo" cx="100" cy="196" rx="86" ry="16" fill="#b07bff" />
          <g clipPath="url(#fl)">
            <g className="fl-liquid">
              <path className="fl-wave" d={FLASK_WAVE} fill="#b07bff" />
              <rect x="-40" y="124" width="300" height="100" fill="#b07bff" />
            </g>
            {[0, 1, 2, 3, 4].map((i) => (
              <circle key={i} className="bubble-anim" cx={70 + i * 16} cy="190" r={4 + (i % 3) * 2} fill="#fff" style={{ animationDelay: `${i * 0.7}s` }} />
            ))}
          </g>
          <path d="M78 20h44v60l50 100q8 22-14 22H42q-22 0-14-22l50-100z" fill="none" stroke="#cfd8ff" strokeWidth="4" strokeLinejoin="round" />
          <path d="M70 20h60" stroke="#cfd8ff" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </aside>

      <main className="auth-form-wrap">
        <form key={mode} className="auth-form" onSubmit={submit} noValidate>
          <div className="segmented" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'seg active' : 'seg'} onClick={() => { setMode('login'); setError(''); }}>
              Kirish
            </button>
            <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'seg active' : 'seg'} onClick={() => { setMode('register'); setError(''); }}>
              Ro‘yxatdan o‘tish
            </button>
          </div>

          {mode === 'register' && (
            <label className="field">
              Ism va familiya
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" maxLength={80} />
            </label>
          )}
          <label className="field">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>
          <label className="field">
            Parol
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>

          {error && <p key={error} className="error shake" role="alert">{error}</p>}
          <button className="btn primary wide" disabled={busy}>
            {busy ? 'Kuting...' : mode === 'login' ? 'Kirish' : 'Ro‘yxatdan o‘tish'}
          </button>
        </form>
      </main>
    </div>
  );
}
