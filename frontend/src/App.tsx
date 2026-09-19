import { useState } from 'react';
import { useAuth } from './auth/AuthContext';
import Header from './components/Header';
import Loader from './components/Loader';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Lab from './pages/Lab';
import { SUBJECT_META, type Subject } from './types';

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'home' | 'lab'>('home');
  const [subject, setSubject] = useState<Subject>('physics');
  const [grade, setGrade] = useState(9);

  if (loading) return <Loader />;
  if (!user) return <AuthPage />;

  function changeSubject(s: Subject) {
    setSubject(s);
    const grades = SUBJECT_META[s].grades;
    if (!grades.includes(grade)) setGrade(grades.includes(9) ? 9 : grades[0]);
  }

  return (
    <div className="shell">
      <Header view={view} onNavigate={setView} />
      <div key={view} className="swap-in">
      {view === 'home' ? (
        <Home
          onOpen={(s) => {
            changeSubject(s);
            setView('lab');
          }}
        />
      ) : (
        <Lab subject={subject} grade={grade} onSubject={changeSubject} onGrade={setGrade} />
      )}
      </div>
    </div>
  );
}
