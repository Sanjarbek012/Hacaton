import type { CSSProperties } from 'react';
import type { Subject } from '../types';

const PHYS_PATH = 'M22 14a5.5 5.5 0 0 1 11 0V112.4A14 14 0 1 1 22 112.4Z';
const FLASK_PATH = 'M21 8h13v40l16 78q2 12-10 12H15q-12 0-10-12l16-78z';
const BEAKER_PATH = 'M9 14V126q0 12 12 12H34q12 0 12-12V14z';

/** Har fanning o'z idishi: fizika, termometr; kimyo, kolba; biologiya, suv o'simligi solingan stakan.
 *  Suyuqlik sathi bajarilgan tajribalar ulushiga (ratio: 0..1) qarab ko'tariladi. */
export default function Vessel({ subject, ratio, index }: { subject: Subject; ratio: number; index: number }) {
  const r = Math.max(0, Math.min(1, ratio));
  const y = Math.round(subject === 'physics' ? 124 - r * 104 : subject === 'chemistry' ? 136 - r * 70 : 134 - r * 100);
  const clip = `vessel-${subject}`;
  const style = { '--y': `${y}px`, '--i': index } as CSSProperties;
  const label = `Bajarilgan tajribalar ulushi: ${Math.round(r * 100)}%`;
  const wave = 'M-20 0q10-3 20 0' + 't20 0'.repeat(6) + 'V10H-20z';

  if (subject === 'physics') {
    return (
      <svg className="vessel" viewBox="0 0 55 150" role="img" aria-label={label}>
        <defs><clipPath id={clip}><path d={PHYS_PATH} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          <g className="tube-fill" style={style}>
            <path className="tube-wave v-liq" d={wave} />
            <rect className="v-liq" x="-20" y="4" width="120" height="170" />
            <circle className="tbub" cx="27.5" cy="40" r="1.6" fill="#fff" />
            <circle className="tbub" cx="26" cy="62" r="1.3" fill="#fff" style={{ animationDelay: '.9s' }} />
            <circle className="tbub" cx="29" cy="80" r="1.8" fill="#fff" style={{ animationDelay: '1.6s' }} />
          </g>
        </g>
        <path d={PHYS_PATH} fill="none" stroke="#cfd8ff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M15 30h5M15 46h3M15 62h5M15 78h3M15 94h5M38 40h5M38 56h3M38 72h5M38 88h3" stroke="#9fabd6" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  if (subject === 'chemistry') {
    return (
      <svg className="vessel" viewBox="0 0 55 150" role="img" aria-label={label}>
        <defs><clipPath id={clip}><path d={FLASK_PATH} /></clipPath></defs>
        <g clipPath={`url(#${clip})`}>
          <g className="tube-fill" style={style}>
            <path className="tube-wave v-liq" d={'M-20 0q10-4 20 0' + 't20 0'.repeat(6) + 'V10H-20z'} />
            <rect className="v-liq" x="-20" y="4" width="120" height="170" />
            <circle className="tbub" cx="20" cy="30" r="2.2" fill="#fff" />
            <circle className="tbub" cx="32" cy="44" r="1.6" fill="#fff" style={{ animationDelay: '.7s' }} />
            <circle className="tbub" cx="26" cy="56" r="2.8" fill="#fff" style={{ animationDelay: '1.4s' }} />
            <circle className="tbub" cx="38" cy="26" r="1.8" fill="#fff" style={{ animationDelay: '2s' }} />
          </g>
        </g>
        <path d={FLASK_PATH} fill="none" stroke="#cfd8ff" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M17 8h21" stroke="#cfd8ff" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M12 120L20 86" stroke="#fff" strokeOpacity=".18" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M41 100h6M43 112h4" stroke="#9fabd6" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="vessel" viewBox="0 0 55 150" role="img" aria-label={label}>
      <defs><clipPath id={clip}><path d={BEAKER_PATH} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <g className="tube-fill" style={style}>
          <path className="tube-wave v-liq-soft" d={wave} />
          <rect className="v-liq-soft" x="-20" y="10" width="120" height="170" />
          <circle className="tbub" cx="15" cy="40" r="1.8" fill="#fff" />
          <circle className="tbub" cx="40" cy="30" r="1.4" fill="#fff" style={{ animationDelay: '.8s' }} />
          <circle className="tbub" cx="20" cy="60" r="2.2" fill="#fff" style={{ animationDelay: '1.5s' }} />
          <circle className="tbub" cx="36" cy="56" r="1.6" fill="#fff" style={{ animationDelay: '2.1s' }} />
        </g>
        <path d="M27.5 138C24 112 31 92 27.5 56" fill="none" stroke="#e9fff5" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M27.5 112C17 108 14 98 12 90M27.5 94C38 90 42 80 44 72M27.5 76C18 72 16 64 15 58M27.5 64C36 60 38 52 39 46" fill="none" stroke="#e9fff5" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <path d={BEAKER_PATH.replace('z', '')} fill="none" stroke="#cfd8ff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 14h9M42 14h9" stroke="#cfd8ff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M46 46h-5M46 70h-3M46 94h-5M46 118h-3" stroke="#9fabd6" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
