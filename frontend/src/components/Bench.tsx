import type { Subject } from '../types';
import { BENCH_SVG } from './benchArt';

/** Fanga mos jihozli laboratoriya stoli: fizika, kimyo, biologiya. Dekorativ, animatsiyali. */
export default function Bench({ subject }: { subject: Subject }) {
  return <div className="bench" aria-hidden="true" dangerouslySetInnerHTML={{ __html: BENCH_SVG[subject] }} />;
}
