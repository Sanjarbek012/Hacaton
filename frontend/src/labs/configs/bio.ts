import { K, bell, num, range, rnd, sel, type Series, type V } from '../common';
import type { FormulaDef } from '../FormulaLab';
import { selFreq } from '../scenes';

const ser = (name: string, color: string, xs: number[], f: (x: number) => number): Series => ({ name, color, pts: xs.map((x) => [x, f(x)] as [number, number]) });
const gauss = (x: number, mu: number, sd: number) => Math.exp(-0.5 * ((x - mu) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));

const moths: FormulaDef = {
  scene: 'moths',
  vars: [num('p0', 'Qora shakl boshlang‘ich ulushi', '', 0.05, 0.95, 0.05, 0.1, 2), num('s', 'Tanlanish kuchi', '', 0.05, 0.5, 0.05, 0.2, 2), sel('env', 'Muhit', [['Och rangli daraxt po‘stlog‘i', 0], ['Kuyindili qora po‘stloq (sanoat)', 1]], 1)],
  outs: [{ label: '30 avloddan keyin qora shakl', unit: '%', fn: (v) => selFreq(v.p0, v.s, v.env, 30) * 100, d: 0 }],
  graph: { xl: 'avlod', yl: 'qora shakl ulushi', series: (v) => [ser('qora shakl', K.a, range(0, 30, 30), (g) => selFreq(v.p0, v.s, v.env, Math.round(g)))], anim: true },
  note: 'Tabiiy tanlanish: muhitda yaxshi yashirinadigan shakl ko‘proq omon qoladi va ko‘payadi.',
};
const ferment: FormulaDef = {
  scene: 'flask',
  vars: [num('T', 'Temperatura', '°C', 20, 50, 1, 30, 0), num('pH', 'pH', '', 3, 8, 0.5, 5.5, 1), num('glc', 'Glyukoza', 'g/L', 1, 20, 1, 10, 0)],
  outs: [
    { id: 'y', label: 'Mahsulot unumi', unit: 'g/L', fn: (v) => v.glc * 0.45 * bell(v.T, 32, 7) * bell(v.pH, 5.5, 1.6), d: 2 },
    { id: 'lev', label: '', fn: () => 0.65, hidden: true },
    { id: 'int', label: '', fn: (v) => Math.min(1, (v.glc * 0.45 * bell(v.T, 32, 7) * bell(v.pH, 5.5, 1.6)) / 5), hidden: true },
  ],
  note: 'Mikroorganizmlar uchun optimal harorat va pH bor; ulardan chetlashsa unum keskin kamayadi.',
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** Butun sonlar nisbatini qisqartirib "9 : 3 : 3 : 1" ko'rinishida beradi */
const ratio = (xs: number[]) => {
  const g = xs.reduce((a, b) => gcd(a, b), 0) || 1;
  return xs.map((x) => x / g).join(' : ');
};

/** Havoning suv bug'i yetishmovchiligi, kPa (to'yingan bug' bosimi — Tetens formulasi) */
const vpd = (T: number, hum: number) => 0.6108 * Math.exp((17.27 * T) / (T + 237.3)) * (1 - hum / 100);
/** Barg yo'qotadigan suv, mg/soat (taxminiy model) */
const leafLoss = (v: V) => 2.5 * v.area * v.stoma * vpd(v.T, v.hum);

/** Infuzoriyalar: logistik o'sish. r — o'sish tezligi (1/soat), cap — muhit sig'imi (1 mL da) */
const protR = (T: number) => 0.08 * bell(T, 25, 8);
const protN = (v: V, t: number) => {
  const cap = 15 * v.food;
  return cap / (1 + ((cap - v.N0) / v.N0) * Math.exp(-protR(v.T) * t));
};

/** Baliqning o'rtacha zichligi (to'qima ≈ 1060 kg/m³, suzgich pufagi gazi hisobga olingan) */
const fishRho = (f: number) => 1060 * (1 - f / 100);

/** Buyrak: suv balansi (L/kun) va siydik konsentratsiyasi (mOsm/L) */
const kid = (v: V) => {
  const inn = v.drink + 1.3; // ichilgan suv + ovqat va metabolizm suvi
  const other = 1 + 0.1 * Math.max(0, v.T - 20); // teri, nafas, najas va ter orqali
  const load = 600 + 34 * v.salt; // siydik bilan chiqadigan erigan moddalar, mOsm/kun
  const urine = Math.max(inn - other, load / 1200); // buyrak siydikni ~1200 mOsm/L gacha quyultira oladi
  return { inn, other, urine, conc: load / urine, bal: inn - other - urine };
};

const GA: [string, number][] = [['AA', 2], ['Aa', 1], ['aa', 0]];
const GB: [string, number][] = [['BB', 2], ['Bb', 1], ['bb', 0]];
/** Bir belgili chatishtirish: AA, Aa, aa ehtimolliklari. p1, p2 — ota-onadagi dominant allellar soni (0..2) */
const mend = (v: V) => {
  const pa = v.p1 / 2;
  const pb = v.p2 / 2;
  const AA = pa * pb;
  const aa = (1 - pa) * (1 - pb);
  return { AA, Aa: 1 - AA - aa, aa };
};
/** Ikki belgili chatishtirish: A_B_, A_bb, aaB_, aabb ehtimolliklari */
const dih = (v: V) => {
  const pA = 1 - (1 - v.a1 / 2) * (1 - v.a2 / 2);
  const pB = 1 - (1 - v.b1 / 2) * (1 - v.b2 / 2);
  return [pA * pB, pA * (1 - pB), (1 - pA) * pB, (1 - pA) * (1 - pB)];
};

export const BIO: Record<string, FormulaDef> = {
  'b5-microscope': {
    scene: 'microscope',
    vars: [sel('mag', 'Kattalashtirish', [['×40', 40], ['×100', 100], ['×400', 400]], 100)],
    outs: [{ label: 'Ko‘rish maydoni', unit: 'mm', fn: (v) => 180 / v.mag, d: 2 }, { label: 'Ko‘rinadigan hujayralar (50 μm)', fn: (v) => Math.max(1, Math.round((180 / v.mag) * 1000 / 50)) }],
    note: 'Kattalashtirish oshgani sayin ko‘rish maydoni kichrayadi, lekin tafsilotlar ko‘proq ko‘rinadi.',
  },
  'b5-bacteria': {
    scene: 'colony',
    vars: [num('T', 'Temperatura', '°C', 5, 45, 1, 37, 0)],
    outs: [
      { id: 'g', label: 'Ikkilanish vaqti', unit: 'daq', fn: (v) => 20 / Math.max(0.05, bell(v.T, 37, 10)), d: 0 },
      { id: 'N', label: '3 soatdan keyin (1 ta bakteriyadan)', fn: (v) => 2 ** (180 / (20 / Math.max(0.05, bell(v.T, 37, 10)))), d: 0 },
    ],
    graph: { xl: 'vaqt, daq', yl: 'bakteriyalar soni', series: (v) => [ser('N(t)', K.a, range(0, 180, 30), (t) => 2 ** (t / (20 / Math.max(0.05, bell(v.T, 37, 10)))))] },
    note: 'Bakteriyalar ikkiga bo‘linib eksponensial ko‘payadi. Eng tez o‘sish tana haroratiga yaqin sharoitda.',
  },
  'b5-fungi': {
    scene: 'yeast',
    vars: [num('T', 'Temperatura', '°C', 5, 70, 1, 35, 0), num('sugar', 'Shakar', 'g', 0, 20, 1, 10, 0)],
    outs: [{ id: 'rate', label: '', fn: (v) => (v.sugar / 20) * 10 * bell(v.T, 38, 14), hidden: true }, { label: 'CO₂ ajralish tezligi', unit: 'mL/daq', fn: (v) => (v.sugar / 20) * 20 * bell(v.T, 38, 14), d: 1 }],
    note: 'Achitqi shakarni bijg‘itib CO₂ chiqaradi. Iliq joyda tez, juda issiqda esa hujayralar nobud bo‘ladi.',
  },
  'b6-root': {
    scene: 'xylem',
    vars: [num('light', 'Yorug‘lik', '%', 0, 100, 5, 60, 0), num('hum', 'Havo namligi', '%', 10, 100, 5, 50, 0)],
    outs: [{ id: 'rate', label: 'Suv ko‘tarilish tezligi', unit: '%', fn: (v) => Math.max(5, Math.min(100, v.light * 0.6 + (100 - v.hum) * 0.4)), d: 0 }],
    note: 'Yorug‘lik va quruq havoda barglar ko‘p suv bug‘latadi, ildizdan suv tezroq ko‘tariladi.',
  },
  'b6-seed': {
    scene: 'seed',
    vars: [num('water', 'Namlik', '%', 0, 100, 5, 60, 0), num('temp', 'Harorat', '°C', 0, 40, 1, 22, 0), num('air', 'Havo (kislorod)', '%', 0, 100, 5, 80, 0)],
    outs: [{ id: 'germ', label: 'Unib chiqish', unit: '%', fn: (v) => 100 * bell(v.water, 60, 35) * bell(v.temp, 24, 10) * Math.min(1, v.air / 60), d: 0 }],
    note: 'Urug‘ unib chiqishi uchun namlik, iliqlik va havo kerak. Bittasi yetishmasa, unish susayadi.',
  },
  'b7-evolution': moths,
  'b8-heart': {
    scene: 'heart',
    vars: [num('pulse', 'Puls', 'urish/daq', 40, 180, 5, 70, 0), num('sv', 'Bir urishda haydaladigan qon', 'mL', 40, 100, 5, 70, 0)],
    outs: [{ label: 'Yurak daqiqalik hajmi', unit: 'L/daq', fn: (v) => (v.pulse * v.sv) / 1000, d: 2 }, { label: 'Bir sikl davomiyligi', unit: 's', fn: (v) => 60 / v.pulse, d: 2 }],
    note: 'Jismoniy zo‘riqishda puls va qon hajmi ortadi, to‘qimalarga kislorod ko‘proq yetkaziladi.',
  },
  'b8-lungs': {
    scene: 'lungs',
    vars: [num('rate', 'Nafas olish tezligi', 'marta/daq', 8, 40, 1, 16, 0), num('tidal', 'Bir nafas hajmi', 'mL', 300, 1000, 50, 500, 0)],
    outs: [{ label: 'Daqiqalik ventilyatsiya', unit: 'L/daq', fn: (v) => (v.rate * v.tidal) / 1000, d: 1 }],
    note: 'O‘pka ventilyatsiyasi = nafas soni × nafas hajmi. Yugurganda ikkalasi ham ortadi.',
  },
  'b8-enzyme': {
    scene: 'enzyme',
    vars: [sel('enz', 'Ferment', [['Amilaza (pH 7)', 7], ['Pepsin (pH 2)', 2], ['Tripsin (pH 8)', 8]], 7), num('T', 'Temperatura', '°C', 0, 80, 1, 37, 0), num('pH', 'pH', '', 1, 13, 0.5, 7, 1)],
    outs: [{ id: 'act', label: 'Ferment faolligi', unit: '%', fn: (v) => 100 * bell(v.T, 37, 14) * bell(v.pH, v.enz, 1.6), d: 0 }],
    graph: { xl: 'T, °C', yl: 'faollik, %', series: (v) => [ser('faollik', K.gr, range(0, 80, 40), (T) => 100 * bell(T, 37, 14) * bell(v.pH, v.enz, 1.6))] },
    note: 'Fermentlar optimal harorat va pH da eng faol; yuqori haroratda oqsil tuzilishi buziladi.',
  },
  'b8-eye': {
    scene: 'eye',
    vars: [num('light', 'Yorug‘lik', '%', 0, 100, 5, 50, 0)],
    outs: [{ label: 'Qorachiq diametri', unit: 'mm', fn: (v) => (8 + (1 - v.light / 100) * 36) / 6.4, d: 1 }],
    note: 'Yorug‘lik kuchli bo‘lsa qorachiq torayadi, qorong‘uda kengayadi — ko‘zni himoya qiluvchi refleks.',
  },
  'b8-glucose': {
    scene: 'none',
    vars: [num('sens', 'Insulin ta’siri', '', 0.2, 2, 0.1, 1, 1), num('meal', 'Iste’mol qilingan uglevod', 'g', 20, 120, 5, 60, 0)],
    outs: [{ label: 'Eng yuqori qand miqdori', unit: 'mmol/L', fn: (v) => 5 + (0.06 * v.meal) / v.sens, d: 1 }, { label: 'Holat', fn: (v) => (5 + (0.06 * v.meal) / v.sens > 7.8 ? 'me’yordan yuqori' : 'me’yorda') }],
    graph: { xl: 'vaqt, daq', yl: 'qon shakari, mmol/L', series: (v) => [ser('glyukoza', K.a, range(0, 240, 48), (t) => 5 + ((0.06 * v.meal) / v.sens) * (t / 40) * Math.exp(1 - t / 40))], anim: true },
    note: 'Ovqatdan keyin qand ko‘tariladi, insulin uni me’yorga qaytaradi. Insulin ta’siri kuchsiz bo‘lsa, qand uzoq baland turadi.',
  },
  'b9-variation': {
    scene: 'none',
    vars: [num('mut', 'Mutatsiya darajasi', '', 0, 0.5, 0.05, 0.1, 2), num('sel', 'Tanlanish kuchi', '', 0, 1, 0.05, 0.3, 2), num('gens', 'Avlodlar soni', '', 1, 50, 1, 20, 0)],
    outs: [{ label: 'O‘rtacha qiymat siljishi', fn: (v) => (1.5 * v.sel * (1 - Math.exp(-v.gens / 15))).toFixed(2) }, { label: 'O‘zgaruvchanlik (σ)', fn: (v) => (1 + v.mut * 2).toFixed(2) }],
    graph: { xl: 'belgi qiymati', yl: 'zichlik', series: (v) => [ser('boshida', K.m, range(-4, 6, 50), (x) => gauss(x, 0, 1)), ser('keyin', K.gr, range(-4, 6, 50), (x) => gauss(x, 1.5 * v.sel * (1 - Math.exp(-v.gens / 15)), 1 + v.mut * 2))] },
    note: 'Mutatsiyalar o‘zgaruvchanlikni oshiradi, tanlanish esa o‘rtacha qiymatni foydali tomonga siljitadi.',
  },
  'b10-selection': moths,
  'b10-speciation': {
    scene: 'split',
    vars: [num('mig', 'Populyatsiyalar aralashuvi', '', 0, 0.5, 0.05, 0.05, 2), num('sel', 'Muhitlar farqi kuchi', '', 0.1, 1, 0.1, 0.5, 1)],
    outs: [{ id: 'delta', label: 'Farq (60-avlod)', fn: (v) => { let a = 0, b = 0; for (let i = 0; i < 60; i += 1) { const na = a + v.sel * 0.1 * (1 - a) - v.mig * (a - b); const nb = b + v.sel * 0.1 * (-1 - b) - v.mig * (b - a); a = na; b = nb; } return (a - b) / 2; }, d: 2 }],
    graph: { xl: 'avlod', yl: 'belgi qiymati', series: (v) => { let a = 0, b = 0; const A: [number, number][] = [[0, 0]], B: [number, number][] = [[0, 0]]; for (let i = 1; i <= 60; i += 1) { const na = a + v.sel * 0.1 * (1 - a) - v.mig * (a - b); const nb = b + v.sel * 0.1 * (-1 - b) - v.mig * (b - a); a = na; b = nb; A.push([i, a]); B.push([i, b]); } return [{ name: '1-populyatsiya', color: K.b, pts: A }, { name: '2-populyatsiya', color: K.a, pts: B }]; }, anim: true },
    note: 'Turlanish: populyatsiyalar ajralib, turli muhitga moslashsa, orasidagi farq ortadi. Aralashuv (migratsiya) farqni kamaytiradi.',
  },
  'b10-popgen': {
    scene: 'none',
    vars: [num('N', 'Populyatsiya kattaligi', '', 10, 500, 10, 50, 0), num('p0', 'Boshlang‘ich allel chastotasi', '', 0.1, 0.9, 0.1, 0.5, 1), num('seed', 'Tajriba raqami', '', 1, 20, 1, 1, 0)],
    outs: [{ label: 'Allel yo‘qolgan yoki mustahkamlangan', fn: (v) => { let c = 0; for (let k = 0; k < 5; k += 1) { let p = v.p0; for (let g = 0; g < 100; g += 1) { const z = Array.from({ length: 6 }, (_, j) => rnd(g * 7 + j, v.seed * 13 + k)).reduce((a, b) => a + b, 0) - 3; p = Math.min(1, Math.max(0, p + z * 1.4 * Math.sqrt((p * (1 - p)) / (2 * v.N)))); } if (p <= 0.001 || p >= 0.999) c += 1; } return `${c} / 5 populyatsiya`; } }],
    graph: { xl: 'avlod', yl: 'allel chastotasi', series: (v) => [0, 1, 2, 3, 4].map((k) => { let p = v.p0; const pts: [number, number][] = [[0, p]]; for (let g = 1; g <= 100; g += 1) { const z = Array.from({ length: 6 }, (_, j) => rnd(g * 7 + j, v.seed * 13 + k)).reduce((a, b) => a + b, 0) - 3; p = Math.min(1, Math.max(0, p + z * 1.4 * Math.sqrt((p * (1 - p)) / (2 * v.N)))); pts.push([g, p]); } return { name: `pop. ${k + 1}`, color: [K.b, K.a, K.gr, K.r, K.v][k], pts }; }), anim: true },
    note: 'Genetik dreyf: kichik populyatsiyalarda allel chastotasi tasodifan o‘zgaradi, allel yo‘qolishi yoki mustahkamlanishi mumkin.',
  },
  'b10-breeding': {
    scene: 'none',
    vars: [num('h2', 'Irsiylanish darajasi h²', '', 0.1, 1, 0.05, 0.4, 2), num('S', 'Tanlash farqi', '', 0.1, 3, 0.1, 1, 1), num('gens', 'Avlodlar', '', 1, 30, 1, 10, 0)],
    outs: [{ label: 'Har avlodda o‘sish R = h²·S', fn: (v) => (v.h2 * v.S).toFixed(2) }, { label: 'Oxirgi o‘rtacha', fn: (v) => (5 + v.h2 * v.S * v.gens).toFixed(1) }],
    graph: { xl: 'avlod', yl: 'belgining o‘rtacha qiymati', series: (v) => [ser('sun’iy tanlash', K.gr, range(0, v.gens, Math.max(1, Math.round(v.gens))), (g) => 5 + v.h2 * v.S * g)], anim: true },
    note: 'Seleksiya: eng yaxshi individlarni tanlab urchitsak, har avlodda belgi R = h²·S ga yaxshilanadi.',
  },
  'b10-ecology': {
    scene: 'none',
    vars: [num('a', 'O‘lja ko‘payishi', '', 0.2, 1.5, 0.1, 0.8, 1), num('b', 'Yeyilish tezligi', '', 0.01, 0.1, 0.01, 0.04, 2), num('c', 'Yirtqich o‘limi', '', 0.1, 1, 0.05, 0.6, 2), num('d', 'Yirtqich ko‘payishi', '', 0.005, 0.05, 0.005, 0.02, 3)],
    outs: [{ label: 'O‘lja muvozanat soni', fn: (v) => (v.c / v.d).toFixed(0) }, { label: 'Yirtqich muvozanat soni', fn: (v) => (v.a / v.b).toFixed(0) }],
    graph: { xl: 'vaqt', yl: 'soni', series: (v) => { let x = 20, y = 10; const X: [number, number][] = [], Y: [number, number][] = []; const dt = 0.02; for (let i = 0; i <= 3000; i += 1) { if (i % 50 === 0) { X.push([i * dt, x]); Y.push([i * dt, y]); } const dx = (v.a * x - v.b * x * y) * dt, dy = (-v.c * y + v.d * x * y) * dt; x = Math.max(0.1, x + dx); y = Math.max(0.1, y + dy); } return [{ name: 'o‘lja', color: K.gr, pts: X }, { name: 'yirtqich', color: K.r, pts: Y }]; }, anim: true },
    note: 'Lotka–Volterra modeli: yirtqich va o‘lja soni ritmik tebranadi — biri ko‘payganda ikkinchisi ortadi, so‘ng kamayadi.',
  },
  'b10-pyramid': {
    scene: 'pyramid',
    vars: [num('P', 'Produtsentlar energiyasi', 'kJ', 1000, 100000, 1000, 10000, 0), num('eff', 'Keyingi bosqichga o‘tish', '%', 5, 20, 1, 10, 0)],
    outs: [
      { label: 'Produtsentlar (o‘simlik)', unit: 'kJ', fn: (v) => v.P, d: 0, bar: { max: 1 } },
      { label: '1-tartib iste’molchi', unit: 'kJ', fn: (v) => (v.P * v.eff) / 100, d: 0, bar: { max: 1 } },
      { label: '2-tartib iste’molchi', unit: 'kJ', fn: (v) => (v.P * (v.eff / 100) ** 2), d: 0, bar: { max: 1 } },
      { label: '3-tartib iste’molchi', unit: 'kJ', fn: (v) => (v.P * (v.eff / 100) ** 3), d: 1, bar: { max: 1 } },
    ],
    note: 'Ekologik piramida qoidasi: har bir keyingi bosqichga energiyaning taxminan 10 % i o‘tadi.',
  },
  'b10-greenhouse': {
    scene: 'greenhouse',
    vars: [num('co2', 'CO₂ konsentratsiyasi', 'ppm', 280, 800, 10, 420, 0)],
    outs: [{ label: 'Global isish (taxminiy)', unit: '°C', fn: (v) => 3 * Math.log2(v.co2 / 280), d: 2 }],
    graph: { xl: 'CO₂, ppm', yl: 'ΔT, °C', series: () => [ser('ΔT', K.r, range(280, 800, 26), (c) => 3 * Math.log2(c / 280))] },
    note: 'Issiqxona gazlari atmosferada issiqlikni ushlab qoladi. CO₂ ikki baravar oshsa, ~3 °C isish taxmin qilinadi (soddalashtirilgan model).',
  },
  'b6-leaf': {
    scene: 'xylem',
    vars: [
      num('area', 'Barg yuzasi', 'sm²', 10, 100, 5, 50, 0),
      sel('stoma', 'Og‘izchalar holati', [['Ochiq (kunduzi, yorug‘da)', 1], ['Yarim ochiq', 0.5], ['Yopiq (qorong‘uda)', 0.1]], 1),
      num('T', 'Havo harorati', '°C', 10, 40, 1, 25, 0),
      num('hum', 'Havo namligi', '%', 10, 100, 5, 50, 0),
    ],
    outs: [
      { id: 'rate', label: 'Nisbiy bug‘lanish tezligi', unit: '%', fn: (v) => Math.min(100, leafLoss(v) / 8), d: 0 },
      { label: 'Barg yo‘qotadigan suv', unit: 'mg/soat', fn: (v) => leafLoss(v), d: 0 },
      { label: 'Havoning suv bug‘i yetishmovchiligi', unit: 'kPa', fn: (v) => vpd(v.T, v.hum), d: 2 },
    ],
    graph: { xl: 'T, °C', yl: 'mg/soat', series: (v) => [ser('bug‘lanish', K.b, range(10, 40, 15), (T) => leafLoss({ ...v, T }))] },
    note: 'Barg suvni og‘izchalar orqali bug‘latadi (transpiratsiya). Harorat ko‘tarilsa, havo quruq bo‘lsa, barg yuzasi katta va og‘izchalar ochiq bo‘lsa, bug‘lanish kuchayadi. Qorong‘uda og‘izchalar yopiladi. Model taxminiy.',
  },
  'b7-protozoa': {
    scene: 'colony',
    vars: [num('food', 'Oziq (bakteriyalar)', '%', 5, 100, 5, 60, 0), num('T', 'Harorat', '°C', 10, 35, 1, 24, 0), num('N0', 'Boshlang‘ich soni (1 mL da)', '', 1, 50, 1, 5, 0)],
    outs: [
      { id: 'N', label: '4 sutkadan keyin (1 mL da)', fn: (v) => protN(v, 96), d: 0 },
      { label: 'Ikkiga bo‘linish vaqti', unit: 'soat', fn: (v) => Math.LN2 / protR(v.T), d: 0 },
      { label: 'Maksimal son (muhit sig‘imi)', fn: (v) => 15 * v.food, d: 0 },
    ],
    graph: { xl: 'vaqt, soat', yl: 'soni (1 mL da)', series: (v) => [ser('infuzoriyalar', K.a, range(0, 96, 24), (t) => protN(v, t))], anim: true },
    note: 'Infuzoriyalar (masalan, tufelka) ikkiga bo‘linib ko‘payadi. Oziq cheklangan bo‘lgani uchun son chegaradan oshmaydi. Eng qulay harorat taxminan 25 °C. Model taxminiy.',
  },
  'b7-fish': {
    scene: 'buoy',
    vars: [
      sel('rl', 'Suv turi', [['Daryo suvi (1000 kg/m³)', 1000], ['Dengiz suvi (1025 kg/m³)', 1025]], 1000),
      num('f', 'Suzgich pufagi hajmi', '% (tana hajmidan)', 0, 10, 0.5, 7, 1),
      num('V', 'Baliq hajmi', 'sm³', 50, 500, 25, 200, 0),
    ],
    outs: [
      { id: 'rb', label: 'Baliqning o‘rtacha zichligi', unit: 'kg/m³', fn: (v) => fishRho(v.f), d: 0 },
      { label: 'Holat', fn: (v) => { const r = fishRho(v.f); return Math.abs(r - v.rl) < 3 ? 'suvda muallaq turadi' : r < v.rl ? 'yuqoriga ko‘tariladi' : 'pastga cho‘kadi'; } },
      { label: 'Muallaq turish uchun pufak hajmi', unit: '%', fn: (v) => (1 - v.rl / 1060) * 100, d: 1 },
    ],
    note: 'Baliq to‘qimasi suvdan og‘irroq (modelda taxminan 1060 kg/m³). Suzgich pufagidagi gaz o‘rtacha zichlikni kamaytiradi: zichlik suv zichligiga tenglashganda baliq erkin muallaq turadi. Dengiz suvi zichroq, shuning uchun pufak kichikroq bo‘lishi mumkin.',
  },
  'b8-skeleton': {
    scene: 'biceps',
    vars: [num('m', 'Yuk massasi', 'kg', 0.5, 10, 0.5, 3, 1), num('dm', 'Muskul birikkan joy (tirsakdan)', 'sm', 2, 8, 0.5, 4, 1), num('L', 'Yuk masofasi (tirsakdan kaftgacha)', 'sm', 20, 40, 1, 30, 0)],
    outs: [
      { id: 'Fm', label: 'Muskul hosil qilishi kerak bo‘lgan kuch', unit: 'N', fn: (v) => (v.m * 9.81 * v.L) / v.dm, d: 0 },
      { label: 'Yuk og‘irligi', unit: 'N', fn: (v) => v.m * 9.81, d: 1 },
      { label: 'Muskul kuchi / yuk og‘irligi', unit: '×', fn: (v) => v.L / v.dm, d: 1 },
    ],
    graph: { xl: 'yuk, kg', yl: 'muskul kuchi, N', series: (v) => [ser('muskul kuchi', K.r, range(0.5, 10, 19), (m) => (m * 9.81 * v.L) / v.dm)] },
    note: 'Bilak richag vazifasini bajaradi, tirsak — tayanch nuqta. Muskul tayanchga yaqin birikkani uchun yukdan ancha katta kuch hosil qilishi kerak: Fₘ·dₘ = P·L. Bilak og‘irligi hisobga olinmagan.',
  },
  'b8-kidney': {
    scene: 'bars',
    vars: [num('drink', 'Ichilgan suv', 'L/kun', 0.5, 4, 0.1, 1.5, 1), num('salt', 'Tuz iste‘moli', 'g/kun', 2, 20, 1, 8, 0), num('T', 'Havo harorati', '°C', 15, 40, 1, 22, 0)],
    outs: [
      { label: 'Suv kirishi (ichimlik, ovqat, metabolizm)', unit: 'L/kun', fn: (v) => kid(v).inn, d: 1, bar: { max: 6, color: K.b } },
      { label: 'Teri, nafas, ter va najas orqali yo‘qotish', unit: 'L/kun', fn: (v) => kid(v).other, d: 1, bar: { max: 4, color: K.a } },
      { label: 'Siydik hajmi', unit: 'L/kun', fn: (v) => kid(v).urine, d: 1, bar: { max: 5, color: K.gr } },
      { label: 'Siydik konsentratsiyasi', unit: 'mOsm/L', fn: (v) => kid(v).conc, d: 0 },
      { label: 'Suv balansi', unit: 'L/kun', fn: (v) => kid(v).bal, d: 1 },
      {
        label: 'Holat',
        fn: (v) => {
          const k = kid(v);
          return k.bal < -0.3 ? 'suv tanqisligi: chanqash, siydik quyuq' : k.conc > 900 ? 'siydik juda quyuq: ko‘proq suv iching' : k.conc < 150 ? 'siydik juda suyuq' : 'suv va tuz muvozanati me’yorda';
        },
      },
    ],
    graph: { xl: 'ichilgan suv, L', yl: 'siydik konsentratsiyasi, mOsm/L', series: (v) => [ser('konsentratsiya', K.a, range(0.5, 4, 14), (d) => kid({ ...v, drink: d }).conc)] },
    note: 'Buyrak suv balansini boshqaradi: suv kam bo‘lsa siydik kam va quyuq, ko‘p bo‘lsa ko‘p va suyuq bo‘ladi. Issiqda ter orqali ko‘p suv yo‘qoladi, tuz ko‘p bo‘lsa uni chiqarish uchun ko‘proq siydik kerak. Buyrak siydikni cheklangan darajagacha quyultira oladi, shuning uchun suv yetishmasa tanqislik paydo bo‘ladi. Sonlar taxminiy model.',
  },
  'b9-mendel': {
    scene: 'bars',
    vars: [sel('p1', '1-ota-ona genotipi', [['AA (dominant gomozigota)', 2], ['Aa (geterozigota)', 1], ['aa (retsessiv gomozigota)', 0]], 1), sel('p2', '2-ota-ona genotipi', [['AA (dominant gomozigota)', 2], ['Aa (geterozigota)', 1], ['aa (retsessiv gomozigota)', 0]], 1)],
    outs: [
      { label: 'Nasl: AA', unit: '%', fn: (v) => mend(v).AA * 100, d: 0, bar: { max: 100, color: K.gr } },
      { label: 'Nasl: Aa', unit: '%', fn: (v) => mend(v).Aa * 100, d: 0, bar: { max: 100, color: K.a } },
      { label: 'Nasl: aa', unit: '%', fn: (v) => mend(v).aa * 100, d: 0, bar: { max: 100, color: K.b } },
      {
        label: 'Genotip nisbati',
        fn: (v) => {
          const m = mend(v);
          const cnt = ([['AA', m.AA], ['Aa', m.Aa], ['aa', m.aa]] as [string, number][]).map(([n, p]) => [n, Math.round(p * 4)] as [string, number]).filter(([, c]) => c > 0);
          if (cnt.length === 1) return `hammasi ${cnt[0][0]}`;
          const g = cnt.reduce((a, [, c]) => gcd(a, c), 0);
          return cnt.map(([n, c]) => `${c / g} ${n}`).join(' : ');
        },
      },
      {
        label: 'Fenotip nisbati (dominant : retsessiv)',
        fn: (v) => {
          const m = mend(v);
          const dom = Math.round((m.AA + m.Aa) * 4);
          const rec = Math.round(m.aa * 4);
          return rec === 0 ? 'hammasi dominant belgili' : dom === 0 ? 'hammasi retsessiv belgili' : ratio([dom, rec]);
        },
      },
    ],
    note: 'Dominant allel (A) retsessiv allelni (a) bostiradi. Aa × Aa chatishtirilsa, genotip 1 : 2 : 1, fenotip 3 : 1 bo‘ladi. AA × aa dan olingan birinchi avlod (F₁) bir xil bo‘ladi — Mendelning birinchi qonuni.',
  },
  'b9-genetics': {
    scene: 'bars',
    vars: [
      sel('a1', '1-o‘simlik: rang geni (A — sariq, a — yashil)', GA, 1),
      sel('a2', '2-o‘simlik: rang geni', GA, 1),
      sel('b1', '1-o‘simlik: shakl geni (B — silliq, b — burishgan)', GB, 1),
      sel('b2', '2-o‘simlik: shakl geni', GB, 1),
      num('n', 'Nasl soni', '', 16, 640, 16, 160, 0),
    ],
    outs: [
      { label: 'Sariq silliq (A_B_)', unit: '%', fn: (v) => dih(v)[0] * 100, d: 1, bar: { max: 100, color: K.a } },
      { label: 'Sariq burishgan (A_bb)', unit: '%', fn: (v) => dih(v)[1] * 100, d: 1, bar: { max: 100, color: K.gr } },
      { label: 'Yashil silliq (aaB_)', unit: '%', fn: (v) => dih(v)[2] * 100, d: 1, bar: { max: 100, color: K.b } },
      { label: 'Yashil burishgan (aabb)', unit: '%', fn: (v) => dih(v)[3] * 100, d: 1, bar: { max: 100, color: K.v } },
      { label: 'Fenotip nisbati', fn: (v) => ratio(dih(v).map((p) => Math.round(p * 16))) },
      { label: 'Kutiladigan nasl soni', fn: (v) => dih(v).map((p) => Math.round(p * v.n)).join(' / ') },
    ],
    note: 'Har bir belgi alohida irsiylanadi (mustaqil taqsimlanish — Mendelning uchinchi qonuni). AaBb × AaBb dan 9 : 3 : 3 : 1 nisbat chiqadi; AaBb × aabb (tahliliy chatishtirish) dan esa 1 : 1 : 1 : 1.',
  },
  'b11-ferment': ferment,
  'b11-microbio': { ...ferment, note: 'Sanoatda achitqi va sut kislotali bakteriyalar non, yogurt, spirt va dori-darmon ishlab chiqarishda ishlatiladi; ularning unumi harorat va pH ga bog‘liq.' },
};
