import { useId } from 'react';

const WAVE = 'M-40 120q10-8 20 0' + 't20 0'.repeat(13) + 'V130H-40z';

/** Suyuqligi to'lqinlanadigan, ichida pufakchalar ko'tariladigan kolba (yuklanish va bo'sh holatlar uchun) */
export default function FlaskArt({ size = 96, color = 'var(--accent)' }: { size?: number; color?: string }) {
  const id = 'fa' + useId().replace(/:/g, '');
  return (
    <svg className="flask-art" width={size} height={size * 1.1} viewBox="0 0 200 220" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <path d="M78 20h44v60l50 100q8 22-14 22H42q-22 0-14-22l50-100z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <path className="fa-wave" d={WAVE} style={{ fill: color }} />
        <rect x="-40" y="124" width="300" height="100" style={{ fill: color }} />
        {[0, 1, 2].map((i) => (
          <circle key={i} className="fa-bub" cx={82 + i * 18} cy="190" r={5 + (i % 2) * 2} fill="#fff" style={{ animationDelay: `${i * 0.8}s` }} />
        ))}
      </g>
      <path d="M78 20h44v60l50 100q8 22-14 22H42q-22 0-14-22l50-100z" fill="none" style={{ stroke: 'var(--glass)' }} strokeWidth="8" strokeLinejoin="round" />
      <path d="M70 20h60" style={{ stroke: 'var(--glass)' }} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
}
