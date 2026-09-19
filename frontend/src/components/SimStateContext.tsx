import { createContext, useContext } from 'react';

/** Simulyatsiya o'z holatini shu orqali "e'lon qiladi", AI yordamchi uni o'qiydi. */
export const SimStateContext = createContext<(state: Record<string, unknown>) => void>(() => {});
export const usePublishSimState = () => useContext(SimStateContext);
