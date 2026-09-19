import { useAuth } from '../auth/AuthContext';

interface Props {
  view: 'home' | 'lab';
  onNavigate: (v: 'home' | 'lab') => void;
}

export default function Header({ view, onNavigate }: Props) {
  const { user, signOut } = useAuth();
  return (
    <header className="header">
      <button className="brand" onClick={() => onNavigate('home')} aria-label="Bosh sahifa">
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
          <path d="M9 3h8M11 3v7l-6 11a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-11V3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M7 17h12" stroke="currentColor" strokeWidth="2" />
        </svg>
        Virtual laboratoriya
      </button>
      <nav className="nav" aria-label="Asosiy">
        <button className={view === 'home' ? 'nav-btn active' : 'nav-btn'} onClick={() => onNavigate('home')}>
          Bosh sahifa
        </button>
        <button className={view === 'lab' ? 'nav-btn active' : 'nav-btn'} onClick={() => onNavigate('lab')}>
          Laboratoriya
        </button>
      </nav>
      <div className="user">
        <span className="user-name">{user?.fullName}</span>
        <button className="nav-btn" onClick={signOut}>
          Chiqish
        </button>
      </div>
    </header>
  );
}
