import type { ComponentType } from 'react';
import type { SimProps } from './types';
import FreeFall from './simulations/FreeFall';
import Pendulum from './simulations/Pendulum';
import Ohm from './simulations/Ohm';
import ReactionRate from './simulations/ReactionRate';
import Titration from './simulations/Titration';
import Cell from './simulations/Cell';
import Photosynthesis from './simulations/Photosynthesis';
import Osmosis from './simulations/Osmosis';
import Mixing from './simulations/Mixing';

/** Yangi simulyatsiya qo'shish: komponent yozing, bu yerga kalit bilan ulang,
 *  backend/src/topics/curriculum.ts da mavzuga shu kalitni bering. */
export const SIMULATIONS: Record<string, ComponentType<SimProps>> = {
  'free-fall': FreeFall,
  pendulum: Pendulum,
  ohm: Ohm,
  'reaction-rate': ReactionRate,
  titration: Titration,
  cell: Cell,
  photosynthesis: Photosynthesis,
  osmosis: Osmosis,
  mixing: Mixing,
};
