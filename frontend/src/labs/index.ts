import type { ComponentType } from 'react';
import type { SimProps } from '../types';
import { BohrLab, OrbitalLab } from './AtomLab';
import { makeDnaLab } from './DnaLab';
import { makeExplorerLab } from './ExplorerLab';
import { makeFormulaLab } from './FormulaLab';
import { makeReagentLab } from './ReagentLab';
import { makeSorterLab } from './SorterLab';
import { makeStepperLab } from './StepperLab';
import { BIO } from './configs/bio';
import { CHEM } from './configs/chem';
import { EXPLORERS } from './configs/explorers';
import { PHYSICS } from './configs/physics';
import { REAGENTS } from './configs/reagents';
import { SORTERS } from './configs/sorters';
import { STEPS } from './configs/steps';

/** Formula, reagent, tasniflash, xarita va bosqichli dvigatellar asosidagi barcha tajribalar. */
export const LABS: Record<string, ComponentType<SimProps>> = {
  'p11-atom': BohrLab,
  'c11-orbitals': OrbitalLab,
  'b11-molbio': makeDnaLab('pair'),
  'b11-dnarna': makeDnaLab('rna'),
  'b11-protein': makeDnaLab('protein'),
};
Object.entries(PHYSICS).forEach(([k, d]) => { LABS[k] = makeFormulaLab(d); });
Object.entries(CHEM).forEach(([k, d]) => { LABS[k] = makeFormulaLab(d); });
Object.entries(BIO).forEach(([k, d]) => { LABS[k] = makeFormulaLab(d); });
Object.entries(REAGENTS).forEach(([k, d]) => { LABS[k] = makeReagentLab(d); });
Object.entries(SORTERS).forEach(([k, d]) => { LABS[k] = makeSorterLab(d); });
Object.entries(EXPLORERS).forEach(([k, d]) => { LABS[k] = makeExplorerLab(d); });
Object.entries(STEPS).forEach(([k, d]) => { LABS[k] = makeStepperLab(d); });
