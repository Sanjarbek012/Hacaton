import { K, num, range, sel, type Series } from '../common';
import type { FormulaDef } from '../FormulaLab';

const G = 9.81;
const R = 8.314;
const ser = (name: string, color: string, xs: number[], f: (x: number) => number): Series => ({ name, color, pts: xs.map((x) => [x, f(x)] as [number, number]) });
const LIQ: [string, number][] = [['Suv (1000)', 1000], ['Spirt (800)', 800], ['Tuzli suv (1200)', 1200], ['Simob (13600)', 13600]];

export const PHYSICS: Record<string, FormulaDef> = {
  'p7-measure': {
    scene: 'ruler',
    vars: [num('len', 'Jism uzunligi', 'sm', 1, 14, 0.1, 6.3, 1), sel('res', 'Bo‘linma qiymati', [['1 mm (0,1 sm)', 0.1], ['5 mm (0,5 sm)', 0.5], ['1 sm', 1]], 0.5)],
    outs: [
      { label: 'Chizg‘ich ko‘rsatishi', unit: 'sm', fn: (v) => Math.round(v.len / v.res) * v.res, d: 1 },
      { label: 'Absolyut xato', unit: 'sm', fn: (v) => Math.abs(Math.round(v.len / v.res) * v.res - v.len) },
      { label: 'Nisbiy xato', unit: '%', fn: (v) => (Math.abs(Math.round(v.len / v.res) * v.res - v.len) / v.len) * 100, d: 1 },
    ],
    note: 'Bo‘linma qiymati qancha kichik bo‘lsa, o‘lchash shuncha aniq bo‘ladi.',
  },
  'p7-motion': {
    scene: 'track',
    vars: [num('v0', 'Tezlik', 'm/s', 0.5, 10, 0.5, 3, 1)],
    outs: [{ label: '6 s dagi yo‘l', unit: 'm', fn: (v) => v.v0 * 6, d: 1 }, { label: 'Tezlik', unit: 'm/s', fn: (v) => v.v0, d: 1 }],
    graph: { xl: 't, s', yl: 's, m', series: (v) => [ser('s(t)', K.b, range(0, 6, 30), (t) => v.v0 * t)] },
    note: 'Tekis harakatda s = v·t: grafik to‘g‘ri chiziq bo‘ladi.',
  },
  'p7-density': {
    scene: 'buoy',
    vars: [num('rb', 'Jism zichligi', 'kg/m³', 200, 8000, 100, 2700, 0), sel('rl', 'Suyuqlik', LIQ, 1000), num('V', 'Hajmi', 'sm³', 10, 200, 5, 60, 0)],
    outs: [{ label: 'Massa', unit: 'g', fn: (v) => v.rb * v.V * 1e-3, d: 0 }, { label: 'Holat', fn: (v) => (v.rb < v.rl ? 'suzadi' : 'cho‘kadi') }],
    graph: { xl: 'V, sm³', yl: 'm, g', series: (v) => [ser('m(V)', K.a, range(10, 200, 19), (x) => v.rb * x * 1e-3)] },
    note: 'ρ = m / V. Jism zichligi suyuqlikning zichligidan kichik bo‘lsa, u suzadi.',
  },
  'p7-force': {
    scene: 'spring',
    vars: [num('m', 'Yuk massasi', 'kg', 0.05, 2, 0.05, 0.5, 2), num('k', 'Prujina bikrligi', 'N/m', 10, 200, 5, 50, 0)],
    outs: [{ label: 'Og‘irlik kuchi', unit: 'N', fn: (v) => v.m * G }, { label: 'Cho‘zilish', unit: 'sm', fn: (v) => ((v.m * G) / v.k) * 100, d: 1 }],
    graph: { xl: 'm, kg', yl: 'x, sm', series: (v) => [ser('x(m)', K.gr, range(0.05, 2, 20), (m) => ((m * G) / v.k) * 100)] },
    note: 'Guk qonuni: F = k·x. Cho‘zilish yuk massasiga to‘g‘ri proporsional.',
  },
  'p7-friction': {
    scene: 'friction',
    vars: [num('F', 'Tortuvchi kuch', 'N', 0, 40, 1, 12, 0), num('m', 'Massa', 'kg', 1, 10, 0.5, 4, 1), num('mu', 'Ishqalanish koeffitsienti', '', 0, 1, 0.05, 0.3, 2)],
    outs: [{ label: 'Maksimal ishqalanish kuchi', unit: 'N', fn: (v) => v.mu * v.m * G, d: 1 }, { label: 'Holat', fn: (v) => (v.F > v.mu * v.m * G ? 'harakatlanadi' : 'qo‘zg‘almaydi') }],
    note: 'F_ishq = μ·m·g. Tortuvchi kuch bundan katta bo‘lgandagina jism harakatlanadi.',
  },
  'p7-pressure': {
    scene: 'pressure',
    vars: [sel('rho', 'Suyuqlik', LIQ, 1000), num('h', 'Chuqurlik', 'm', 0.1, 8, 0.1, 2, 1)],
    outs: [{ label: 'Bosim', unit: 'kPa', fn: (v) => (v.rho * G * v.h) / 1000, d: 1 }],
    graph: { xl: 'h, m', yl: 'p, kPa', series: (v) => [ser('p(h)', K.a, range(0.1, 8, 20), (h) => (v.rho * G * h) / 1000)] },
    note: 'p = ρ·g·h: bosim chuqurlik va suyuqlik zichligiga bog‘liq.',
  },
  'p7-archimedes': {
    scene: 'buoy',
    vars: [sel('rb', 'Jism materiali', [['Qarag‘ay (600)', 600], ['Muz (900)', 900], ['Alyuminiy (2700)', 2700], ['Temir (7800)', 7800]], 900), sel('rl', 'Suyuqlik', LIQ, 1000), num('V', 'Hajmi', 'sm³', 10, 200, 5, 80, 0)],
    outs: [
      { label: 'Og‘irlik kuchi', unit: 'N', fn: (v) => v.rb * v.V * 1e-6 * G },
      { label: 'Arximed kuchi (to‘liq botganda)', unit: 'N', fn: (v) => v.rl * v.V * 1e-6 * G },
      { label: 'Holat', fn: (v) => (v.rb < v.rl ? 'suzadi' : 'cho‘kadi') },
    ],
    note: 'F_A = ρ_suyuq·g·V. Arximed kuchi og‘irlikdan katta bo‘lsa, jism suzadi.',
  },
  'p7-energy': {
    scene: 'energy',
    vars: [num('h0', 'Boshlang‘ich balandlik', 'm', 0.2, 2, 0.1, 1.2, 1), num('m', 'Massa', 'kg', 0.5, 5, 0.5, 2, 1)],
    outs: [{ label: 'To‘liq energiya', unit: 'J', fn: (v) => v.m * G * v.h0, d: 1 }, { label: 'Pastki nuqtada tezlik', unit: 'm/s', fn: (v) => Math.sqrt(2 * G * v.h0) }],
    note: 'Ep + Ek = const: yuqorida potensial, pastda kinetik energiya katta.',
  },
  'p7-lever': {
    scene: 'lever',
    vars: [num('F1', 'Chap kuch', 'N', 1, 20, 1, 6, 0), num('d1', 'Chap yelka', 'm', 0.5, 5, 0.5, 2, 1), num('F2', 'O‘ng kuch', 'N', 1, 20, 1, 4, 0), num('d2', 'O‘ng yelka', 'm', 0.5, 5, 0.5, 3, 1)],
    outs: [{ label: 'Chap moment', unit: 'N·m', fn: (v) => v.F1 * v.d1, d: 1 }, { label: 'O‘ng moment', unit: 'N·m', fn: (v) => v.F2 * v.d2, d: 1 }],
    note: 'Muvozanat sharti: F₁·d₁ = F₂·d₂.',
  },

  'p8-heat-motion': {
    scene: 'gasbox',
    vars: [num('N', 'Zarralar soni', '', 10, 60, 5, 30, 0), num('T', 'Temperatura', 'K', 100, 600, 10, 300, 0), num('V', 'Idish hajmi', 'L', 5, 20, 1, 10, 0)],
    outs: [{ label: 'Temperatura', unit: '°C', fn: (v) => v.T - 273, d: 0 }, { label: 'O‘rtacha tezlik', unit: 'm/s', fn: (v) => Math.sqrt((3 * R * v.T) / 0.029), d: 0 }],
    note: 'Temperatura qancha yuqori bo‘lsa, molekulalar shuncha tez harakatlanadi.',
  },
  'p8-internal': {
    scene: 'gasbox',
    vars: [num('n', 'Modda miqdori', 'mol', 0.5, 3, 0.5, 1, 1), num('T', 'Temperatura', 'K', 100, 600, 10, 300, 0)],
    outs: [{ id: 'N', label: 'Zarralar (model)', fn: (v) => v.n * 20, hidden: true }, { label: 'Ichki energiya', unit: 'J', fn: (v) => 1.5 * v.n * R * v.T, d: 0 }],
    note: 'Ideal gazning ichki energiyasi U = 3/2·n·R·T: temperatura oshsa, u ham oshadi.',
  },
  'p8-heat': {
    scene: 'heater',
    vars: [num('m', 'Massa', 'kg', 0.1, 2, 0.1, 0.5, 1), sel('c', 'Modda', [['Suv (4200)', 4200], ['O‘simlik yog‘i (2000)', 2000], ['Alyuminiy (900)', 900], ['Mis (385)', 385]], 4200), num('P', 'Isitgich quvvati', 'W', 100, 2000, 100, 500, 0)],
    outs: [{ label: 'Issiqlik miqdori (10 daq)', unit: 'kJ', fn: (v) => (v.P * 600) / 1000, d: 0 }, { label: 'Temperatura ortishi', unit: '°C', fn: (v) => (v.P * 600) / (v.c * v.m), d: 0 }],
    graph: { xl: 't, s', yl: 'T, °C', series: (v) => [ser('T(t)', K.r, range(0, 600, 30), (t) => 20 + (v.P * t) / (v.c * v.m))] },
    note: 'Q = c·m·ΔT. Qaynash hisobga olinmagan.',
  },
  'p8-phase': {
    scene: 'phase',
    vars: [num('T', 'Temperatura', '°C', -30, 130, 5, 20, 0)],
    outs: [{ label: 'Agregat holat', fn: (v) => (v.T < 0 ? 'muz' : v.T === 0 ? 'muz + suv (erish)' : v.T < 100 ? 'suv' : v.T === 100 ? 'suv + bug‘ (qaynash)' : 'bug‘') }],
    graph: { xl: 'Q, kJ (1 kg)', yl: 'T, °C', series: () => [{ name: 'isitish', color: K.a, pts: [[0, -30], [63, 0], [397, 0], [817, 100], [3077, 100], [3137, 130]] }] },
    note: 'Erish va qaynash vaqtida temperatura o‘zgarmaydi: energiya agregat holatni o‘zgartirishga sarflanadi.',
  },
  'p8-charge': {
    scene: 'charges',
    vars: [num('q1', 'Zaryad q₁', 'μC', -10, 10, 1, 5, 0), num('q2', 'Zaryad q₂', 'μC', -10, 10, 1, -5, 0), num('r', 'Masofa', 'sm', 5, 50, 1, 20, 0)],
    outs: [{ label: 'Ta’sir kuchi', unit: 'N', fn: (v) => (9e9 * Math.abs(v.q1 * v.q2) * 1e-12) / (v.r / 100) ** 2, d: 2 }, { label: 'Xarakter', fn: (v) => (v.q1 * v.q2 < 0 ? 'tortishadi' : v.q1 * v.q2 > 0 ? 'itarishadi' : 'ta’sir yo‘q') }],
    graph: { xl: 'r, sm', yl: 'F, N', series: (v) => [ser('F(r)', K.a, range(5, 50, 30), (r) => (9e9 * Math.abs(v.q1 * v.q2) * 1e-12) / (r / 100) ** 2)] },
    note: 'Kulon qonuni: F = k·|q₁q₂| / r². Bir xil ishorali zaryadlar itarishadi.',
  },
  'p8-circuit': {
    scene: 'circuit',
    vars: [num('U', 'Kuchlanish', 'V', 3, 24, 1, 12, 0), num('R1', 'R₁', 'Ω', 1, 30, 1, 10, 0), num('R2', 'R₂', 'Ω', 1, 30, 1, 20, 0), sel('mode', 'Ulanish', [['Ketma-ket', 0], ['Parallel', 1]], 0)],
    outs: [
      { label: 'Umumiy qarshilik', unit: 'Ω', fn: (v) => (v.mode === 1 ? (v.R1 * v.R2) / (v.R1 + v.R2) : v.R1 + v.R2), d: 2 },
      { id: 'I', label: 'Umumiy tok', unit: 'A', fn: (v) => v.U / (v.mode === 1 ? (v.R1 * v.R2) / (v.R1 + v.R2) : v.R1 + v.R2), d: 2 },
      { label: 'R₁ dagi tok', unit: 'A', fn: (v) => (v.mode === 1 ? v.U / v.R1 : v.U / (v.R1 + v.R2)), d: 2 },
    ],
    note: 'Ketma-ket: R = R₁ + R₂, tok bir xil. Parallel: 1/R = 1/R₁ + 1/R₂, kuchlanish bir xil.',
  },
  'p8-power': {
    scene: 'circuit',
    vars: [num('U', 'Kuchlanish', 'V', 3, 24, 1, 12, 0), num('R1', 'Lampa qarshiligi', 'Ω', 5, 50, 1, 20, 0)],
    outs: [{ id: 'I', label: 'Tok kuchi', unit: 'A', fn: (v) => v.U / v.R1, d: 2 }, { label: 'Quvvat', unit: 'W', fn: (v) => (v.U * v.U) / v.R1, d: 1 }, { label: 'Ish (10 daqiqa)', unit: 'kJ', fn: (v) => ((v.U * v.U) / v.R1) * 0.6, d: 1 }],
    note: 'P = U·I = U²/R, A = P·t. Kuchlanish oshsa, quvvat tez ortadi.',
  },
  'p8-magnet': {
    scene: 'magwire',
    vars: [num('I', 'Tok kuchi', 'A', 1, 20, 1, 5, 0), num('r', 'Simdan masofa', 'sm', 1, 20, 1, 5, 0)],
    outs: [{ id: 'B', label: 'Magnit induksiya', unit: 'μT', fn: (v) => (20 * v.I) / v.r, d: 1 }],
    graph: { xl: 'r, sm', yl: 'B, μT', series: (v) => [ser('B(r)', K.a, range(1, 20, 19), (r) => (20 * v.I) / r)] },
    note: 'Tokli o‘tkazgich atrofida magnit maydon hosil bo‘ladi; masofa ortsa maydon susayadi.',
  },
  'p8-refraction': {
    scene: 'refraction',
    vars: [sel('n1', '1-muhit', [['Havo (1,0)', 1], ['Suv (1,33)', 1.33], ['Shisha (1,5)', 1.5]], 1), sel('n2', '2-muhit', [['Havo (1,0)', 1], ['Suv (1,33)', 1.33], ['Shisha (1,5)', 1.5]], 1.5), num('ang', 'Tushish burchagi', '°', 0, 85, 1, 40, 0)],
    outs: [
      { label: 'Qaytish burchagi', unit: '°', fn: (v) => v.ang, d: 0 },
      { label: 'Sinish burchagi', fn: (v) => { const s = (v.n1 * Math.sin((v.ang * Math.PI) / 180)) / v.n2; return s > 1 ? 'to‘liq ichki qaytish' : `${((Math.asin(s) * 180) / Math.PI).toFixed(1)}°`; } },
      { label: 'Chegaraviy burchak', fn: (v) => (v.n1 > v.n2 ? `${((Math.asin(v.n2 / v.n1) * 180) / Math.PI).toFixed(1)}°` : 'yo‘q') },
    ],
    note: 'Snellius qonuni: n₁·sinα = n₂·sinβ. Qaytish burchagi tushish burchagiga teng.',
  },

  'p9-accel': {
    scene: 'track',
    vars: [num('v0', 'Boshlang‘ich tezlik', 'm/s', 0, 10, 0.5, 1, 1), num('a', 'Tezlanish', 'm/s²', 0.1, 5, 0.1, 2, 1)],
    outs: [{ label: '6 s dagi tezlik', unit: 'm/s', fn: (v) => v.v0 + v.a * 6, d: 1 }, { label: '6 s dagi yo‘l', unit: 'm', fn: (v) => v.v0 * 6 + 0.5 * v.a * 36, d: 1 }],
    graph: { xl: 't, s', yl: 'v (m/s), s (m)', series: (v) => [ser('v(t)', K.a, range(0, 6, 24), (t) => v.v0 + v.a * t), ser('s(t)', K.b, range(0, 6, 24), (t) => v.v0 * t + 0.5 * v.a * t * t)] },
    note: 'v = v₀ + a·t, s = v₀·t + a·t²/2.',
  },
  'p9-newton': {
    scene: 'friction',
    vars: [num('F', 'Kuch', 'N', 0, 60, 1, 30, 0), num('m', 'Massa', 'kg', 1, 10, 0.5, 5, 1), num('mu', 'Ishqalanish koeffitsienti', '', 0, 0.6, 0.05, 0.1, 2)],
    outs: [{ label: 'Teng ta’sir etuvchi', unit: 'N', fn: (v) => Math.max(0, v.F - v.mu * v.m * G), d: 1 }, { label: 'Tezlanish', unit: 'm/s²', fn: (v) => Math.max(0, (v.F - v.mu * v.m * G) / v.m), d: 2 }],
    graph: { xl: 'F, N', yl: 'a, m/s²', series: (v) => [ser('a(F)', K.gr, range(0, 60, 30), (F) => Math.max(0, (F - v.mu * v.m * G) / v.m))] },
    note: 'Nyutonning ikkinchi qonuni: a = F_teng / m. Massa katta bo‘lsa, tezlanish kichik.',
  },
  'p9-gravity': {
    scene: 'orbit',
    vars: [num('M', 'Yulduz massasi', 'Quyosh massasi', 0.5, 3, 0.1, 1, 1), num('r', 'Orbita radiusi', 'AB', 0.4, 5, 0.1, 1, 1)],
    outs: [{ label: 'Aylanish davri', unit: 'yil', fn: (v) => Math.sqrt(v.r ** 3 / v.M), d: 2 }, { label: 'Orbital tezlik', unit: 'km/s', fn: (v) => 29.78 * Math.sqrt(v.M / v.r), d: 1 }, { label: 'Tortishish kuchi (Yerdagiga nisbatan)', fn: (v) => (v.M / v.r ** 2).toFixed(2) + ' marta' }],
    graph: { xl: 'r, AB', yl: 'T, yil', series: (v) => [ser('T(r)', K.a, range(0.4, 5, 23), (r) => Math.sqrt(r ** 3 / v.M))] },
    note: 'Butun olam tortishish kuchi F ~ M/r². Uzoqdagi sayyoralar sekin aylanadi (Kepler qonuni).',
  },
  'p9-momentum': {
    scene: 'collision',
    vars: [num('m1', '1-aravacha massasi', 'kg', 1, 10, 1, 4, 0), num('v1', '1-aravacha tezligi', 'm/s', 1, 8, 1, 5, 0), num('m2', '2-aravacha massasi', 'kg', 1, 10, 1, 4, 0), num('e', 'Elastiklik (0 = yopishadi, 1 = elastik)', '', 0, 1, 0.5, 1, 1)],
    outs: [
      { label: 'Oldingi impuls', unit: 'kg·m/s', fn: (v) => v.m1 * v.v1, d: 1 },
      { label: '1-aravacha keyin', unit: 'm/s', fn: (v) => (v.v1 * (v.m1 - v.e * v.m2)) / (v.m1 + v.m2), d: 2 },
      { label: '2-aravacha keyin', unit: 'm/s', fn: (v) => (v.v1 * v.m1 * (1 + v.e)) / (v.m1 + v.m2), d: 2 },
      { label: 'Keyingi impuls', unit: 'kg·m/s', fn: (v) => v.m1 * ((v.v1 * (v.m1 - v.e * v.m2)) / (v.m1 + v.m2)) + v.m2 * ((v.v1 * v.m1 * (1 + v.e)) / (v.m1 + v.m2)), d: 1 },
    ],
    note: 'Impulsning saqlanish qonuni: urilishdan oldingi va keyingi jami impuls teng.',
  },
  'p9-waves': {
    scene: 'wave',
    vars: [num('A', 'Amplituda', '', 1, 10, 1, 5, 0), num('f', 'Chastota', 'Hz', 0.5, 5, 0.5, 1.5, 1), num('v', 'To‘lqin tezligi', 'm/s', 1, 20, 1, 6, 0)],
    outs: [{ label: 'To‘lqin uzunligi', unit: 'm', fn: (v) => v.v / v.f, d: 2 }, { label: 'Davr', unit: 's', fn: (v) => 1 / v.f, d: 2 }],
    note: 'v = λ·f. Chastota oshsa, to‘lqin uzunligi kamayadi.',
  },
  'p9-sound': {
    scene: 'wave',
    audio: true,
    vars: [num('f', 'Chastota', 'Hz', 100, 1000, 10, 440, 0), num('A', 'Amplituda (ovoz balandligi)', '', 1, 10, 1, 5, 0)],
    outs: [{ id: 'audio', label: '', fn: () => 1, hidden: true }, { label: 'To‘lqin uzunligi (havoda)', unit: 'm', fn: (v) => 340 / v.f, d: 2 }, { label: 'Davr', unit: 'ms', fn: (v) => 1000 / v.f, d: 2 }, { label: 'Ton', fn: (v) => (v.f < 250 ? 'past' : v.f < 600 ? 'o‘rta' : 'baland') }],
    note: 'Chastota ovoz tonini, amplituda balandligini belgilaydi. Ovozni yoqsangiz, sinov signal eshitiladi (past ovozda!).',
  },
  'p9-induction': {
    scene: 'induction',
    vars: [num('N', 'O‘ramlar soni', '', 1, 12, 1, 6, 0), num('B', 'Magnit induksiya', 'mT', 10, 100, 5, 50, 0), num('w', 'Harakat tezligi', '', 1, 8, 0.5, 3, 1)],
    outs: [{ label: 'Eng katta EYuK', unit: 'mV', fn: (v) => v.N * v.B * 0.005 * v.w, d: 1 }],
    note: 'Magnit g‘altak ichida harakatlansa, EYuK hosil bo‘ladi. O‘ramlar ko‘p va harakat tez bo‘lsa, EYuK katta.',
  },

  'p10-circular': {
    scene: 'circular',
    vars: [num('r', 'Radius', 'm', 0.5, 5, 0.1, 2, 1), num('v', 'Chiziqli tezlik', 'm/s', 1, 10, 0.5, 4, 1)],
    outs: [{ label: 'Burchak tezlik', unit: 'rad/s', fn: (v) => v.v / v.r, d: 2 }, { label: 'Aylanish davri', unit: 's', fn: (v) => (2 * Math.PI * v.r) / v.v, d: 2 }, { label: 'Markazga intilma tezlanish', unit: 'm/s²', fn: (v) => (v.v * v.v) / v.r, d: 2 }],
    note: 'a = v²/r. Tezlik oshsa yoki radius kamaysa, tezlanish ortadi.',
  },
  'p10-projectile': {
    scene: 'projectile',
    vars: [num('v0', 'Boshlang‘ich tezlik', 'm/s', 5, 40, 1, 20, 0), num('ang', 'Otish burchagi', '°', 5, 85, 1, 45, 0), sel('g', 'Osmon jismi', [['Yer (9,81)', 9.81], ['Oy (1,62)', 1.62], ['Mars (3,71)', 3.71]], 9.81)],
    outs: [{ label: 'Uchish vaqti', unit: 's', fn: (v) => (2 * v.v0 * Math.sin((v.ang * Math.PI) / 180)) / v.g, d: 2 }, { label: 'Uchish uzoqligi', unit: 'm', fn: (v) => (v.v0 ** 2 * Math.sin((2 * v.ang * Math.PI) / 180)) / v.g, d: 1 }, { label: 'Eng katta balandlik', unit: 'm', fn: (v) => (v.v0 * Math.sin((v.ang * Math.PI) / 180)) ** 2 / (2 * v.g), d: 1 }],
    note: 'Uzoqlik 45° da eng katta bo‘ladi. Oyda jism ancha uzoqqa uchadi.',
  },
  'p10-dynamics': {
    scene: 'incline',
    vars: [num('ang', 'Qiyalik burchagi', '°', 5, 45, 1, 25, 0), num('mu', 'Ishqalanish koeffitsienti', '', 0, 1, 0.05, 0.2, 2), num('m', 'Massa', 'kg', 1, 10, 1, 3, 0)],
    outs: [{ label: 'Tezlanish', unit: 'm/s²', fn: (v) => Math.max(0, G * (Math.sin((v.ang * Math.PI) / 180) - v.mu * Math.cos((v.ang * Math.PI) / 180))), d: 2 }, { label: 'Normal reaksiya', unit: 'N', fn: (v) => v.m * G * Math.cos((v.ang * Math.PI) / 180), d: 1 }, { label: 'Ishqalanish kuchi', unit: 'N', fn: (v) => v.mu * v.m * G * Math.cos((v.ang * Math.PI) / 180), d: 1 }],
    note: 'a = g(sinα − μ·cosα). tgα > μ bo‘lsa, jism sirpanadi.',
  },
  'p10-energy': {
    scene: 'energy',
    vars: [num('h0', 'Boshlang‘ich balandlik', 'm', 0.2, 2, 0.1, 1.5, 1), num('m', 'Massa', 'kg', 0.5, 5, 0.5, 1, 1)],
    outs: [{ label: 'To‘liq mexanik energiya', unit: 'J', fn: (v) => v.m * G * v.h0, d: 2 }, { label: 'Eng katta tezlik', unit: 'm/s', fn: (v) => Math.sqrt(2 * G * v.h0), d: 2 }],
    note: 'Ishqalanish bo‘lmaganda mexanik energiya saqlanadi: E = Ep + Ek = const.',
  },
  'p10-mkt': {
    scene: 'gasbox',
    vars: [num('N', 'Zarralar soni', '', 10, 60, 5, 40, 0), num('T', 'Temperatura', 'K', 100, 600, 10, 300, 0), num('V', 'Idish hajmi', 'L', 5, 20, 1, 12, 0)],
    outs: [{ label: 'O‘rtacha kinetik energiya', unit: '10⁻²¹ J', fn: (v) => 1.5 * 1.38e-23 * v.T * 1e21, d: 2 }, { label: 'Kvadratik o‘rtacha tezlik (N₂)', unit: 'm/s', fn: (v) => Math.sqrt((3 * 1.38e-23 * v.T) / 4.65e-26), d: 0 }],
    note: 'Ek = 3/2·k·T: temperatura molekulalarning o‘rtacha kinetik energiyasining o‘lchovi.',
  },
  'p10-gaslaw': {
    scene: 'piston',
    vars: [num('n', 'Gaz miqdori', 'mol', 0.5, 3, 0.5, 1, 1), num('T', 'Temperatura', 'K', 200, 600, 10, 300, 0), num('V', 'Hajm', 'L', 5, 30, 1, 10, 0)],
    outs: [{ id: 'P', label: 'Bosim', unit: 'kPa', fn: (v) => (v.n * R * v.T) / v.V, d: 0 }],
    graph: { xl: 'V, L', yl: 'p, kPa', series: (v) => [ser(`T = ${v.T} K`, K.a, range(5, 30, 25), (V) => (v.n * R * v.T) / V), ser(`T = ${Math.round(v.T * 1.5)} K`, K.r, range(5, 30, 25), (V) => (v.n * R * v.T * 1.5) / V)] },
    note: 'Klapeyron–Mendeleev: p·V = n·R·T. Hajm kamaysa bosim ortadi (Boyl–Mariott).',
  },
  'p10-thermo': {
    scene: 'piston',
    vars: [sel('proc', 'Jarayon', [['Izoxorik (hajm o‘zgarmaydi)', 0], ['Izobarik (bosim o‘zgarmaydi)', 1]], 1), num('Q', 'Berilgan issiqlik', 'J', 0, 3000, 100, 1000, 0)],
    outs: [
      { id: 'n', label: '', fn: () => 1, hidden: true },
      { id: 'T', label: 'Oxirgi temperatura', unit: 'K', fn: (v) => 300 + (v.proc === 0 ? v.Q / (1.5 * R) : v.Q / (2.5 * R)), d: 0 },
      { id: 'V', label: '', fn: (v) => (v.proc === 0 ? 10 : (10 * (300 + v.Q / (2.5 * R))) / 300), hidden: true },
      { label: 'Ichki energiya o‘zgarishi', unit: 'J', fn: (v) => (v.proc === 0 ? v.Q : (v.Q * 1.5) / 2.5), d: 0 },
      { label: 'Gaz bajargan ish', unit: 'J', fn: (v) => (v.proc === 0 ? 0 : (v.Q * 1) / 2.5), d: 0 },
    ],
    note: 'Termodinamikaning I qonuni: Q = ΔU + A. Izoxorik jarayonda ish bajarilmaydi.',
  },
  'p10-electro': {
    scene: 'charges',
    vars: [num('q1', 'Zaryad q₁', 'μC', -10, 10, 1, 6, 0), num('q2', 'Sinov zaryadi q₂', 'μC', -10, 10, 1, 2, 0), num('r', 'Masofa', 'sm', 5, 50, 1, 15, 0)],
    outs: [{ label: 'q₁ maydon kuchlanganligi', unit: 'kN/C', fn: (v) => (9e9 * Math.abs(v.q1) * 1e-6) / (v.r / 100) ** 2 / 1000, d: 1 }, { label: 'q₂ ga ta’sir kuchi', unit: 'N', fn: (v) => (9e9 * Math.abs(v.q1 * v.q2) * 1e-12) / (v.r / 100) ** 2, d: 2 }],
    note: 'E = k·q/r², F = E·q₂. Manfiy zaryad maydon yo‘nalishiga qarama-qarshi kuch oladi.',
  },
  'p10-capacitor': {
    scene: 'capacitor',
    vars: [num('C', 'Sig‘im', 'μF', 1, 100, 1, 20, 0), num('U', 'Kuchlanish', 'V', 1, 12, 1, 6, 0), num('R', 'Qarshilik', 'kΩ', 1, 100, 1, 10, 0)],
    outs: [{ label: 'Zaryad', unit: 'μC', fn: (v) => v.C * v.U, d: 0 }, { label: 'Energiya', unit: 'μJ', fn: (v) => 0.5 * v.C * v.U * v.U, d: 0 }, { label: 'Vaqt doimiysi τ = R·C', unit: 'ms', fn: (v) => v.R * v.C, d: 0 }],
    graph: { xl: 't, ms', yl: 'q, μC', series: (v) => [ser('q(t)', K.a, range(0, 5 * v.R * v.C, 30), (t) => v.C * v.U * (1 - Math.exp(-t / (v.R * v.C))))] },
    note: 'C = q/U. Zaryadlanish eksponensial: 5τ da deyarli to‘la.',
  },
  'p10-emf': {
    scene: 'circuit',
    vars: [num('U', 'EYuK ε', 'V', 3, 24, 1, 12, 0), num('R1', 'Tashqi qarshilik R', 'Ω', 1, 30, 1, 10, 0), num('R2', 'Ichki qarshilik r', 'Ω', 0.5, 5, 0.5, 1, 1)],
    outs: [{ id: 'I', label: 'Tok kuchi', unit: 'A', fn: (v) => v.U / (v.R1 + v.R2), d: 2 }, { label: 'Qisqichdagi kuchlanish', unit: 'V', fn: (v) => (v.U * v.R1) / (v.R1 + v.R2), d: 2 }, { label: 'Ichki yo‘qotish', unit: 'W', fn: (v) => (v.U / (v.R1 + v.R2)) ** 2 * v.R2, d: 2 }],
    note: 'To‘liq zanjir uchun Om qonuni: I = ε / (R + r). R₂ manbaning ichki qarshiligi.',
  },

  'p11-lc': {
    scene: 'lc',
    vars: [num('L', 'Induktivlik', 'mH', 1, 100, 1, 10, 0), num('C', 'Sig‘im', 'μF', 1, 100, 1, 10, 0)],
    outs: [{ id: 'f', label: 'Chastota', unit: 'Hz', fn: (v) => 1 / (2 * Math.PI * Math.sqrt(v.L * 1e-3 * v.C * 1e-6)), d: 0 }, { label: 'Davr', unit: 'ms', fn: (v) => 2 * Math.PI * Math.sqrt(v.L * 1e-3 * v.C * 1e-6) * 1000, d: 2 }],
    note: 'Tomson formulasi: T = 2π√(LC). Energiya kondensator va g‘altak orasida almashadi.',
  },
  'p11-ac': {
    scene: 'ac',
    vars: [num('Em', 'Kuchlanish amplitudasi', 'V', 10, 311, 1, 311, 0), num('f', 'Chastota', 'Hz', 10, 100, 1, 50, 0), num('R', 'Qarshilik', 'Ω', 10, 100, 1, 50, 0)],
    outs: [{ label: 'Ta’sir etuvchi kuchlanish', unit: 'V', fn: (v) => v.Em / Math.SQRT2, d: 1 }, { label: 'Ta’sir etuvchi tok', unit: 'A', fn: (v) => v.Em / Math.SQRT2 / v.R, d: 2 }, { label: 'O‘rtacha quvvat', unit: 'W', fn: (v) => (v.Em / Math.SQRT2) ** 2 / v.R, d: 1 }],
    note: 'U_ta’sir = U_max/√2. Rozetkadagi 220 V shu ta’sir etuvchi qiymat.',
  },
  'p11-emwave': {
    scene: 'emwave',
    vars: [num('f', 'Chastota', 'MHz', 1, 1000, 1, 100, 0)],
    outs: [{ label: 'To‘lqin uzunligi', unit: 'm', fn: (v) => 300 / v.f, d: 2 }, { label: 'Davr', unit: 'ns', fn: (v) => 1000 / v.f, d: 1 }],
    note: 'λ = c/f. Elektr va magnit maydon bir-biriga tik tebranadi.',
  },
  'p11-lens': {
    scene: 'lens',
    vars: [num('f', 'Fokus masofasi', 'sm', 5, 20, 1, 10, 0), num('d', 'Jism masofasi', 'sm', 5, 60, 1, 30, 0), num('h', 'Jism balandligi', 'sm', 1, 5, 1, 3, 0)],
    outs: [
      { label: 'Tasvir masofasi', unit: 'sm', fn: (v) => (Math.abs(v.d - v.f) < 0.4 ? '∞' : (1 / (1 / v.f - 1 / v.d)).toFixed(1)) },
      { label: 'Kattalashtirish', fn: (v) => (Math.abs(v.d - v.f) < 0.4 ? '∞' : Math.abs(1 / (1 / v.f - 1 / v.d) / v.d).toFixed(2) + ' marta') },
    ],
    note: 'Yupqa linza formulasi: 1/f = 1/d + 1/d′. d < f bo‘lsa, tasvir mavhum va to‘g‘ri.',
  },
  'p11-interference': {
    scene: 'slit',
    vars: [num('lambda', 'To‘lqin uzunligi', 'nm', 400, 700, 10, 550, 0), num('d', 'Tirqishlar orasi', 'mm', 0.1, 1, 0.05, 0.3, 2), num('L', 'Ekrangacha masofa', 'm', 0.5, 3, 0.1, 1.5, 1)],
    outs: [{ label: 'Yo‘llar orasidagi masofa', unit: 'mm', fn: (v) => (v.lambda * v.L) / v.d / 1000, d: 2 }],
    note: 'Δy = λ·L/d. Qizil nur binafshadan kengroq yo‘llar beradi.',
  },
  'p11-relativity': {
    scene: 'relativity',
    vars: [num('v', 'Tezlik (c ulushida)', 'c', 0, 0.99, 0.01, 0.6, 2)],
    outs: [{ label: 'Lorens omili γ', fn: (v) => (1 / Math.sqrt(1 - v.v * v.v)).toFixed(3) }, { label: 'Uzunlik (tinchlikda 120)', fn: (v) => (120 * Math.sqrt(1 - v.v * v.v)).toFixed(1) }, { label: '1 s tinch soat ↔ harakatdagi', fn: (v) => (1 / Math.sqrt(1 - v.v * v.v)).toFixed(2) + ' s' }],
    note: 'Yorug‘lik tezligiga yaqin tezlikda vaqt sekinlashadi, uzunlik qisqaradi.',
  },
  'p11-photoeffect': {
    scene: 'photoeffect',
    vars: [num('f', 'Yorug‘lik chastotasi', '×10¹⁴ Hz', 2, 15, 0.5, 8, 1), num('I', 'Yorug‘lik intensivligi', '', 1, 10, 1, 5, 0), sel('W', 'Metall (chiqish ishi)', [['Seziy (1,9 eV)', 1.9], ['Natriy (2,3 eV)', 2.3], ['Rux (4,3 eV)', 4.3], ['Platina (5,6 eV)', 5.6]], 2.3)],
    outs: [{ label: 'Foton energiyasi', unit: 'eV', fn: (v) => 0.4136 * v.f, d: 2 }, { label: 'Elektron energiyasi', unit: 'eV', fn: (v) => Math.max(0, 0.4136 * v.f - v.W), d: 2 }, { label: 'Qizil chegara', unit: '×10¹⁴ Hz', fn: (v) => v.W / 0.4136, d: 2 }],
    note: 'Eynshteyn: h·f = A + Ek. Chastota chegaradan kichik bo‘lsa, intensivlik qancha katta bo‘lmasin, elektron chiqmaydi.',
  },
  'p11-nucleus': {
    scene: 'atoms',
    vars: [num('th', 'Yarim yemirilish davri', 's', 1, 10, 0.5, 3, 1), num('seed', 'Tajriba raqami', '', 1, 20, 1, 1, 0)],
    outs: [{ label: '2 davrdan keyin qolgan ulush', fn: () => '25 %' }, { label: '5 davrdan keyin qolgan ulush', fn: () => '3,1 %' }],
    graph: { xl: 't, s', yl: 'N (yadro)', series: (v) => [ser('N(t) = N₀·2^(−t/T)', K.gr, range(0, 5 * v.th, 30), (t) => 120 * 2 ** (-t / v.th))] },
    note: 'N = N₀·2^(−t/T). Har bir yadroning qachon yemirilishini oldindan aytib bo‘lmaydi, lekin umumiy qonuniyat aniq.',
  },
};
