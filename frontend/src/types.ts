export type Subject = 'physics' | 'chemistry' | 'biology';

export interface Topic {
  id: number;
  subject: Subject;
  grade: number;
  title: string;
  simKey: string | null;
  sortOrder: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface ResultItem {
  id: number;
  topicId: number;
  topicTitle: string;
  subject: Subject;
  grade: number;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface SubjectStat {
  subject: Subject;
  total: number;
  ready: number;
  attempts: number;
  doneTopics: number;
}

export interface Reagent {
  id: string;
  name: string;
  formula: string;
  group: 'kislota' | 'asos' | 'tuz' | 'metall' | 'indikator';
}

export interface MixResult {
  a: Reagent;
  b: Reagent;
  known: boolean;
  reaction: {
    equation: string;
    type: string;
    observation: string;
    visual: { liquid: string; precipitate: string | null; deposit: string | null; gas: boolean; heat: boolean };
  };
}

export type AiMode = 'explain' | 'steps' | 'ask';
export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

/** Har bir simulyatsiya shu propslarni oladi */
export interface SimProps {
  topicId: number;
  onSaved: () => void;
}

export const SUBJECT_META: Record<Subject, { label: string; grades: number[]; blurb: string }> = {
  physics: { label: 'Fizika', grades: [7, 8, 9, 10, 11], blurb: 'Harakat, tok, tebranishlar' },
  chemistry: { label: 'Kimyo', grades: [7, 8, 9, 10, 11], blurb: 'Moddalar va reaksiyalar' },
  biology: { label: 'Biologiya', grades: [5, 6, 7, 8, 9, 10, 11], blurb: 'Hujayra, o‘simlik, organizm' },
};
