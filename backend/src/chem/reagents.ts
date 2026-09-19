export type ReagentGroup = 'kislota' | 'asos' | 'tuz' | 'metall' | 'indikator';

export interface Reagent {
  id: string;
  name: string;
  formula: string;
  group: ReagentGroup;
}

export interface Visual {
  liquid: string; // aralashma rangi
  precipitate: string | null; // cho'kma rangi
  deposit: string | null; // metall sirtidagi qoplama rangi
  gas: boolean;
  heat: boolean;
}

export interface Reaction {
  equation: string;
  type: string;
  observation: string;
  visual: Visual;
}

export const REAGENTS: Reagent[] = [
  { id: 'hcl', name: 'Xlorid kislota', formula: 'HCl', group: 'kislota' },
  { id: 'h2so4', name: 'Sulfat kislota', formula: 'H2SO4', group: 'kislota' },
  { id: 'naoh', name: 'Natriy gidroksid', formula: 'NaOH', group: 'asos' },
  { id: 'cuso4', name: 'Mis(II) sulfat', formula: 'CuSO4', group: 'tuz' },
  { id: 'agno3', name: 'Kumush nitrat', formula: 'AgNO3', group: 'tuz' },
  { id: 'nacl', name: 'Osh tuzi', formula: 'NaCl', group: 'tuz' },
  { id: 'bacl2', name: 'Bariy xlorid', formula: 'BaCl2', group: 'tuz' },
  { id: 'na2co3', name: 'Soda', formula: 'Na2CO3', group: 'tuz' },
  { id: 'caco3', name: "Marmar bo'lagi", formula: 'CaCO3', group: 'tuz' },
  { id: 'zn', name: 'Rux', formula: 'Zn', group: 'metall' },
  { id: 'mg', name: 'Magniy', formula: 'Mg', group: 'metall' },
  { id: 'fe', name: 'Temir', formula: 'Fe', group: 'metall' },
  { id: 'cu', name: 'Mis', formula: 'Cu', group: 'metall' },
  { id: 'phph', name: 'Fenolftalein', formula: 'C20H14O4', group: 'indikator' },
];

const CLEAR = '#e6f2fa';
const BLUE = '#5da2ea';
const PINK = '#f26aa9';
const PALE_GREEN = '#cfe8c9';
const TEAL = '#63c3c8';
const WHITE = '#f7f7f2';
const BLUE_PPT = '#3f78d9';
const BROWN = '#8a5a3c';
const SILVER = '#b9c0c8';
const COPPER = '#b8683a';
const CREAM = '#efe6a8';

const NEUTRALIZATION = 'neytrallanish';
const GAS = "gaz ajralishi";
const PPT = "cho'kma hosil bo'lishi";
const DISPLACE = "o'rin olish";

const rule = (
  a: string,
  b: string,
  equation: string,
  type: string,
  observation: string,
  v: Partial<Visual> = {},
): [string, Reaction] => [
  pairKey(a, b),
  { equation, type, observation, visual: { liquid: CLEAR, precipitate: null, deposit: null, gas: false, heat: false, ...v } },
];

export function pairKey(a: string, b: string) {
  return [a, b].sort().join('+');
}

/** Maktab darajasidagi, suyultirilgan eritmalar uchun reaksiyalar jadvali */
export const REACTIONS = new Map<string, Reaction>([
  rule('hcl', 'naoh', 'HCl + NaOH → NaCl + H2O', NEUTRALIZATION, "Rang o'zgarmaydi, lekin idish biroz isiydi. Kislota va asos bir-birini neytrallaydi.", { heat: true }),
  rule('h2so4', 'naoh', 'H2SO4 + 2NaOH → Na2SO4 + 2H2O', NEUTRALIZATION, "Rang o'zgarmaydi, idish isiydi. Kislota va asos neytrallanadi.", { heat: true }),
  rule('hcl', 'na2co3', '2HCl + Na2CO3 → 2NaCl + H2O + CO2↑', GAS, "Ko'p pufakchalar chiqadi: bu karbonat angidrid (CO2) gazi.", { gas: true }),
  rule('h2so4', 'na2co3', 'H2SO4 + Na2CO3 → Na2SO4 + H2O + CO2↑', GAS, "Ko'p pufakchalar chiqadi: karbonat angidrid (CO2).", { gas: true }),
  rule('caco3', 'hcl', '2HCl + CaCO3 → CaCl2 + H2O + CO2↑', GAS, "Marmar bo'lagi sirtidan CO2 pufakchalari chiqadi, bo'lak asta kichrayadi.", { gas: true }),
  rule('caco3', 'h2so4', 'H2SO4 + CaCO3 → CaSO4 + H2O + CO2↑', GAS, "Pufakchalar chiqadi, lekin kam eriydigan CaSO4 marmar sirtini qoplab, reaksiyani sekinlashtiradi.", { gas: true }),
  rule('hcl', 'zn', '2HCl + Zn → ZnCl2 + H2↑', DISPLACE, "Rux sirtidan vodorod pufakchalari chiqadi.", { gas: true }),
  rule('hcl', 'mg', '2HCl + Mg → MgCl2 + H2↑', DISPLACE, "Magniy shiddatli reaksiyaga kirishadi: ko'p vodorod chiqadi, idish isiydi.", { gas: true, heat: true }),
  rule('fe', 'hcl', '2HCl + Fe → FeCl2 + H2↑', DISPLACE, "Vodorod pufakchalari sekin chiqadi, eritma och yashil tusga kiradi.", { gas: true, liquid: PALE_GREEN }),
  rule('h2so4', 'zn', 'H2SO4 + Zn → ZnSO4 + H2↑', DISPLACE, "Rux sirtidan vodorod pufakchalari chiqadi.", { gas: true }),
  rule('h2so4', 'mg', 'H2SO4 + Mg → MgSO4 + H2↑', DISPLACE, "Magniy tez erib, ko'p vodorod chiqaradi, idish isiydi.", { gas: true, heat: true }),
  rule('fe', 'h2so4', 'H2SO4 + Fe → FeSO4 + H2↑', DISPLACE, "Vodorod pufakchalari sekin chiqadi, eritma och yashil bo'ladi.", { gas: true, liquid: PALE_GREEN }),
  rule('cuso4', 'naoh', 'CuSO4 + 2NaOH → Cu(OH)2↓ + Na2SO4', PPT, "Ko'k rangli cho'kma (mis(II) gidroksid) tushadi.", { precipitate: BLUE_PPT, liquid: '#cfe3f7' }),
  rule('cuso4', 'zn', 'CuSO4 + Zn → ZnSO4 + Cu', DISPLACE, "Rux sirtida qizil-jigarrang mis qoplanadi, ko'k rang so'nadi.", { deposit: COPPER, liquid: '#c9e2f5' }),
  rule('cuso4', 'mg', 'CuSO4 + Mg → MgSO4 + Cu', DISPLACE, "Magniy sirtida qizil-jigarrang mis qoplanadi, ko'k rang so'nadi, idish biroz isiydi.", { deposit: COPPER, liquid: '#c9e2f5', heat: true }),
  rule('cuso4', 'fe', 'CuSO4 + Fe → FeSO4 + Cu', DISPLACE, "Temir sirtida qizil mis qoplanadi, eritma ko'kdan och yashilga o'tadi.", { deposit: COPPER, liquid: PALE_GREEN }),
  rule('bacl2', 'cuso4', 'CuSO4 + BaCl2 → BaSO4↓ + CuCl2', PPT, "Oq cho'kma (bariy sulfat) tushadi, eritma ko'kimtir-yashil bo'ladi.", { precipitate: WHITE, liquid: TEAL }),
  rule('cuso4', 'na2co3', 'CuSO4 + Na2CO3 → CuCO3↓ + Na2SO4', PPT, "Ko'k-yashil cho'kma tushadi.", { precipitate: '#5fb7a4', liquid: '#d8ecf6' }),
  rule('agno3', 'nacl', 'AgNO3 + NaCl → AgCl↓ + NaNO3', PPT, "Oq, uyushgan cho'kma (kumush xlorid) tushadi: xlorid ionini aniqlash reaksiyasi.", { precipitate: WHITE }),
  rule('agno3', 'hcl', 'AgNO3 + HCl → AgCl↓ + HNO3', PPT, "Oq, uyushgan cho'kma (AgCl) tushadi.", { precipitate: WHITE }),
  rule('agno3', 'bacl2', '2AgNO3 + BaCl2 → 2AgCl↓ + Ba(NO3)2', PPT, "Oq cho'kma (AgCl) tushadi.", { precipitate: WHITE }),
  rule('agno3', 'cu', '2AgNO3 + Cu → Cu(NO3)2 + 2Ag', DISPLACE, "Mis sirtida kumush qoplanadi, eritma sekin ko'kara boshlaydi.", { deposit: SILVER, liquid: '#b8d9f3' }),
  rule('agno3', 'zn', '2AgNO3 + Zn → Zn(NO3)2 + 2Ag', DISPLACE, "Rux sirtida kumrang kumush qoplanadi.", { deposit: SILVER }),
  rule('agno3', 'mg', '2AgNO3 + Mg → Mg(NO3)2 + 2Ag', DISPLACE, "Magniy sirtida kumush qoplanadi, idish biroz isiydi.", { deposit: SILVER, heat: true }),
  rule('agno3', 'fe', '2AgNO3 + Fe → Fe(NO3)2 + 2Ag', DISPLACE, "Temir sirtida kumush qoplanadi, eritma och yashil bo'ladi.", { deposit: SILVER, liquid: PALE_GREEN }),
  rule('agno3', 'naoh', '2AgNO3 + 2NaOH → Ag2O↓ + 2NaNO3 + H2O', PPT, "Qo'ng'ir cho'kma (kumush(I) oksid) tushadi.", { precipitate: BROWN }),
  rule('agno3', 'na2co3', '2AgNO3 + Na2CO3 → Ag2CO3↓ + 2NaNO3', PPT, "Och sariq-oq cho'kma tushadi.", { precipitate: CREAM }),
  rule('bacl2', 'h2so4', 'BaCl2 + H2SO4 → BaSO4↓ + 2HCl', PPT, "Oq cho'kma (BaSO4) tushadi: sulfat ionini aniqlash reaksiyasi.", { precipitate: WHITE }),
  rule('bacl2', 'na2co3', 'BaCl2 + Na2CO3 → BaCO3↓ + 2NaCl', PPT, "Oq cho'kma (bariy karbonat) tushadi.", { precipitate: WHITE }),
  rule('naoh', 'phph', 'Fenolftalein + ishqor → pushti rang', 'indikator', "Eritma to'q pushti rangga bo'yaladi: muhit ishqoriy.", { liquid: PINK }),
  rule('na2co3', 'phph', 'Fenolftalein + soda eritmasi → pushti rang', 'indikator', "Soda eritmasi ishqoriy muhit beradi, shuning uchun eritma pushti bo'ladi.", { liquid: PINK }),
]);

export const COLORS = { CLEAR, BLUE };
