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
};
