import type { CSSProperties } from 'react';
import { toSub } from './Formula';

export interface PItem {
  formula: string;
  color: string;
  solid: boolean;
}
export interface PVisual {
  liquid: string;
  precipitate: string | null;
  deposit: string | null;
  gas: boolean;
  heat: boolean;
}

const GAS_BUBBLES = [
  [296, 420, 4], [316, 424, 3], [334, 418, 5], [352, 426, 3], [370, 420, 4], [388, 424, 5],
  [406, 418, 3], [324, 428, 4], [380, 430, 3], [344, 414, 4], [300, 430, 3], [398, 414, 4],
];

const FLASK = 'M-10 -70h20v30l25 70q4 12-10 12h-50q-14 0-10-12l25-70z';

/** Ikki modda stakanga quyiladi va aralashadi: chizma va animatsiya (Mixing va ReagentLab ishlatadi) */
export default function PourStage({ a, b, v, runKey }: { a: PItem | null; b: PItem | null; v: PVisual | null; runKey: number }) {
  let liquids = 0;
  const levels = [a, b].map((r) => {
    if (!r || r.solid) return { y: 340, h: 96 };
    liquids += 1;
    return liquids === 1 ? { y: 340, h: 96 } : { y: 280, h: 60 };
  });
  const mixLevel = liquids === 2 ? { y: 280, h: 156 } : { y: 340, h: 96 };
  const mixColor = v?.liquid ?? '#d6ebff';
  const layerColor = v?.precipitate ?? '#ffffff';
  const depColor = v?.deposit ?? '#ffffff';
  const aLiquid = !!a && !a.solid;
  const bLiquid = !!b && !b.solid;
  const aSolid = !!a && a.solid;
  const bSolid = !!b && b.solid;
  const both = !!(a && b);
  const colorOf = (r: PItem | null) => r?.color ?? '#d6ebff';

  return (
    <>
            <svg key={`s${runKey}`} viewBox="0 0 700 480" role="img" aria-label="Ikki modda stakanga quyiladi va aralashadi">
              <defs>
                <clipPath id="mx-bkin"><path d="M272 200V416Q272 436 292 436H408Q428 436 428 416V200Z" /></clipPath>
                <clipPath id="mx-cf"><path d={FLASK} /></clipPath>
              </defs>
    
              <rect x="70" y="196" width="140" height="8" rx="4" fill="#1a2650" />
              <rect x="490" y="196" width="140" height="8" rx="4" fill="#1a2650" />
              <text x="140" y="234" textAnchor="middle" fontSize="17" fontWeight="700" fill="#eef1ff">{a ? toSub(a.formula) : '1-modda'}</text>
              <text x="560" y="234" textAnchor="middle" fontSize="17" fontWeight="700" fill="#eef1ff">{b ? toSub(b.formula) : '2-modda'}</text>
              <ellipse cx="350" cy="448" rx="100" ry="9" fill="#000" opacity=".35" />
              {v?.heat && <ellipse className="mx-heat" cx="350" cy="446" rx="110" ry="14" fill="#ff8a3d" style={{ filter: 'blur(8px)' }} />}
    
              {aLiquid && <rect className="mx-strA" x="288.5" y="176" width="5" height="170" rx="2.5" fill={colorOf(a)} />}
              {bLiquid && <rect className="mx-strB" x="406.5" y="176" width="5" height="170" rx="2.5" fill={colorOf(b)} />}
    
              <g clipPath="url(#mx-bkin)">
                <g style={{ filter: `drop-shadow(0 0 12px ${mixColor})` }}>
                  {aLiquid && <rect className="mx-liqA" x="272" y={levels[0].y} width="156" height={levels[0].h} fill={colorOf(a)} />}
                  {bLiquid && <rect className="mx-liqB" x="272" y={levels[1].y} width="156" height={levels[1].h} fill={colorOf(b)} />}
                  {liquids > 0 && <rect className="mx-liqM" x="272" y={mixLevel.y} width="156" height={mixLevel.h} fill={mixColor} />}
                </g>
                {v?.precipitate && <rect className="mx-ppt" x="272" y="392" width="156" height="44" rx="6" fill={layerColor} />}
                {v?.gas &&
                  GAS_BUBBLES.map(([cx, cy, r], i) => (
                    <circle key={i} className="mx-gas" style={{ '--k': i } as CSSProperties} cx={cx} cy={cy} r={r} fill="#fff" />
                  ))}
                {both && (
                  <>
                    <ellipse className="mx-swirl" cx="350" cy="330" rx="62" ry="15" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeDasharray="46 30" />
                    <ellipse className="mx-swirl" cx="350" cy="370" rx="44" ry="11" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2.5" strokeDasharray="30 26" />
                  </>
                )}
              </g>
    
              {aSolid && a && (
                <g className="mx-sa">
                  <rect width="44" height="18" rx="5" fill={colorOf(a)} stroke="#cfd8ff" strokeOpacity=".5" />
                  {v?.deposit && <rect className="mx-depo" x="-2" y="-2" width="48" height="22" rx="7" fill={depColor} />}
                </g>
              )}
              {bSolid && b && (
                <g className="mx-sb">
                  <rect width="44" height="18" rx="5" fill={colorOf(b)} stroke="#cfd8ff" strokeOpacity=".5" />
                  {v?.deposit && <rect className="mx-depo" x="-2" y="-2" width="48" height="22" rx="7" fill={depColor} />}
                </g>
              )}
    
              <path d="M272 200V416Q272 436 292 436H408Q428 436 428 416V200" fill="none" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
              <path d="M282 214V396" stroke="#fff" strokeOpacity=".14" strokeWidth="5" strokeLinecap="round" />
              <path d="M428 250h-12M428 290h-8M428 330h-12M428 370h-8" stroke="#9fabd6" strokeWidth="2" strokeLinecap="round" />
              {v?.heat && (
                <>
                  <path className="mx-steam" d="M312 190c-9-11 9-17 0-28" />
                  <path className="mx-steam" d="M350 190c-9-11 9-17 0-28" style={{ animationDelay: '7.2s' }} />
                  <path className="mx-steam" d="M388 190c-9-11 9-17 0-28" style={{ animationDelay: '7.6s' }} />
                </>
              )}
    
              {aLiquid && (
                <g className="mx-fa">
                  <g clipPath="url(#mx-cf)"><rect className="mx-dA" x="-40" y="-14" width="80" height="60" fill={colorOf(a)} /></g>
                  <path d={FLASK} fill="rgba(255,255,255,0.05)" stroke="#cfd8ff" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M-14 -70h28" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}
              {bLiquid && (
                <g className="mx-fb">
                  <g clipPath="url(#mx-cf)"><rect className="mx-dB" x="-40" y="-14" width="80" height="60" fill={colorOf(b)} /></g>
                  <path d={FLASK} fill="rgba(255,255,255,0.05)" stroke="#cfd8ff" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M-14 -70h28" stroke="#cfd8ff" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}
            </svg>
            <div className="mx-prog"><i key={`p${runKey}`} /></div>
          </>
  );
}
