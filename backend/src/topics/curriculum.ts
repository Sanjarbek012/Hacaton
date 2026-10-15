import { Subject } from './topic.entity';

/** Oddiy satr = mavzu (simulyatsiya hali yo'q). [nom, simKey] = ishlaydigan simulyatsiya. */
export type Item = string | [string, string];

export const CURRICULUM: Record<Subject, Record<number, Item[]>> = {
  physics: {
    7: [
      ["Fizik kattaliklarni o'lchash", 'p7-measure'], ['Mexanik harakat va tezlik', 'p7-motion'], ['Massa va zichlik', 'p7-density'],
      ['Kuch va kuchlarning turlari', 'p7-force'], ['Ishqalanish kuchi', 'p7-friction'], ['Bosim', 'p7-pressure'], ['Arximed qonuni', 'p7-archimedes'],
      ['Ish, quvvat va energiya', 'p7-energy'], ['Oddiy mexanizmlar', 'p7-lever'],
    ],
    8: [
      ['Issiqlik harakati va temperatura', 'p8-heat-motion'], ['Ichki energiya', 'p8-internal'], ['Issiqlik miqdori', 'p8-heat'],
      ["Agregat holatlarning o'zgarishi", 'p8-phase'], ['Elektr zaryadi', 'p8-charge'], ['Om qonuni', 'ohm'],
      ['Ketma-ket va parallel ulanish', 'p8-circuit'], ['Tokning ishi va quvvati', 'p8-power'], ['Magnit maydon', 'p8-magnet'],
      ["Yorug'likning qaytishi va sinishi", 'p8-refraction'],
    ],
    9: [
      ['Tekis tezlanuvchan harakat', 'p9-accel'], ['Erkin tushish', 'free-fall'], ['Nyuton qonunlari', 'p9-newton'],
      ['Butun olam tortishish qonuni', 'p9-gravity'], ['Impuls va impulsning saqlanishi', 'p9-momentum'],
      ['Matematik mayatnik tebranishlari', 'pendulum'], ["Mexanik to'lqinlar", 'p9-waves'], ['Tovush', 'p9-sound'],
      ['Elektromagnit induksiya', 'p9-induction'],
    ],
    10: [
      ['Egri chiziqli harakat', 'p10-circular'], ['Gorizontga burchak ostida otilgan jism', 'p10-projectile'], ['Dinamika', 'p10-dynamics'],
      ['Mexanik energiyaning saqlanishi', 'p10-energy'], ['Molekulyar-kinetik nazariya', 'p10-mkt'], ['Ideal gaz qonunlari', 'p10-gaslaw'],
      ['Termodinamika qonunlari', 'p10-thermo'], ['Elektrostatika', 'p10-electro'], ['Kondensatorlar', 'p10-capacitor'], ["O'zgarmas tok qonunlari", 'p10-emf'],
    ],
    11: [
      ['Elektromagnit tebranishlar', 'p11-lc'], ["O'zgaruvchan tok", 'p11-ac'], ["Elektromagnit to'lqinlar", 'p11-emwave'],
      ['Geometrik optika', 'p11-lens'], ["Yorug'lik interferensiyasi va difraksiyasi", 'p11-interference'],
      ['Maxsus nisbiylik nazariyasi asoslari', 'p11-relativity'], ['Fotoeffekt', 'p11-photoeffect'], ['Atom tuzilishi', 'p11-atom'],
      ['Atom yadrosi va radioaktivlik', 'p11-nucleus'], ['Elementar zarralar', 'p11-zoo'],
    ],
  },
  chemistry: {
    7: [
      ['Kimyo fani va modda', 'c7-substance'], ['Toza moddalar va aralashmalar', 'c7-mixtures'], ['Aralashmalarni ajratish usullari', 'c7-separation'],
      ['Atom va molekula', 'c7-atom'], ['Kimyoviy element va belgilar', 'c7-element'], ['Kimyoviy formulalar', 'c7-formula'],
      ['Kimyoviy reaksiyalar belgilari', 'c7-signs'], ['Kislorod', 'c7-oxygen'], ['Vodorod', 'c7-hydrogen'], ['Suv va eritmalar', 'c7-solution'],
    ],
    8: [
      ['Oksidlar', 'c8-oxide'], ['Asoslar', 'c8-bases'], ['Kislotalar', 'c8-acids'], ['Tuzlar', 'c8-salts'], ['Davriy qonun va davriy jadval', 'c8-periodic'],
      ['Atom tuzilishi', 'c8-atomstruct'], ["Kimyoviy bog'lanish turlari", 'c8-bond'], ['Modda miqdori va mol', 'c8-mole'], ['Molyar hajm', 'c8-molvol'],
    ],
    9: [
      ['Elektrolitik dissotsiatsiya', 'c9-conduct'], ['Ion almashinish reaksiyalari', 'c9-ionex'],
      ['Neytrallanish reaksiyasi va titrlash', 'titration'], ['Galogenlar', 'c9-halogens'],
      ['Oltingugurt va uning birikmalari', 'c9-sulfur'], ['Azot va ammiak', 'c9-ammonia'], ['Fosfor', 'c9-phosphorus'], ['Uglerod va kremniy', 'c9-carbon'],
      ['Metallar', 'c9-metals'], ['Kimyoviy reaksiya tezligi', 'reaction-rate'], ['Kimyoviy muvozanat', 'c9-equilibrium'],
    ],
    10: [
      ['Organik kimyoga kirish', 'c10-organic'], ['Alkanlar', 'c10-alkane'], ['Alkenlar va alkinlar', 'c10-alkene'], ['Aromatik uglevodorodlar', 'c10-arene'],
      ['Spirtlar va fenollar', 'c10-alcohol'], ['Aldegidlar', 'c10-aldehyde'], ['Karbon kislotalar', 'c10-carboxylic'], ["Murakkab efirlar va yog'lar", 'c10-ester'],
      ['Uglevodlar', 'c10-carbs'], ['Aminlar va aminokislotalar', 'c10-amino'], ['Oqsillar', 'c10-protein'], ['Polimerlar', 'c10-polymer'],
    ],
    11: [
      ['Atom orbitallari', 'c11-orbitals'], ['Termokimyo', 'c11-thermochem'], ['Katalizatorlar va reaksiya tezligi', 'c11-catalyst'],
      ['Eritmalar va konsentratsiya', 'c11-molarity'], ['pH va gidroliz', 'c11-ph'], ['Oksidlanish-qaytarilish reaksiyalari', 'c11-redox'],
      ['Elektroliz', 'c11-electrolysis'], ['Galvanik elementlar', 'c11-galvanic'], ['Metallar korroziyasi', 'c11-corrosion'], ['Kompleks birikmalar', 'c11-complex'],
    ],
  },
  biology: {
    5: [
      ['Biologiya — tirik tabiat haqidagi fan', 'b5-living'], ['Tirik organizmlarning xossalari', 'b5-properties'],
      ['Hujayra — tirik organizmning asosi', 'cell'], ['Mikroskop bilan ishlash', 'b5-microscope'], ['Bakteriyalar', 'b5-bacteria'],
      ["Zamburug'lar", 'b5-fungi'], ["O'simliklar olami", 'b5-plants'], ['Hayvonlar olami', 'b5-animals'], ['Yashash muhiti', 'b5-habitat'],
    ],
    6: [
      ["O'simliklarning ildizi", 'b6-root'], ['Poya va barg', 'b6-leaf'], ['Fotosintez', 'photosynthesis'],
      ["Gul, meva va urug'", 'b6-seed'], ["O'simliklarning ko'payishi", 'b6-reproduction'], ["Suvo'tlar, moxlar va paporotniklar", 'b6-lower'],
      ["Ochiq urug'lilar va yopiq urug'lilar", 'b6-seedplants'],
      ["O'simlik va hayvon hujayrasining tuzilishi", 'b7-cellcmp'],
    ],
    7: [
      ['Hayvonlar sistematikasi', 'b7-systematics'], ['Sodda hayvonlar', 'b7-protozoa'], ['Chuvalchanglar', 'b7-worms'], ['Yumshoqtanlilar', 'b7-molluscs'],
      ["Bo'g'imoyoqlilar", 'b7-arthropods'], ['Baliqlar', 'b7-fish'], ['Amfibiyalar va reptiliyalar', 'b7-lifecycle'], ['Qushlar', 'b7-birds'],
      ['Sutemizuvchilar', 'b7-mammals'], ['Hayvonlar evolyutsiyasi', 'b7-evolution'],
    ],
    8: [
      ['Odam organizmi: umumiy tuzilish', 'b8-body'], ["To'qimalar", 'b8-tissues'], ['Tayanch-harakat sistemasi', 'b8-skeleton'],
      ['Qon va qon aylanish', 'b8-heart'], ['Nafas olish sistemasi', 'b8-lungs'], ['Ovqat hazm qilish', 'b8-enzyme'],
      ['Moddalar almashinuvi va osmos', 'osmosis'], ['Ayirish sistemasi', 'b8-kidney'], ['Nerv sistemasi', 'b8-reflex'],
      ['Sezgi organlari', 'b8-eye'], ['Endokrin sistema', 'b8-glucose'], ["Ko'payish va rivojlanish", 'b8-development'],
    ],
    9: [
      ['Hayot darajalari', 'b9-levels'], ['Hujayra nazariyasi', 'b9-celltheory'], ['Hujayra organoidlari', 'b9-organelles'],
      ["Hujayra bo'linishi: mitoz va meyoz", 'b9-mitosis'], ['Modda va energiya almashinuvi', 'b9-metabolism'],
      ['Fotosintez va xemosintez', 'b9-chemosynth'], ["Irsiyat va o'zgaruvchanlik", 'b9-variation'],
      ['Mendel qonunlari', 'b9-mendel'], ['Genetika asoslari', 'b9-genetics'],
    ],
    10: [
      ["Evolyutsiya: Darvin ta'limoti", 'b10-selection'], ['Tur va turlanish', 'b10-speciation'], ['Populyatsiya genetikasi', 'b10-popgen'], ['Seleksiya', 'b10-breeding'],
      ['Ekologiya asoslari', 'b10-ecology'], ['Ekosistema va biogeotsenoz', 'b10-pyramid'], ['Biosfera', 'b10-biosphere'],
      ["Insonning tabiatga ta'siri", 'b10-greenhouse'], ['Odamning kelib chiqishi', 'b10-human-origin'],
    ],
    11: [
      ['Molekulyar biologiya', 'b11-molbio'], ['DNK va RNK', 'b11-dnarna'], ['Oqsil biosintezi', 'b11-protein'], ['Genetik muhandislik', 'b11-geneng'],
      ['Biotexnologiya', 'b11-ferment'], ['Ontogenez', 'b11-ontogenesis'], ['Immunitet', 'b11-immune'], ['Virus va fagelar', 'b11-virus'],
      ['Mikroorganizmlar biotexnologiyada', 'b11-microbio'], ['Hayot evolyutsiyasi', 'b11-life-evolution'],
    ],
  },
};
