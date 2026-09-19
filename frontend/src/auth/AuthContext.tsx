import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from '../api';
import type { User } from '../types';

interface AuthValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(api.hasToken());

  const signOut = useCallback(() => {
    api.setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    api.setUnauthorizedHandler(signOut);
    if (!api.hasToken()) return;
    api
      .getMe()
      .then(setUser)
      .catch(() => api.setToken(null))
      .finally(() => setLoading(false));
  }, [signOut]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const r = await api.login(email, password);
        api.setToken(r.token);
        setUser(r.user);
      },
      signUp: async (fullName, email, password) => {
        const r = await api.register(fullName, email, password);
        api.setToken(r.token);
        setUser(r.user);
      },
      signOut,
    }),
    [user, loading, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider topilmadi');
  return v;
}
