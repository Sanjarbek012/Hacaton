import { K, Svg } from './common';

const BONE = '#f1e6c8';
const BONE_EDGE = '#c9b98a';

/** Suyak: yo'g'on chiziq + uchlarida bo'rtma. bend = egilish (kvadratik egri chiziq). */
function Bone({ ax, ay, bx, by, cx, cy, color = BONE }: { ax: number; ay: number; bx: number; by: number; cx?: number; cy?: number; color?: string }) {
  const d = cx !== undefined && cy !== undefined ? `M${ax} ${ay}Q${cx} ${cy} ${bx} ${by}` : `M${ax} ${ay}L${bx} ${by}`;
  return (
    <g style={{ transition: 'all .6s ease' }}>
      <path d={d} fill="none" stroke={BONE_EDGE} strokeWidth="20" strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
      {[[ax, ay], [bx, by]].map(([x, y], k) => (
        <g key={k}>
          <circle cx={x - 7} cy={y} r="11" fill={color} stroke={BONE_EDGE} strokeWidth="2" />
          <circle cx={x + 7} cy={y} r="11" fill={color} stroke={BONE_EDGE} strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}

const Label = ({ x, y, t, c = K.g }: { x: number; y: number; t: string; c?: string }) => (
  <text x={x} y={y} fontSize="14" fontWeight="700" textAnchor="middle" fill={c}>{t}</text>
);

/** Suyakning kimyoviy tarkibi: kislota va olov tajribasi (i = bosqich 0..5). */
export function BoneScene({ i }: { i: number }) {
  const inAcid = i === 1;
  return (
    <Svg>
      {/* chap: kislota tajribasi */}
      {(i === 1) && (
        <g>
          <rect x="62" y="84" width="96" height="104" rx="8" fill="#16384D" stroke={K.g} strokeWidth="3" />
          <rect x="65" y="112" width="90" height="73" fill="#3fdc9a" opacity=".35" />
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={80 + k * 15} cy={170 - (k % 3) * 18} r="3.5" fill="#cfffe9" opacity=".9">
              <animate attributeName="cy" values={`${176};${118}`} dur={`${1.4 + k * 0.25}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values=".9;0" dur={`${1.4 + k * 0.25}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
      {i <= 1 && <Bone ax={110} ay={inAcid ? 118 : 70} bx={110} by={inAcid ? 172 : 160} />}
      {i >= 2 && <Bone ax={70} ay={96} bx={150} by={96} cx={110} cy={196} />}
      {i === 1 && <Label x={110} y={80} t="HCl eritmasi" c={K.gr} />}
      {i === 0 && <Label x={110} y={190} t="1-suyak" />}
      {i === 2 && <Label x={110} y={216} t="Egiluvchan (mineral ketdi)" c={K.gr} />}
      {i >= 3 && i !== 2 && <Label x={110} y={216} t="Egiluvchan suyak" c={K.gr} />}

      {/* o'ng: olov tajribasi */}
      {i <= 2 && <Bone ax={310} ay={70} bx={310} by={160} />}
      {i === 0 && <Label x={310} y={190} t="2-suyak" />}
      {i === 3 && (
        <g>
          <Bone ax={262} ay={110} bx={358} by={110} color="#8a7a55" />
          <rect x="296" y="168" width="28" height="22" rx="4" fill="#5b6a92" />
          <path d="M310 168c-16-14-10-30 0-44 10 14 16 30 0 44z" fill={K.a} />
          <path d="M310 168c-8-8-5-18 0-26 5 8 8 18 0 26z" fill="#fff2b3" />
          <Label x={310} y={212} t="Alanga" c={K.a} />
        </g>
      )}
      {i >= 4 && (
        <g>
          {[[270, 150, -20], [300, 160, 15], [330, 152, -8], [352, 162, 25]].map(([x, y, r], k) => (
            <g key={k} style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>
              <rect x="-14" y="-7" width="28" height="14" rx="6" fill={BONE} stroke={BONE_EDGE} strokeWidth="2" />
            </g>
          ))}
          {Array.from({ length: 14 }, (_, k) => <circle key={k} cx={262 + k * 8} cy={180 + (k % 3) * 4} r="2.2" fill={BONE} opacity=".8" />)}
          <Label x={310} y={212} t="Mo‘rt, uvalanadi" c={K.r} />
        </g>
      )}
      {i === 5 && (
        <g>
          <rect x="130" y="14" width="160" height="26" rx="6" fill="#26315f" />
          <rect x="130" y="14" width="53" height="26" rx="6" fill={K.a} />
          <rect x="183" y="14" width="107" height="26" fill={K.b} />
          <text x="156" y="32" fontSize="13" fontWeight="700" textAnchor="middle" fill="#0a1024">1/3</text>
          <text x="236" y="32" fontSize="13" fontWeight="700" textAnchor="middle" fill="#0a1024">2/3</text>
          <text x="156" y="58" fontSize="12" textAnchor="middle" fill={K.a}>organik</text>
          <text x="236" y="58" fontSize="12" textAnchor="middle" fill={K.b}>anorganik</text>
        </g>
      )}
    </Svg>
  );
}

/** Hujayra: devor + protoplast (s = hajm) + vakuola. */
function Cell({ cx, cy, w, h, s, med }: { cx: number; cy: number; w: number; h: number; s: number; med?: boolean }) {
  const pw = (w - 12) * s, ph = (h - 12) * s;
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="14" fill={med ? '#3a5a9b' : '#16384D'} stroke="#9fd6a8" strokeWidth="5" opacity="1" />
      <rect x={cx - w / 2 + 3} y={cy - h / 2 + 3} width={w - 6} height={h - 6} rx="12" fill={med ? '#2b4778' : '#0f2a3c'} />
      <g style={{ transformOrigin: `${cx}px ${cy}px`, transition: 'transform .9s ease' }}>
        <rect x={cx - pw / 2} y={cy - ph / 2} width={pw} height={ph} rx="12" fill="#6b3f7a" stroke="#d9a7e8" strokeWidth="2.5" style={{ transition: 'all .9s ease' }} />
        <rect x={cx - pw * 0.34} y={cy - ph * 0.3} width={pw * 0.68} height={ph * 0.6} rx="10" fill="#b07bff" opacity=".55" style={{ transition: 'all .9s ease' }} />
        <circle cx={cx + pw * 0.28} cy={cy - ph * 0.2} r={Math.max(3, 7 * s)} fill="#ffb84d" style={{ transition: 'all .9s ease' }} />
      </g>
    </g>
  );
}

/** Plazmoliz va deplazmoliz (i = bosqich 0..5). */
export function PlasmoScene({ i }: { i: number }) {
  if (i === 5) {
    return (
      <Svg>
        <Cell cx={72} cy={105} w={112} h={84} s={1} />
        <Cell cx={210} cy={105} w={112} h={84} s={0.55} med />
        <Cell cx={348} cy={105} w={112} h={84} s={0.98} />
        <Label x={72} y={170} t="Turgor" c={K.gr} />
        <Label x={210} y={170} t="Plazmoliz" c={K.r} />
        <Label x={348} y={170} t="Deplazmoliz" c={K.gr} />
        <path d="M130 105h18M268 105h18" stroke={K.m} strokeWidth="3" />
        <text x="210" y="205" fontSize="13" textAnchor="middle" fill={K.m}>qaytar jarayon</text>
      </Svg>
    );
  }
  const salty = i === 1 || i === 2;
  const s = [1, 1, 0.55, 0.55, 0.98][i];
  const label = ['Turgor holati', 'Tuz eritmasi qo‘shildi', 'Plazmoliz: suv chiqadi', 'Suv bilan yuvildi', 'Deplazmoliz: suv kiradi'][i];
  return (
    <Svg>
      <Cell cx={210} cy={105} w={250} h={160} s={s} med={salty} />
      {salty && Array.from({ length: 10 }, (_, k) => <circle key={k} cx={92 + k * 26} cy={k % 2 ? 30 : 192} r="3" fill="#cfd8ff" opacity=".8" />)}
      {i === 2 && <path d="M130 105h-44M290 105h44" stroke={K.b} strokeWidth="4" strokeLinecap="round" />}
      {i === 4 && <path d="M86 105h44M334 105h-44" stroke={K.b} strokeWidth="4" strokeLinecap="round" />}
      <Label x={210} y={222} t={label} c={i === 2 ? K.r : K.gr} />
    </Svg>
  );
}
