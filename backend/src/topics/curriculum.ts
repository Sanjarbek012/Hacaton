import { Subject } from './topic.entity';

/** Oddiy satr = mavzu (simulyatsiya hali yo'q). [nom, simKey] = ishlaydigan simulyatsiya. */
export type Item = string | [string, string];

export const CURRICULUM: Record<Subject, Record<number, Item[]>> = {
  physics: {
    7: [
      "Fizik kattaliklarni o'lchash", "Mexanik harakat va tezlik", 'Massa va zichlik',
      'Kuch va kuchlarning turlari', 'Ishqalanish kuchi', 'Bosim', 'Arximed qonuni',
      'Ish, quvvat va energiya', 'Oddiy mexanizmlar',
    ],
    8: [
      'Issiqlik harakati va temperatura', 'Ichki energiya', 'Issiqlik miqdori',
      "Agregat holatlarning o'zgarishi", 'Elektr zaryadi', ['Om qonuni', 'ohm'],
      'Ketma-ket va parallel ulanish', 'Tokning ishi va quvvati', 'Magnit maydon',
      "Yorug'likning qaytishi va sinishi",
    ],
    9: [
      'Tekis tezlanuvchan harakat', ['Erkin tushish', 'free-fall'], 'Nyuton qonunlari',
      'Butun olam tortishish qonuni', 'Impuls va impulsning saqlanishi',
      ['Matematik mayatnik tebranishlari', 'pendulum'], "Mexanik to'lqinlar", 'Tovush',
      'Elektromagnit induksiya',
    ],
    10: [
      'Egri chiziqli harakat', 'Gorizontga burchak ostida otilgan jism', 'Dinamika',
      'Mexanik energiyaning saqlanishi', 'Molekulyar-kinetik nazariya', 'Ideal gaz qonunlari',
      'Termodinamika qonunlari', 'Elektrostatika', 'Kondensatorlar', "O'zgarmas tok qonunlari",
    ],
    11: [
      'Elektromagnit tebranishlar', "O'zgaruvchan tok", "Elektromagnit to'lqinlar",
      'Geometrik optika', "Yorug'lik interferensiyasi va difraksiyasi",
      'Maxsus nisbiylik nazariyasi asoslari', 'Fotoeffekt', 'Atom tuzilishi',
      'Atom yadrosi va radioaktivlik', 'Elementar zarralar',
    ],
  },
  chemistry: {
    7: [
      'Kimyo fani va modda', 'Toza moddalar va aralashmalar', 'Aralashmalarni ajratish usullari',
      'Atom va molekula', 'Kimyoviy element va belgilar', 'Kimyoviy formulalar',
      ['Kimyoviy reaksiyalar belgilari', 'mixing'], 'Kislorod', 'Vodorod', 'Suv va eritmalar',
    ],
    8: [
      'Oksidlar', ['Asoslar', 'mixing'], ['Kislotalar', 'mixing'], ['Tuzlar', 'mixing'], 'Davriy qonun va davriy jadval',
      'Atom tuzilishi', "Kimyoviy bog'lanish turlari", 'Modda miqdori va mol', 'Molyar hajm',
    ],
    9: [
      'Elektrolitik dissotsiatsiya', ['Ion almashinish reaksiyalari', 'mixing'],
      ['Neytrallanish reaksiyasi va titrlash', 'titration'], 'Galogenlar',
      'Oltingugurt va uning birikmalari', 'Azot va ammiak', 'Fosfor', 'Uglerod va kremniy',
      ['Metallar', 'mixing'], ['Kimyoviy reaksiya tezligi', 'reaction-rate'], 'Kimyoviy muvozanat',
    ],
    10: [
      'Organik kimyoga kirish', 'Alkanlar', 'Alkenlar va alkinlar', 'Aromatik uglevodorodlar',
      'Spirtlar va fenollar', 'Aldegidlar', 'Karbon kislotalar', "Murakkab efirlar va yog'lar",
      'Uglevodlar', 'Aminlar va aminokislotalar', 'Oqsillar', 'Polimerlar',
    ],
    11: [
      'Atom orbitallari', 'Termokimyo', ['Katalizatorlar va reaksiya tezligi', 'reaction-rate'],
      'Eritmalar va konsentratsiya', 'pH va gidroliz', 'Oksidlanish-qaytarilish reaksiyalari',
      'Elektroliz', 'Galvanik elementlar', 'Metallar korroziyasi', 'Kompleks birikmalar',
    ],
  },
  biology: {
    5: [
      'Biologiya — tirik tabiat haqidagi fan', 'Tirik organizmlarning xossalari',
      'Hujayra — tirik organizmning asosi', 'Mikroskop bilan ishlash', 'Bakteriyalar',
      "Zamburug'lar", "O'simliklar olami", 'Hayvonlar olami', 'Yashash muhiti',
    ],
    6: [
      "O'simliklarning ildizi", 'Poya va barg', ['Fotosintez', 'photosynthesis'],
      "Gul, meva va urug'", "O'simliklarning ko'payishi", "Suvo'tlar, moxlar va paporotniklar",
      "Ochiq urug'lilar va yopiq urug'lilar",
      ["O'simlik va hayvon hujayrasining tuzilishi", 'cell'],
    ],
    7: [
      'Hayvonlar sistematikasi', 'Sodda hayvonlar', 'Chuvalchanglar', 'Yumshoqtanlilar',
      "Bo'g'imoyoqlilar", 'Baliqlar', 'Amfibiyalar va reptiliyalar', 'Qushlar',
      'Sutemizuvchilar', 'Hayvonlar evolyutsiyasi',
    ],
    8: [
      'Odam organizmi: umumiy tuzilish', "To'qimalar", 'Tayanch-harakat sistemasi',
      'Qon va qon aylanish', 'Nafas olish sistemasi', 'Ovqat hazm qilish',
      ['Moddalar almashinuvi va osmos', 'osmosis'], 'Ayirish sistemasi', 'Nerv sistemasi',
      'Sezgi organlari', 'Endokrin sistema', "Ko'payish va rivojlanish",
    ],
    9: [
      'Hayot darajalari', 'Hujayra nazariyasi', ['Hujayra organoidlari', 'cell'],
      "Hujayra bo'linishi: mitoz va meyoz", 'Modda va energiya almashinuvi',
      ['Fotosintez va xemosintez', 'photosynthesis'], "Irsiyat va o'zgaruvchanlik",
      'Mendel qonunlari', 'Genetika asoslari',
    ],
    10: [
      "Evolyutsiya: Darvin ta'limoti", 'Tur va turlanish', 'Populyatsiya genetikasi', 'Seleksiya',
      'Ekologiya asoslari', 'Ekosistema va biogeotsenoz', 'Biosfera',
      "Insonning tabiatga ta'siri", 'Odamning kelib chiqishi',
    ],
    11: [
      'Molekulyar biologiya', 'DNK va RNK', 'Oqsil biosintezi', 'Genetik muhandislik',
      'Biotexnologiya', 'Ontogenez', 'Immunitet', 'Virus va fagelar',
      'Mikroorganizmlar biotexnologiyada', 'Hayot evolyutsiyasi',
    ],
  },
};
