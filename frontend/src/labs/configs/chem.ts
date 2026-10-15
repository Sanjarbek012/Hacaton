import { K, num, range, sel, type Series } from '../common';
import type { FormulaDef } from '../FormulaLab';

const ser = (name: string, color: string, xs: number[], f: (x: number) => number): Series => ({ name, color, pts: xs.map((x) => [x, f(x)] as [number, number]) });
const NAMES: Record<number, string> = { [-0.76]: 'Zn', [-0.44]: 'Fe', 0.34: 'Cu', 0.8: 'Ag' };
const METALS: [string, number][] = [['Zn (−0,76 V)', -0.76], ['Fe (−0,44 V)', -0.44], ['Cu (+0,34 V)', 0.34], ['Ag (+0,80 V)', 0.8]];
const ELEC = [[63.5, 2], [108, 1], [65.4, 2], [27, 3]];

const SUBD = '₀₁₂₃₄₅₆₇₈₉';
const subs = (n: number) => String(n).replace(/\d/g, (d) => SUBD[Number(d)]);

/** 7-sinf: tanlanadigan elementlar. [belgi, nomi, lotincha nomi, Ar, turi] */
const ELEMS: Record<number, [string, string, string, number, string]> = {
  1: ['H', 'vodorod', 'hydrogenium', 1, 'metallmas'],
  6: ['C', 'uglerod', 'carboneum', 12, 'metallmas'],
  7: ['N', 'azot', 'nitrogenium', 14, 'metallmas'],
  8: ['O', 'kislorod', 'oxygenium', 16, 'metallmas'],
  11: ['Na', 'natriy', 'natrium', 23, 'metall'],
  12: ['Mg', 'magniy', 'magnesium', 24, 'metall'],
  13: ['Al', 'alyuminiy', 'aluminium', 27, 'metall'],
  15: ['P', 'fosfor', 'phosphorus', 31, 'metallmas'],
  16: ['S', 'oltingugurt', 'sulfur', 32, 'metallmas'],
  17: ['Cl', 'xlor', 'chlorum', 35.5, 'metallmas'],
  19: ['K', 'kaliy', 'kalium', 39, 'metall'],
  20: ['Ca', 'kalsiy', 'calcium', 40, 'metall'],
  26: ['Fe', 'temir', 'ferrum', 56, 'metall'],
  29: ['Cu', 'mis', 'cuprum', 64, 'metall'],
  30: ['Zn', 'rux', 'zincum', 65, 'metall'],
  47: ['Ag', 'kumush', 'argentum', 108, 'metall'],
  79: ['Au', 'oltin', 'aurum', 197, 'metall'],
};

/** 8-sinf: 1–18-elementlar. [belgi, nomi, guruh, davr, hisoblangan atom radiusi (pm), elektrmanfiylik (Pauling)] */
const PERIODIC: [string, string, string, number, number, number | null][] = [
  ['H', 'vodorod', 'IA', 1, 53, 2.2], ['He', 'geliy', 'VIIIA', 1, 31, null],
  ['Li', 'litiy', 'IA', 2, 167, 0.98], ['Be', 'berilliy', 'IIA', 2, 112, 1.57], ['B', 'bor', 'IIIA', 2, 87, 2.04], ['C', 'uglerod', 'IVA', 2, 67, 2.55],
  ['N', 'azot', 'VA', 2, 56, 3.04], ['O', 'kislorod', 'VIA', 2, 48, 3.44], ['F', 'ftor', 'VIIA', 2, 42, 3.98], ['Ne', 'neon', 'VIIIA', 2, 38, null],
  ['Na', 'natriy', 'IA', 3, 190, 0.93], ['Mg', 'magniy', 'IIA', 3, 145, 1.31], ['Al', 'alyuminiy', 'IIIA', 3, 118, 1.61], ['Si', 'kremniy', 'IVA', 3, 111, 1.9],
  ['P', 'fosfor', 'VA', 3, 98, 2.19], ['S', 'oltingugurt', 'VIA', 3, 88, 2.58], ['Cl', 'xlor', 'VIIA', 3, 79, 3.16], ['Ar', 'argon', 'VIIIA', 3, 71, null],
];
const ptype = (z: number) => ([3, 4, 11, 12, 13].includes(z) ? 'metall' : [5, 14].includes(z) ? 'yarim metall' : [2, 10, 18].includes(z) ? 'inert gaz' : 'metallmas');
const valence = (z: number) => (z <= 2 ? z : z <= 10 ? z - 2 : z - 10);

const ASYM = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const ANAME = ['vodorod', 'geliy', 'litiy', 'berilliy', 'bor', 'uglerod', 'azot', 'kislorod', 'ftor', 'neon', 'natriy', 'magniy', 'alyuminiy', 'kremniy', 'fosfor', 'oltingugurt', 'xlor', 'argon', 'kaliy', 'kalsiy'];
/** Elektron qobiqlari bo'yicha taqsimot: 2-8-8-... */
const shells = (e: number) => {
  const out: number[] = [];
  let left = e;
  for (const cap of [2, 8, 8, 18, 18]) {
    if (left <= 0) break;
    const k = Math.min(cap, left);
    out.push(k);
    left -= k;
  }
  return out.length ? out.join('-') : '0';
};

const ENOPT: [string, number][] = [['Na (0,93)', 0.93], ['K (0,82)', 0.82], ['Ca (1,00)', 1], ['Mg (1,31)', 1.31], ['Al (1,61)', 1.61], ['H (2,20)', 2.2], ['C (2,55)', 2.55], ['S (2,58)', 2.58], ['N (3,04)', 3.04], ['Cl (3,16)', 3.16], ['O (3,44)', 3.44], ['F (3,98)', 3.98]];
const ENSYM: Record<number, string> = { 0.93: 'Na', 0.82: 'K', 1: 'Ca', 1.31: 'Mg', 1.61: 'Al', 2.2: 'H', 2.55: 'C', 2.58: 'S', 3.04: 'N', 3.16: 'Cl', 3.44: 'O', 3.98: 'F' };
const isMetal = (en: number) => en < 1.7;
const bondType = (a: number, b: number) => (isMetal(a) && isMetal(b) ? 'metall bog‘lanish' : isMetal(a) !== isMetal(b) ? 'ionli bog‘lanish' : Math.abs(a - b) < 0.4 ? 'kovalent qutbsiz bog‘lanish' : 'kovalent qutbli bog‘lanish');

const ALK = ['metan', 'etan', 'propan', 'butan', 'pentan', 'geksan', 'geptan', 'oktan', 'nonan', 'dekan', 'undekan', 'dodekan', 'tridekan', 'tetradekan', 'pentadekan', 'geksadekan', 'geptadekan', 'oktadekan', 'nonadekan', 'eykozan'];
/** Normal alkanlarning qaynash harorati, °C (n = 1…20) */
const ALK_BP = [-161.5, -88.6, -42.1, -0.5, 36.1, 68.7, 98.4, 125.7, 150.8, 174.1, 195.9, 216.3, 235.4, 253.5, 270.6, 286.8, 302, 316.1, 329.9, 343];

export const CHEM: Record<string, FormulaDef> = {
  'c7-formula': {
    scene: 'bars',
    vars: [num('nC', 'C atomlari', '', 0, 12, 1, 6, 0), num('nH', 'H atomlari', '', 0, 24, 1, 12, 0), num('nO', 'O atomlari', '', 0, 12, 1, 6, 0)],
    outs: [
      { label: 'Nisbiy molekulyar massa Mr', fn: (v) => 12 * v.nC + v.nH + 16 * v.nO, d: 0, bar: { max: 360, color: K.b } },
      { label: 'Uglerod ulushi', unit: '%', fn: (v) => { const m = 12 * v.nC + v.nH + 16 * v.nO; return m ? (12 * v.nC / m) * 100 : 0; }, d: 1, bar: { max: 100, color: K.a } },
      { label: 'Vodorod ulushi', unit: '%', fn: (v) => { const m = 12 * v.nC + v.nH + 16 * v.nO; return m ? (v.nH / m) * 100 : 0; }, d: 1, bar: { max: 100, color: K.gr } },
      { label: 'Kislorod ulushi', unit: '%', fn: (v) => { const m = 12 * v.nC + v.nH + 16 * v.nO; return m ? (16 * v.nO / m) * 100 : 0; }, d: 1, bar: { max: 100, color: K.r } },
    ],
    note: 'Mr = Ar(C)·n + Ar(H)·n + Ar(O)·n. Glyukoza C₆H₁₂O₆ ni yasab ko‘ring (Mr = 180).',
  },
  'c7-solution': {
    scene: 'flask',
    vars: [num('m', 'Tuz massasi', 'g', 0, 80, 1, 20, 0), num('w', 'Suv hajmi', 'mL', 50, 200, 10, 100, 0), sel('sol', 'Modda (100 g suvda eruvchanligi)', [['Osh tuzi NaCl (36 g)', 36], ['Shakar (200 g)', 200], ['Selitra KNO₃ (32 g)', 32], ['Ohak Ca(OH)₂ (0,17 g)', 0.17]], 36)],
    outs: [
      { id: 'dis', label: 'Erigan modda', unit: 'g', fn: (v) => Math.min(v.m, (v.sol * v.w) / 100), d: 1 },
      { label: 'Erimay qolgan', unit: 'g', fn: (v) => Math.max(0, v.m - (v.sol * v.w) / 100), d: 1 },
      { label: 'Eritma konsentratsiyasi', unit: '%', fn: (v) => { const d = Math.min(v.m, (v.sol * v.w) / 100); return (d / (d + v.w)) * 100; }, d: 1 },
      { label: 'Holat', fn: (v) => (v.m > (v.sol * v.w) / 100 ? 'to‘yingan (cho‘kma bor)' : 'to‘yinmagan') },
      { id: 'lev', label: '', fn: (v) => 0.3 + v.w / 300, hidden: true },
      { id: 'int', label: '', fn: (v) => Math.min(1, Math.min(v.m, (v.sol * v.w) / 100) / 40), hidden: true },
      { id: 'und', label: '', fn: (v) => Math.min(1, Math.max(0, v.m - (v.sol * v.w) / 100) / 40), hidden: true },
    ],
    note: 'Eruvchanlik chegarasidan ortiq modda erimay, cho‘kmaga tushadi — eritma to‘yingan bo‘ladi.',
  },
  'c8-mole': {
    scene: 'bars',
    vars: [num('m', 'Massa', 'g', 1, 200, 1, 36, 0), sel('M', 'Modda (molyar massa)', [['Suv H₂O (18)', 18], ['CO₂ (44)', 44], ['NaCl (58,5)', 58.5], ['H₂SO₄ (98)', 98], ['Temir Fe (56)', 56]], 18)],
    outs: [
      { label: 'Modda miqdori n = m/M', unit: 'mol', fn: (v) => v.m / v.M, d: 2, bar: { max: 12, color: K.b } },
      { label: 'Zarrachalar soni', unit: '×10²³', fn: (v) => (v.m / v.M) * 6.022, d: 1, bar: { max: 70, color: K.a } },
    ],
    note: '1 mol moddada 6,02·10²³ ta zarracha bor (Avogadro soni).',
  },
  'c8-molvol': {
    scene: 'balloon',
    vars: [num('n', 'Modda miqdori', 'mol', 0.1, 3, 0.1, 1, 1), sel('M', 'Gaz', [['H₂ (2)', 2], ['N₂ (28)', 28], ['O₂ (32)', 32], ['CO₂ (44)', 44]], 32)],
    outs: [{ id: 'V', label: 'Hajm (n.sh.)', unit: 'L', fn: (v) => 22.4 * v.n, d: 1 }, { label: 'Massa', unit: 'g', fn: (v) => v.n * v.M, d: 1 }, { label: 'Molekulalar', unit: '×10²³', fn: (v) => v.n * 6.022, d: 2 }],
    note: 'Normal sharoitda har qanday gazning 1 moli 22,4 L hajm egallaydi (Avogadro qonuni).',
  },
  'c9-conduct': {
    scene: 'conduct',
    vars: [num('c', 'Konsentratsiya', 'mol/L', 0.05, 1, 0.05, 0.5, 2), sel('alpha', 'Modda', [['NaCl (kuchli elektrolit)', 1], ['Sirka kislota (kuchsiz)', 0.05], ['Shakar (noelektrolit)', 0], ['Distillangan suv', 0]], 1)],
    outs: [{ label: 'Ionlar konsentratsiyasi', unit: 'mol/L', fn: (v) => v.c * v.alpha, d: 3 }, { label: 'Lampa', fn: (v) => (v.c * v.alpha * 1.6 > 0.6 ? 'yorqin yonadi' : v.c * v.alpha * 1.6 > 0.05 ? 'xira yonadi' : 'yonmaydi') }],
    note: 'Eritma tokni ionlar orqali o‘tkazadi. Kuchli elektrolit to‘liq dissotsilanadi, shakar esa ionlarga ajralmaydi.',
  },
  'c9-equilibrium': {
    scene: 'equil',
    vars: [num('T', 'Temperatura', '°C', 0, 100, 1, 25, 0), num('P', 'Bosim', 'atm', 1, 5, 0.5, 1, 1)],
    outs: [
      { id: 'frac', label: 'NO₂ ulushi', unit: '%', fn: (v) => (1 / (1 + Math.exp(-((v.T - 50) / 18 - 0.6 * Math.log(v.P))))) , d: 2 },
    ],
    graph: { xl: 'T, °C', yl: 'NO₂ ulushi', series: (v) => [ser('2NO₂ ⇌ N₂O₄', K.a, range(0, 100, 25), (T) => 1 / (1 + Math.exp(-((T - 50) / 18 - 0.6 * Math.log(v.P)))))] },
    note: 'Le Shatelye prinsipi: isitilsa muvozanat endotermik tomonga (NO₂ ga), bosim oshsa gaz molekulalari kam tomonga (N₂O₄ ga) siljiydi. Model taxminiy.',
  },
  'c10-polymer': {
    scene: 'chain',
    vars: [num('n', 'Zvenolar soni n', '', 2, 24, 1, 8, 0), sel('Mm', 'Monomer', [['Etilen (28)', 28], ['Propilen (42)', 42], ['Vinilxlorid (62,5)', 62.5], ['Stirol (104)', 104]], 28)],
    outs: [{ label: 'Polimer molyar massasi', unit: 'g/mol', fn: (v) => v.n * v.Mm, d: 0 }],
    note: 'n·CH₂=CH₂ → (−CH₂−CH₂−)ₙ. Polimerlanish darajasi n qancha katta bo‘lsa, massa shuncha katta.',
  },
  'c7-element': {
    scene: 'bars',
    vars: [sel('z', 'Element', Object.entries(ELEMS).map(([z, e]) => [`${e[0]} — ${e[1]}`, Number(z)] as [string, number]), 8), num('n', 'Zarrachadagi atomlar soni', '', 1, 6, 1, 2, 0)],
    outs: [
      { label: 'Kimyoviy belgi', fn: (v) => ELEMS[v.z][0] },
      { label: 'Lotincha nomi', fn: (v) => ELEMS[v.z][2] },
      { label: 'Turi', fn: (v) => ELEMS[v.z][4] },
      { label: 'Nisbiy atom massa Ar', fn: (v) => ELEMS[v.z][3], d: 1, bar: { max: 200, color: K.b } },
      { label: 'Zarrachaning nisbiy massasi (n·Ar)', fn: (v) => ELEMS[v.z][3] * v.n, d: 1, bar: { max: 1200, color: K.a } },
    ],
    note: 'Belgi — elementning lotincha nomining bosh harfi yoki ikki harfi (Fe — ferrum, Cu — cuprum). n = 2 da O₂, H₂, N₂ molekulalarining massasini toping.',
  },
  'c8-periodic': {
    scene: 'bars',
    vars: [num('z', 'Tartib raqami Z', '', 1, 18, 1, 11, 0)],
    outs: [
      { label: 'Element', fn: (v) => `${PERIODIC[v.z - 1][0]} — ${PERIODIC[v.z - 1][1]}` },
      { label: 'Davr', fn: (v) => PERIODIC[v.z - 1][3], d: 0 },
      { label: 'Guruh', fn: (v) => PERIODIC[v.z - 1][2] },
      { label: 'Tashqi qavatdagi elektronlar', fn: (v) => valence(v.z), d: 0 },
      { label: 'Turi', fn: (v) => ptype(v.z) },
      { label: 'Atom radiusi', unit: 'pm', fn: (v) => PERIODIC[v.z - 1][4], d: 0, bar: { max: 200, color: K.b } },
      { label: 'Elektrmanfiylik', fn: (v) => PERIODIC[v.z - 1][5] ?? 'aniqlanmagan', d: 2, bar: { max: 4, color: K.a } },
    ],
    graph: {
      xl: 'Z',
      yl: 'nisbiy qiymat',
      series: (v) => [
        { name: 'atom radiusi', color: K.b, pts: PERIODIC.map((e, i) => [i + 1, e[4] / 200] as [number, number]) },
        { name: 'elektrmanfiylik', color: K.a, pts: PERIODIC.flatMap((e, i) => (e[5] === null ? [] : [[i + 1, e[5] / 4] as [number, number]])) },
        { name: 'tanlangan Z', color: K.gr, pts: [[v.z, 0], [v.z, 1]] },
      ],
    },
    note: 'Davr bo‘ylab chapdan o‘ngga atom radiusi kamayadi, elektrmanfiylik ortadi; har bir yangi davr ishqoriy metalldan (radiusi eng katta) boshlanadi. Radius va elektrmanfiylik grafikda 0–1 oralig‘iga keltirilgan; inert gazlarning elektrmanfiyligi aniqlanmagan.',
  },
  'c8-atomstruct': {
    scene: 'bars',
    vars: [num('z', 'Protonlar soni Z', '', 1, 20, 1, 11, 0), num('N', 'Neytronlar soni N', '', 0, 25, 1, 12, 0), num('chg', 'Zaryad (0 = neytral atom)', '', -3, 3, 1, 0, 0)],
    outs: [
      { label: 'Zarra', fn: (v) => `${ASYM[v.z - 1]}-${v.z + v.N} (${ANAME[v.z - 1]})` },
      { label: 'Massa soni A = Z + N', fn: (v) => v.z + v.N, d: 0 },
      { label: 'Protonlar', fn: (v) => v.z, d: 0, bar: { max: 25, color: K.r } },
      { label: 'Neytronlar', fn: (v) => v.N, d: 0, bar: { max: 25, color: K.b } },
      { label: 'Elektronlar', fn: (v) => Math.max(0, v.z - Math.min(v.chg, v.z)), d: 0, bar: { max: 25, color: K.gr } },
      { label: 'Elektron qobiqlari', fn: (v) => shells(Math.max(0, v.z - Math.min(v.chg, v.z))) },
      { label: 'Zarra turi', fn: (v) => { const c = Math.min(v.chg, v.z); return c === 0 ? 'neytral atom' : c > 0 ? `kation (${c}+)` : `anion (${-c}−)`; } },
    ],
    note: 'Elementni protonlar soni (Z) belgilaydi. Neytral atomda elektronlar soni protonlarga teng. Neytronlar soni o‘zgarsa izotop, elektronlar soni o‘zgarsa ion hosil bo‘ladi. Natriyda (Z = 11) zaryadni +1 qilib, qobiqlar qanday o‘zgarishini kuzating.',
  },
  'c8-bond': {
    scene: 'bars',
    vars: [sel('a', '1-atom (elektrmanfiyligi)', ENOPT, 0.93), sel('b', '2-atom (elektrmanfiyligi)', ENOPT, 3.16)],
    outs: [
      { label: 'Elektrmanfiylik farqi ΔEN', fn: (v) => Math.abs(v.a - v.b), d: 2, bar: { max: 3.2, color: K.a } },
      { label: 'Ionlilik darajasi (taxminiy)', unit: '%', fn: (v) => (1 - Math.exp(-((v.a - v.b) ** 2) / 4)) * 100, d: 0, bar: { max: 100, color: K.r } },
      { label: 'Bog‘lanish turi', fn: (v) => bondType(v.a, v.b) },
      {
        label: 'Elektronlar',
        fn: (v) => {
          const t = bondType(v.a, v.b);
          const big = ENSYM[Math.max(v.a, v.b)];
          return t === 'metall bog‘lanish' ? 'umumlashgan (erkin) elektronlar' : t === 'ionli bog‘lanish' ? `elektron ${big} atomiga to‘liq o‘tadi, ionlar hosil bo‘ladi` : t === 'kovalent qutbsiz bog‘lanish' ? 'umumiy elektron juft o‘rtada turadi' : `umumiy elektron juft ${big} tomonga siljigan`;
        },
      },
    ],
    note: 'Maktab qoidasi: metall + metallmas — ionli; metallmas + metallmas — kovalent (bir xil atomlar qutbsiz, turli atomlar qutbli); metall + metall — metall bog‘lanish. ΔEN va ionlilik darajasi bog‘lanishlar orasida o‘tish holatlari borligini ko‘rsatadi. Model taxminiy.',
  },
  'c10-alkane': {
    scene: 'chain',
    vars: [num('n', 'Uglerod atomlari soni n', '', 1, 20, 1, 5, 0)],
    outs: [
      { label: 'Molekulyar formula', fn: (v) => (v.n === 1 ? 'CH₄' : `C${subs(v.n)}H${subs(2 * v.n + 2)}`) },
      { label: 'Nomi', fn: (v) => ALK[v.n - 1] },
      { label: 'Nisbiy molekulyar massa Mr', fn: (v) => 14 * v.n + 2, d: 0 },
      { label: 'Qaynash harorati', unit: '°C', fn: (v) => ALK_BP[v.n - 1], d: 0 },
      { label: 'Holat (25 °C)', fn: (v) => (v.n <= 4 ? 'gaz' : v.n <= 17 ? 'suyuq' : 'qattiq') },
      { label: 'Yonishda O₂ koeffitsienti', fn: (v) => (3 * v.n + 1) / 2, d: 1 },
      { label: 'Yonish mahsulotlari', fn: (v) => `${v.n} CO₂ + ${v.n + 1} H₂O` },
    ],
    graph: {
      xl: 'n (C atomlari)',
      yl: 'qaynash t, °C',
      series: (v) => [
        { name: 'normal alkanlar', color: K.a, pts: ALK_BP.map((t, i) => [i + 1, t] as [number, number]) },
        { name: 'tanlangan', color: K.gr, pts: [[v.n, -170], [v.n, ALK_BP[v.n - 1]]] },
      ],
    },
    note: 'CₙH₂ₙ₊₂: har bir keyingi alkan CH₂ guruhiga farq qiladi (gomologik qator). Zanjir uzaygan sari molekulalararo kuchlar ortadi va qaynash harorati ko‘tariladi: dastlabki to‘rttasi gaz, uzunlari qattiq moddalar.',
  },
  'c11-thermochem': {
    scene: 'ediagram',
    vars: [num('Ea', 'Aktivlanish energiyasi', 'kJ', 20, 200, 10, 80, 0), num('dH', 'Reaksiya issiqligi ΔH', 'kJ', -200, 150, 10, -90, 0)],
    outs: [{ label: 'Teskari reaksiya Ea', unit: 'kJ', fn: (v) => v.Ea - v.dH, d: 0 }, { label: 'Reaksiya turi', fn: (v) => (v.dH < 0 ? 'ekzotermik (issiqlik ajraladi)' : v.dH > 0 ? 'endotermik (issiqlik yutiladi)' : 'issiqlik effekti yo‘q') }],
    note: 'ΔH < 0 — mahsulotlar energiyasi past, issiqlik ajraladi. Ea — reaksiya boshlanishi uchun to‘siq.',
  },
  'c11-molarity': {
    scene: 'flask',
    vars: [num('c1', 'Boshlang‘ich konsentratsiya', 'mol/L', 0.5, 10, 0.5, 6, 1), num('V1', 'Boshlang‘ich hajm', 'mL', 10, 200, 10, 50, 0), num('V2', 'Yakuniy hajm', 'mL', 50, 500, 10, 250, 0)],
    outs: [
      { label: 'Yangi konsentratsiya', unit: 'mol/L', fn: (v) => (v.c1 * v.V1) / v.V2, d: 2 },
      { label: 'Qo‘shiladigan suv', unit: 'mL', fn: (v) => Math.max(0, v.V2 - v.V1), d: 0 },
      { label: 'Erigan modda', unit: 'mmol', fn: (v) => v.c1 * v.V1, d: 0 },
      { id: 'lev', label: '', fn: (v) => 0.2 + v.V2 / 640, hidden: true },
      { id: 'int', label: '', fn: (v) => Math.min(1, ((v.c1 * v.V1) / v.V2) / 10 * 2), hidden: true },
    ],
    note: 'Suyultirganda modda miqdori o‘zgarmaydi: c₁V₁ = c₂V₂. Rang kuchsizlanadi.',
  },
  'c11-ph': {
    scene: 'phstrip',
    vars: [sel('type', 'Modda turi', [['Kuchli kislota', 0], ['Kuchsiz kislota (Ka = 1,8·10⁻⁵)', 1], ['Kuchli asos', 2], ['Kuchsiz asos (Kb = 1,8·10⁻⁵)', 3]], 0), num('cexp', 'Konsentratsiya lg c', '', -6, 0, 0.5, -2, 1)],
    outs: [
      { id: 'pH', label: 'pH', fn: (v) => (v.type === 0 ? -v.cexp : v.type === 1 ? 0.5 * (4.74 - v.cexp) : v.type === 2 ? 14 + v.cexp : 14 - 0.5 * (4.74 - v.cexp)), d: 2 },
      { label: 'Muhit', fn: (v) => { const p = v.type === 0 ? -v.cexp : v.type === 1 ? 0.5 * (4.74 - v.cexp) : v.type === 2 ? 14 + v.cexp : 14 - 0.5 * (4.74 - v.cexp); return p < 6.5 ? 'kislotali' : p > 7.5 ? 'ishqoriy' : 'neytral'; } },
    ],
    note: 'pH = −lg[H⁺]. Kuchsiz kislota/asos to‘liq dissotsilanmagani uchun pH neytralga yaqinroq bo‘ladi.',
  },
  'c11-electrolysis': {
    scene: 'electrolysis',
    vars: [num('I', 'Tok kuchi', 'A', 0.5, 5, 0.5, 2, 1), num('t', 'Vaqt', 'daqiqa', 1, 60, 1, 20, 0), sel('mt', 'Metall', [['Mis (Cu²⁺)', 0], ['Kumush (Ag⁺)', 1], ['Rux (Zn²⁺)', 2], ['Alyuminiy (Al³⁺)', 3]], 0)],
    outs: [
      { label: 'Zaryad', unit: 'C', fn: (v) => v.I * v.t * 60, d: 0 },
      { id: 'm', label: 'Katodda ajralgan metall', unit: 'g', fn: (v) => (ELEC[v.mt][0] * v.I * v.t * 60) / (ELEC[v.mt][1] * 96485), d: 2 },
      { id: 'mf', label: '', fn: (v) => Math.min(1, ((ELEC[v.mt][0] * v.I * v.t * 60) / (ELEC[v.mt][1] * 96485)) / 4), hidden: true },
    ],
    note: 'Faradey qonuni: m = M·I·t / (z·F). Tok va vaqt ortsa, ajralgan modda ko‘payadi.',
  },
  'c11-galvanic': {
    scene: 'galvanic',
    vars: [sel('e1', '1-elektrod', METALS, -0.76), sel('e2', '2-elektrod', METALS, 0.34)],
    outs: [
      { label: 'Galvanik element kuchlanishi', unit: 'V', fn: (v) => Math.abs(v.e1 - v.e2), d: 2 },
      { label: 'Anod (oksidlanadi)', fn: (v) => (v.e1 === v.e2 ? '—' : NAMES[Math.min(v.e1, v.e2)]) },
      { label: 'Katod (qaytariladi)', fn: (v) => (v.e1 === v.e2 ? '—' : NAMES[Math.max(v.e1, v.e2)]) },
    ],
    note: 'E = E°(katod) − E°(anod). Metallar aktivligi qatorida bir-biridan uzoq metallar katta kuchlanish beradi.',
  },
  'c11-corrosion': {
    scene: 'rust',
    vars: [sel('k', 'Sharoit', [['Quruq havo', 0.02], ['Distillangan suv', 0.3], ['Tuzli suv', 1], ['Moy bilan qoplangan', 0.005], ['Rux bilan qoplangan', 0.01]], 0.3), num('days', 'Vaqt', 'kun', 1, 30, 1, 10, 0)],
    outs: [{ id: 'rust', label: 'Zang bosishi', unit: '%', fn: (v) => 100 * (1 - Math.exp(-v.k * 0.15 * v.days)), d: 0 }],
    graph: { xl: 'kun', yl: 'zang, %', series: (v) => [ser('zang bosishi', K.r, range(1, 30, 29), (d) => 100 * (1 - Math.exp(-v.k * 0.15 * d)))] },
    note: 'Temir zanglashi uchun suv va kislorod kerak; tuz jarayonni tezlashtiradi. Himoya qoplamalari uni sekinlashtiradi.',
  },
  'c11-catalyst': {
    scene: 'bars',
    vars: [num('ea', 'Aktivlanish energiyasi Ea', 'kJ/mol', 40, 120, 5, 90, 0), num('dE', 'Katalizator Ea ni kamaytirishi', 'kJ/mol', 0, 40, 5, 0, 0), num('T', 'Harorat', '°C', 20, 100, 5, 25, 0)],
    outs: [
      { label: 'Ea katalizatorsiz', unit: 'kJ/mol', fn: (v) => v.ea, d: 0, bar: { max: 120, color: K.r } },
      { label: 'Ea katalizator bilan', unit: 'kJ/mol', fn: (v) => v.ea - v.dE, d: 0, bar: { max: 120, color: K.gr } },
      { label: 'Tezlik necha marta ortadi', fn: (v) => { const r = Math.exp((v.dE * 1000) / (8.314 * (v.T + 273.15))); return r < 1000 ? `${Math.round(r * 10) / 10} marta` : `~${r.toExponential(1).replace('e+', ' · 10^')} marta`; } },
    ],
    graph: {
      xl: 'reaksiya yo‘li',
      yl: 'energiya, kJ/mol',
      series: (v) => {
        const prof = (ea: number) => (x: number) => -50 / (1 + Math.exp(-12 * (x - 0.5))) + (ea + 11.5) * Math.exp(-(((x - 0.4) / 0.18) ** 2));
        const xs = range(0, 1, 50);
        return [ser('katalizatorsiz', K.r, xs, prof(v.ea)), ser('katalizator bilan', K.gr, xs, prof(v.ea - v.dE))];
      },
    },
    note: 'Katalizator reaksiya yo‘lini o‘zgartirib, Ea ni kamaytiradi. Mahsulotlar energiyasi o‘zgarmaydi, reaksiya tezlashadi, katalizator sarflanmaydi.',
  },
};
