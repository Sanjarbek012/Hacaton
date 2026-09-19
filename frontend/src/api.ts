import type { AiMode, ChatMsg, MixResult, Reagent, ResultItem, Subject, SubjectStat, Topic, User } from './types';

const TOKEN_KEY = 'vl_token';
let token: string | null = localStorage.getItem(TOKEN_KEY);
let onUnauthorized: (() => void) | null = null;

export const hasToken = () => !!token;
export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401 && token) onUnauthorized?.();
  if (!res.ok) {
    let msg = `So'rov xatosi (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = Array.isArray(body.message) ? body.message.join(', ') : String(body.message);
    } catch {
      /* JSON emas */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

const post = <T>(url: string, body: unknown) => http<T>(url, { method: 'POST', body: JSON.stringify(body) });

// auth
export const login = (email: string, password: string) =>
  post<{ token: string; user: User }>('/api/auth/login', { email, password });
export const register = (fullName: string, email: string, password: string) =>
  post<{ token: string; user: User }>('/api/auth/register', { fullName, email, password });
export const getMe = () => http<User>('/api/auth/me');

// ma'lumotlar (bazadan)
export const getTopics = (subject: Subject, grade: number) =>
  http<Topic[]>(`/api/topics?subject=${subject}&grade=${grade}`);
export const getStats = () => http<SubjectStat[]>('/api/stats/overview');
export const getResults = (topicId?: number, limit = 8) =>
  http<ResultItem[]>(`/api/results?limit=${limit}${topicId ? `&topicId=${topicId}` : ''}`);
export const saveResult = (topicId: number, data: Record<string, unknown>) =>
  post<{ id: number }>('/api/results', { topicId, data });

// kimyo
export const getReagents = () => http<Reagent[]>('/api/chem/reagents');
export const mixReagents = (a: string, b: string) => post<MixResult>('/api/chem/mix', { a, b });

// AI
export const aiAssist = (p: {
  topicId: number;
  mode: AiMode;
  state?: Record<string, unknown>;
  question?: string;
  history?: ChatMsg[];
}) => post<{ answer: string }>('/api/ai/assist', p);
