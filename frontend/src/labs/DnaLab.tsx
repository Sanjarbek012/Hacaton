import { useEffect, useMemo, useState, type ComponentType } from 'react';
import SaveBar from '../components/SaveBar';
import type { SimProps } from '../types';
import { K, Svg, rnd } from './common';

const COL: Record<string, string> = { A: K.r, T: K.a, U: K.v, G: K.gr, C: K.b };
const COMP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
const RNA: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };
const TABLE = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const AA3: Record<string, string> = { F: 'Fen', L: 'Ley', S: 'Ser', Y: 'Tir', C: 'Sis', W: 'Trp', P: 'Pro', H: 'Gis', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Tre', N: 'Asn', K: 'Lis', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gli' };
const IDX: Record<string, number> = { U: 0, T: 0, C: 1, A: 2, G: 3 };
const aaOf = (c: string) => TABLE[16 * IDX[c[0]] + 4 * IDX[c[1]] + IDX[c[2]]];
const gen = (n: number, seed: number) => Array.from({ length: n }, (_, i) => 'ATGC'[Math.floor(rnd(i, seed) * 4)]);
const codons = (seed: number) => {
  const out = ['AUG'];
  for (let i = 0; i < 5; i += 1) {
    let c = '';
    for (let tries = 0; tries < 20; tries += 1) {
      const k = Math.floor(rnd(i * 20 + tries, seed + 3) * 64);
      c = 'UCAG'[k >> 4] + 'UCAG'[(k >> 2) & 3] + 'UCAG'[k & 3];
      if (aaOf(c) !== '*') break;
    }
    out.push(c);
  }
  out.push(['UAA', 'UAG', 'UGA'][Math.floor(rnd(1, seed) * 3)]);
  return out;
};
const Base = ({ b, x, y }: { b: string; x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}><rect width="20" height="26" rx="4" fill={COL[b]} /><text x="10" y="18" fontSize="14" textAnchor="middle" fontWeight="700" fill="#0a1024">{b}</text></g>
);

/** mode: 'pair' = komplementarlik, 'rna' = transkripsiya, 'protein' = translyatsiya */
export function makeDnaLab(mode: 'pair' | 'rna' | 'protein'): ComponentType<SimProps> {
  return function DnaLab({ topicId, onSaved }: SimProps) {
    const [seed, setSeed] = useState(1);
    const [k, setK] = useState(0);
    const [auto, setAuto] = useState(false);
    const [wrong, setWrong] = useState(0);
    const [msg, setMsg] = useState('');
    const seq = useMemo(() => gen(12, seed), [seed]);
    const cod = useMemo(() => codons(seed), [seed]);
    const total = mode === 'protein' ? cod.length : seq.length;
    useEffect(() => {
      if (!auto || mode === 'pair') return;
      const h = window.setInterval(() => setK((x) => { if (x >= total) { setAuto(false); return x; } return x + 1; }), mode === 'rna' ? 500 : 1300);
      return () => window.clearInterval(h);
    }, [auto, total]);
    const fresh = () => { setSeed((s) => s + 1); setK(0); setWrong(0); setMsg(''); setAuto(false); };
    const done = k >= total;
    function pick(b: string) {
      if (done) return;
      if (b === COMP[seq[k]]) { setK(k + 1); setMsg(''); } else { setWrong((w) => w + 1); setMsg(`${b} bu yerga mos kelmaydi: ${seq[k]} ning juftini toping.`); }
    }
    const peptide = cod.slice(0, k).map(aaOf).filter((a) => a !== '*');

    return (
      <div className="lab">
        <div className="stage">
          {mode !== 'protein' ? (
            <Svg h={200}>
              <text x="20" y="24" fontSize="12" fill={K.m}>{mode === 'pair' ? 'DNK ning 1-zanjiri' : 'DNK (matritsa zanjiri)'}</text>
              {seq.map((b, i) => <Base key={i} b={b} x={20 + i * 32} y={34} />)}
              {seq.map((_, i) => (i < k ? <path key={i} d={`M${30 + i * 32} 62V${mode === 'pair' ? 96 : 100}`} stroke={K.m} strokeDasharray="3 3" /> : null))}
              <text x="20" y="128" fontSize="12" fill={K.m}>{mode === 'pair' ? '2-zanjir (komplementar)' : 'mRNK (transkripsiya natijasi)'}</text>
              {seq.slice(0, k).map((b, i) => <Base key={i} b={mode === 'pair' ? COMP[b] : RNA[b]} x={20 + i * 32} y={mode === 'pair' ? 96 : 100} />)}
              {mode === 'rna' && !done && <path d={`M${30 + k * 32} 30l0 -14m-6 8l6 -8l6 8`} stroke={K.g} strokeWidth="2.5" fill="none" />}
              {mode === 'rna' && !done && <text x={30 + k * 32} y="12" fontSize="11" textAnchor="middle" fill={K.g}>RNK-polimeraza</text>}
              <text x="20" y="180" fontSize="13">{mode === 'pair' ? 'A–T va G–C juftlari' : 'A → U, T → A, G → C, C → G'}</text>
            </Svg>
          ) : (
            <Svg h={240}>
              <text x="20" y="22" fontSize="12" fill={K.m}>mRNK kodonlari (ribosoma chapdan o‘ngga siljiydi)</text>
              {cod.map((c, i) => (
                <g key={i} transform={`translate(${12 + i * 56} 32)`} opacity={i < k ? 1 : 0.35}>
                  {c.split('').map((b, j) => <Base key={j} b={b} x={j * 17} y={0} />)}
                </g>
              ))}
              {k < total && <path d={`M${12 + k * 56 + 26} 30v-8m-5 5l5 -5l5 5`} stroke={K.g} strokeWidth="2.5" fill="none" />}
              {cod.slice(0, k).map((c, i) => (
                <g key={i}>
                  <text x={12 + i * 56 + 26} y="88" fontSize="11" textAnchor="middle" fill={K.m}>{c.split('').map((b) => ({ A: 'U', U: 'A', G: 'C', C: 'G' } as Record<string, string>)[b]).join('')}</text>
                  <circle cx={12 + i * 56 + 26} cy="125" r="22" fill={aaOf(c) === '*' ? K.r : K.b} />
                  <text x={12 + i * 56 + 26} y="129" fontSize="12" textAnchor="middle" fontWeight="700" fill="#0a1024">{aaOf(c) === '*' ? 'STOP' : AA3[aaOf(c)]}</text>
                </g>
              ))}
              <text x="20" y="190" fontSize="12" fill={K.m}>yuqorida: tRNK antikodoni, pastda: aminokislota</text>
              <text x="20" y="215" fontSize="13">peptid: {peptide.length ? peptide.map((a) => AA3[a]).join(' – ') : '—'}</text>
            </Svg>
          )}
        </div>
        <div className="panel">
          {mode === 'pair' && <>
            <p className="note">1-zanjirdagi har bir asosga mos juftni tanlang.</p>
            <div className="row">{['A', 'T', 'G', 'C'].map((b) => <button key={b} className="btn" disabled={done} onClick={() => pick(b)} style={{ borderColor: COL[b] }}>{b}</button>)}</div>
            {msg && <p className="error">{msg}</p>}
          </>}
          {mode === 'rna' && <>
            <p className="note">RNK-polimeraza DNK matritsasi bo‘ylab yurib, mRNK yig‘adi. DNK da timin (T) bor, RNK da uning o‘rniga uratsil (U).</p>
            <div className="row"><button className="btn primary" disabled={done} onClick={() => setK(k + 1)}>Keyingi nukleotid</button><button className="btn" disabled={done} onClick={() => setAuto((a) => !a)}>{auto ? 'To‘xtatish' : 'Avtomatik'}</button></div>
          </>}
          {mode === 'protein' && <>
            <p className="note">Ribosoma mRNK dagi har bir kodonni (3 nukleotid) o‘qiydi va unga mos aminokislotani qo‘shadi. AUG — start, UAA/UAG/UGA — stop kodon.</p>
            <div className="row"><button className="btn primary" disabled={done} onClick={() => setK(k + 1)}>Keyingi kodon</button><button className="btn" disabled={done} onClick={() => setAuto((a) => !a)}>{auto ? 'To‘xtatish' : 'Avtomatik'}</button></div>
          </>}
          <button className="btn" onClick={fresh}>Yangi ketma-ketlik</button>
          <dl className="readout"><dt>Bajarildi</dt><dd>{Math.min(k, total)} / {total}</dd>{mode === 'pair' && <><dt>Xatolar</dt><dd>{wrong}</dd></>}</dl>
        </div>
        <SaveBar topicId={topicId} canSave={done} hint="Ketma-ketlikni oxirigacha bajaring" onSaved={onSaved} data={mode === 'protein' ? { mRNK: cod.join(' '), Peptid: peptide.map((a) => AA3[a]).join('-') } : { 'DNK': seq.join(''), [mode === 'pair' ? 'Komplementar zanjir' : 'mRNK']: seq.map((b) => (mode === 'pair' ? COMP[b] : RNA[b])).join(''), Xatolar: wrong }} />
      </div>
    );
  };
}
