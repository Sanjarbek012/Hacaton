/** Har bir simulyatsiyaning maqsadi: AI javoblarini aniq va to'g'ri qilish uchun kontekst */
export const SIM_GOALS: Record<string, string> = {
  'free-fall':
    "Balandlik va osmon jismini (Yer, Oy, Mars, Yupiter) o'zgartirib, jismning tushish vaqti va oxirgi tezligini o'lchash. Formulalar: h = g·t²/2, v = g·t.",
  pendulum:
    "Ip uzunligi va boshlang'ich burchakni o'zgartirib, mayatnikning tebranish davrini o'lchash va T = 2π√(l/g) bilan solishtirish.",
  ohm: "Kuchlanishni o'zgartirib tok kuchini o'lchash, I(U) grafigini chizish va qarshilikni R = U/I orqali topish (Om qonuni).",
  'reaction-rate':
    "Temperatura, konsentratsiya va katalizator reaksiya tezligiga qanday ta'sir qilishini zarrachalar to'qnashuvi orqali kuzatish.",
  titration:
    "25 mL 0.1 mol/L HCl ni NaOH bilan titrlash: fenolftalein rangi o'zgargan nuqtani va ekvivalentlik nuqtasini topish, pH egri chizig'ini kuzatish.",
  cell: "O'simlik va hayvon hujayrasining organoidlarini ko'rib chiqish va vazifalarini o'rganish.",
  photosynthesis:
    "Yorug'lik, CO2 miqdori va temperaturaning fotosintez tezligiga (kislorod pufakchalari soniga) ta'sirini kuzatish; cheklovchi omil tushunchasi.",
  osmosis:
    "Hujayrani turli konsentratsiyali NaCl eritmasiga solib, suvning hujayraga kirishi yoki chiqishini (bo'rtish, plazmoliz) kuzatish. Hujayra ichida 0.9% tuz bor.",
  mixing:
    "Ikki moddani (kislota, asos, tuz, metall, indikator) aralashtirib, reaksiya belgilarini (gaz, cho'kma, rang, isish) kuzatish va reaksiya tenglamasini tushunish.",

  // Kimyo
  'c7-atom': "Kartochkadagi zarrani atom yoki molekula deb tasniflash. Molekula — bir necha bog'langan atomdan iborat zarra (O₂, H₂O, CO₂).",
  'c7-element': "Element tanlab, uning belgisi, lotincha nomi, turi (metall/metallmas) va nisbiy atom massasini ko'rish; n atomli zarraning massasini hisoblash.",
  'c8-periodic': "Z ni 1 dan 18 gacha o'zgartirib, davr va guruh, tashqi elektronlar soni, atom radiusi va elektrmanfiylikning davriy o'zgarishini grafikda kuzatish.",
  'c8-atomstruct': "Protonlar (Z), neytronlar (N) va zaryadni o'zgartirib, massa soni A = Z + N, elektronlar soni, elektron qobiqlari (2-8-8) va izotop/ion tushunchalarini o'rganish.",
  'c8-bond': "Ikki atomning elektrmanfiyligini tanlab, ΔEN va ionlilik darajasi bo'yicha bog'lanish turini (metall, ionli, kovalent qutbsiz/qutbli) aniqlash.",
  'c10-organic': "Organik kimyo asoslarini ko'rib chiqish: uglerod valentligi, Butlerov nazariyasi, izomeriya, gomologik qator, funksional guruhlar.",
  'c10-alkane': "Alkanlarda uglerod atomlari sonini o'zgartirib, formula CₙH₂ₙ₊₂, Mr, qaynash harorati, agregat holat va yonish tenglamasi koeffitsientlarining qanday o'zgarishini kuzatish.",
  'c10-alkene': "Etan, eten va etinni bromli suv hamda KMnO₄ bilan aralashtirib, to'yinmagan uglevodorodlarga xos sifat reaksiyalarini (rangsizlanish) kuzatish.",
  'c10-arene': "Benzolning xossalarini eten bilan solishtirish: bromli suv va KMnO₄ bilan reaksiyaga kirishmasligi, katalizator ishtirokida bromlanishi va nitrolanishi.",
  'c10-alcohol': "Etanol, glitserin va fenolning xossalarini Na, CuO, Cu(OH)₂, FeCl₃, bromli suv va NaOH bilan reaksiyalarida solishtirib, sifat reaksiyalarini aniqlash.",

  // Biologiya
  'b6-leaf': "Barg yuzasi, og'izchalar holati, harorat va havo namligini o'zgartirib, barg bug'latadigan suv miqdorini (transpiratsiya) kuzatish.",
  'b6-reproduction': "O'simliklarning urug' bilan (changlanish, urug'lanish, urug' va meva) va vegetativ yo'l bilan ko'payish bosqichlarini ketma-ket ko'rib chiqish.",
  'b7-protozoa': "Oziq miqdori, harorat va boshlang'ich sonni o'zgartirib, infuzoriyalar sonining logistik o'sishini (cheklangan oziqda chegaraga yetishini) kuzatish.",
  'b7-worms': "Chuvalchangni yoki belgisini yassi, yumaloq yoki halqali chuvalchanglar tipiga tasniflash.",
  'b7-molluscs': "Mollyuskani yoki belgisini qorinoyoqlilar, ikki pallalilar yoki boshoyoqlilar sinfiga tasniflash.",
  'b7-arthropods': "Bo'g'imoyoqli hayvonni yoki belgisini qisqichbaqasimonlar, o'rgimchaksimonlar yoki hasharotlar sinfiga tasniflash (oyoqlar soni, mo'ylov, nafas olish).",
  'b7-fish': "Suzgich pufagi hajmi va suv turini o'zgartirib, baliqning o'rtacha zichligi va muallaq turishi (suzish, cho'kish) o'rtasidagi bog'liqlikni topish.",
  'b7-birds': "Qushlarning uchishga moslashuvlarini ko'rib chiqish: patlar, yengil skelet, ko'krak muskullari, havo xaltachalari, to'rt kamerali yurak, ko'payish.",
  'b7-mammals': "Sutemizuvchini yoki belgisini turkumiga (yirtqichlar, kemiruvchilar, tuyoqlilar, primatlar, kitsimonlar) tasniflash.",
  'b8-body': "Organni tegishli organlar sistemasiga (tayanch-harakat, qon aylanish, nafas olish, hazm, ayirish, nerv, endokrin) joylashtirish.",
  'b8-tissues': "To'qimani yoki uning vazifasini epiteliy, biriktiruvchi, muskul yoki nerv to'qimasiga tasniflash.",
  'b8-skeleton': "Bilakni richag sifatida o'rganish: yuk massasi, muskul birikkan joy va yuk masofasini o'zgartirib, muskul kuchini (Fₘ·dₘ = P·L) topish.",
  'b8-kidney': "Ichilgan suv, tuz va havo haroratini o'zgartirib, siydik hajmi va konsentratsiyasini hamda organizmning suv balansini kuzatish (buyrak vazifasi).",
  'b8-reflex': "Reflektor yoyining bosqichlari: retseptor, sezuvchi neyron, nerv markazi, harakatlantiruvchi neyron va effektorni ketma-ket ko'rib chiqish.",
  'b9-mendel': "Ota-onaning genotipini (AA, Aa, aa) tanlab, avlodda genotip va fenotip nisbatini topish; Mendelning birinchi va ikkinchi qonunlari (3 : 1, 1 : 2 : 1).",
  'b9-genetics': "Ikki belgi bo'yicha chatishtirishda (urug' rangi va shakli) fenotip nisbatini topish; mustaqil taqsimlanish (9 : 3 : 3 : 1).",

  // Umumiy tajribalardan ajratilgan mavzular
  'c7-signs': "Gaz ajralishi, cho'kma hosil bo'lishi, rang o'zgarishi va issiqlik ajralishi kabi kimyoviy reaksiya belgilarini turli modda juftliklarida topish.",
  'c8-bases': "Asoslarning xossalari: fenolftaleinni qizartirishi, tuzlar bilan erimaydigan asoslarni cho'ktirishi va kislotani neytrallashi.",
  'c8-acids': "Kislotalarning xossalari: indikator rangi, metallar (Zn bilan vodorod, Cu bilan reaksiya yo'qligi), karbonatlar va asosli oksidlar bilan reaksiyasi.",
  'c8-salts': "Tuzlarning metallar, boshqa tuzlar va kislotalar bilan reaksiyalari; Cl⁻, SO₄²⁻ va CO₃²⁻ ionlarini cho'kma yoki gaz orqali aniqlash.",
  'c9-ionex': "Ion almashinish reaksiyalari qachon oxirigacha borishini (cho'kma, gaz yoki suv hosil bo'lsa) tajribada topish va qisqartirilgan ion tenglamalarini yozish.",
  'c9-metals': "Metallarning aktivlik qatori: kislotalar va tuz eritmalari bilan reaksiyalar orqali qaysi metall qaysi birini siqib chiqarishini aniqlash.",
  'c11-catalyst': "Aktivlanish energiyasi, katalizator ta'siri va haroratni o'zgartirib, reaksiya tezligining necha marta ortishini va energiya profilini kuzatish.",
  'b7-cellcmp': "Hujayra qismini o'simlik, hayvon yoki ikkala hujayraga xos deb tasniflash (devor, xloroplast, vakuola, sentriola, umumiy organoidlar).",
  'b9-organelles': "Yadro, mitoxondriya, ribosoma, endoplazmatik to'r, Golji kompleksi, lizosoma, plastidlar va vakuolaning tuzilishi hamda vazifasini ko'rib chiqish.",
  'b9-chemosynth': "Belgini fotosintez, xemosintez yoki ikkalasiga xos deb tasniflash: energiya manbai, xlorofill, bakteriyalar, quyosh nurisiz yashash.",
};
