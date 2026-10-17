import type { StepDef } from '../StepperLab';

export const STEPS: Record<string, StepDef> = {
  'b8-bonechem': {
    scene: 'bone',
    intro: 'Suyak tarkibida organik va anorganik moddalar borligini ikki tajriba bilan isbotlang.',
    steps: [
      { title: 'Tajriba materiali', text: 'Ikkita bir xil tovuq suyagi olinadi. Birinchisi kislotada, ikkinchisi olovda sinab ko‘riladi.' },
      { title: '1-tajriba: kislotaga solish', text: 'Birinchi suyak 10% li xlorid kislota eritmasiga 1–2 kunga solinadi. Kislota suyakdagi mineral tuzlarni (kalsiy tuzlari) eritib yuboradi, bunda gaz pufakchalari ajraladi.' },
      { title: '1-natija: egiluvchan suyak', text: 'Suyak shaklini saqlaydi, lekin yumshab, tugunga bog‘lash mumkin bo‘lib qoladi. Demak, suyakka qattiqlik beradigan anorganik (mineral) moddalar ketdi, egiluvchanlik beruvchi organik moddalar (ossein) qoldi.' },
      { title: '2-tajriba: olovda kuydirish', text: 'Ikkinchi suyak spirt lampa alangasida qizdiriladi. Organik moddalar (oqsil, yog‘) yonib ketadi, suyak dastlab qorayadi, so‘ng oqaradi.' },
      { title: '2-natija: mo‘rt suyak', text: 'Suyak shaklini saqlaydi, lekin engil bosilsa uvalanib, kukunga aylanadi. Demak, mustahkamlik beruvchi anorganik moddalar qoldi, organik moddalar yonib ketdi.' },
      { title: 'Xulosa', text: 'Suyak taxminan 1/3 organik moddalardan (egiluvchanlik) va 2/3 anorganik moddalardan (qattiqlik) iborat. Yoshlarda organik moddalar ko‘proq, shuning uchun suyaklari egiluvchan; keksalarda anorganik moddalar ko‘p, suyaklari mo‘rt.' },
    ],
  },
  'b9-plasmolysis': {
    scene: 'plasmo',
    intro: 'Piyoz po‘sti hujayralarida plazmoliz va deplazmoliz hodisasini bosqichma-bosqich kuzating.',
    steps: [
      { title: 'Tayyorlash', text: 'Qizil piyozning ustki po‘sti buyum oynachasiga suv tomizib qo‘yiladi va mikroskopda ko‘riladi. Hujayralar turgor holatida: vakuola to‘lib, sitoplazma hujayra devoriga taqalib turadi.' },
      { title: 'Konsentrlangan eritma qo‘shish', text: 'Preparat chetiga 10% li osh tuzi (yoki shakar) eritmasi tomiziladi. Eritma hujayra ichidagi shirasidan quyuqroq (gipertonik).' },
      { title: 'Plazmoliz', text: 'Suv vakuoladan tashqariga chiqadi. Vakuola kichrayadi, sitoplazma hujayra devoridan ajralib, o‘rtaga yig‘iladi. Hujayra devori shaklini saqlaydi. Bu hodisa plazmoliz deyiladi.' },
      { title: 'Suv bilan yuvish', text: 'Preparat chetiga toza suv tomizib, tuz eritmasi yuvib yuboriladi. Endi tashqi muhit hujayra shirasidan suyuqroq (gipotonik).' },
      { title: 'Deplazmoliz', text: 'Suv osmos bilan hujayraga qaytib kiradi, vakuola kengayadi va sitoplazma hujayra devoriga yana taqaladi. Hujayra avvalgi holatiga qaytadi. Bu hodisa deplazmoliz deyiladi.' },
      { title: 'Xulosa', text: 'Plazmoliz — suv chiqib ketishi tufayli sitoplazmaning devordan ajralishi (qaytar jarayon). Deplazmoliz — suv qaytib kirishi bilan hujayra holatining tiklanishi. Bu tirik hujayralarning yarim o‘tkazuvchan membranasi borligini isbotlaydi. Juda uzoq plazmolizda hujayra halok bo‘lishi mumkin.' },
    ],
  },
  'b9-mitosis': {
    intro: 'Hujayra bo‘linishi bosqichlarini birma-bir ko‘ring. Xromosomalar harakatiga e’tibor bering.',
    steps: [
      { title: 'Interfaza', art: 0, text: 'Hujayra bo‘linishga tayyorlanadi: DNK ikki hissa ko‘payadi (replikatsiya). Xromosomalar hali yadro ichida ipsimon holatda.' },
      { title: 'Profaza', art: 1, text: 'Xromosomalar spirallanib qisqaradi va ko‘rinadigan bo‘ladi, har biri ikkita xromatiddan iborat. Yadro qobig‘i yo‘qoladi.' },
      { title: 'Metafaza', art: 2, text: 'Xromosomalar hujayra ekvatoriga tekislanadi, bo‘linish urchug‘i ipchalari ularga birikadi.' },
      { title: 'Anafaza', art: 3, text: 'Xromatidlar ajralib, hujayraning qarama-qarshi qutblariga tortiladi. Har qutbda bir xil xromosomalar to‘plami bo‘ladi.' },
      { title: 'Telofaza', art: 4, text: 'Qutblarda yangi yadro qobig‘lari hosil bo‘ladi, xromosomalar yana yoyiladi. Hujayra o‘rtasida torayish boshlanadi.' },
      { title: 'Sitokinez', art: 5, text: 'Sitoplazma bo‘linadi va ikkita bir xil qiz hujayra hosil bo‘ladi.' },
      { title: 'Meyoz I', text: 'Jinsiy hujayralar hosil bo‘lishida gomologik xromosomalar juftlashib, ajraladi: xromosomalar soni ikki barobar kamayadi.' },
      { title: 'Meyoz II', text: 'Xromatidlar ajraladi. Natijada 4 ta gaploid hujayra hosil bo‘ladi (mitozdan farqli: xromosoma to‘plami yarimiga kam, genetik jihatdan turli).' },
    ],
  },
  'b7-lifecycle': {
    intro: 'Qurbaqaning metamorfozini kuzating, oxirida reptiliyalar bilan solishtiring.',
    steps: [
      { title: 'Ikra', text: 'Urg‘ochi qurbaqa suvga ikra qo‘yadi, ular shilimshiq qobiqqa o‘ralgan.' },
      { title: 'Zoqcha (lichinka)', text: 'Ikradan zoqcha chiqadi: baliqqa o‘xshash, jabra bilan nafas oladi, dumi bilan suzadi.' },
      { title: 'Oyoqlar paydo bo‘lishi', text: 'Avval orqa, keyin old oyoqlar chiqadi; o‘pka rivojlanadi, jabralar yo‘qoladi.' },
      { title: 'Yosh qurbaqa', text: 'Dum so‘riladi, hayvon quruqlikka chiqa boshlaydi.' },
      { title: 'Voyaga yetgan qurbaqa', text: 'O‘pka va teri orqali nafas oladi, ko‘payish uchun yana suvga qaytadi.' },
      { title: 'Reptiliyalar bilan solishtirish', text: 'Reptiliyalar quruqlikda qobiqli tuxum qo‘yadi va metamorfoz o‘tmaydi: tuxumdan mayda nusxa chiqadi.' },
    ],
  },
  'b8-development': {
    intro: 'Odam embrional rivojlanishining asosiy bosqichlari.',
    steps: [
      { title: 'Urug‘lanish', text: 'Sperma tuxum hujayra bilan qo‘shilib, bitta hujayra — zigota hosil qiladi.' },
      { title: 'Bo‘linish (maydalanish)', text: 'Zigota tez-tez mitoz bilan bo‘linib, hujayralar sonini oshiradi.' },
      { title: 'Blastula', text: 'Hujayralar ichi bo‘sh sharcha shaklini oladi.' },
      { title: 'Gastrula', text: 'Ikki-uch qavat hujayralar hosil bo‘ladi: kelajakdagi to‘qimalar poydevori.' },
      { title: 'Organlar shakllanishi', text: 'Nerv nayi, yurak va boshqa organlar rivojlana boshlaydi.' },
      { title: 'Homila o‘sishi', text: 'Organlar takomillashadi, homila onasi orqali oziqlanadi va o‘sadi.' },
      { title: 'Tug‘ilish va postembrional davr', text: 'Bola tug‘iladi, keyin o‘sish, balog‘at va qarilik bosqichlari davom etadi.' },
    ],
  },
  'b9-metabolism': {
    intro: 'Glyukoza energiyasi ATF ga qanday aylanishi.',
    steps: [
      { title: 'Ozuqa moddalari', text: 'Organizm ovqatdan glyukoza kabi energiyaga boy moddalarni oladi.' },
      { title: 'Glikoliz', text: 'Sitoplazmada glyukoza kislorodsiz parchalanib, oz miqdorda ATF (2 ta) va piruvat hosil qiladi.' },
      { title: 'Krebs sikli', text: 'Kislorod ishtirokida piruvat mitoxondriyada parchalanadi, CO₂ ajraladi, elektron tashuvchilar to‘planadi.' },
      { title: 'Elektron tashish zanjiri', text: 'Mitoxondriya membranasida elektronlar kislorodga uzatiladi va ko‘p ATF hosil bo‘ladi, kislorod suvga aylanadi.' },
      { title: 'Umumiy natija', text: 'Aerob nafas olishda 1 glyukozadan taxminan 30–38 ATF hosil bo‘ladi: bu anaerob jarayondan ancha ko‘p.' },
      { title: 'Fotosintez bilan bog‘liqlik', text: 'Fotosintez CO₂ va suvdan glyukoza hosil qiladi, nafas olish esa uni parchalaydi. Ikki jarayon bir-birini to‘ldiradi.' },
    ],
  },
  'b6-reproduction': {
    intro: 'Gulli o‘simliklarning urug‘ yordamida ko‘payishi va vegetativ ko‘payish bosqichlarini kuzating.',
    steps: [
      { title: 'Changlanish', text: 'Changchidagi chang urug‘chining tumshuqchasiga tushadi. Changlanishda hasharotlar, shamol yoki suv yordam beradi.' },
      { title: 'Chang naychasi', text: 'Tumshuqchadagi chang donachasi unib, urug‘chi bo‘ylab urug‘kurtakka qarab naycha hosil qiladi.' },
      { title: 'Urug‘lanish', text: 'Spermiylar urug‘kurtakka yetib, tuxum hujayra bilan qo‘shiladi. Yopiq urug‘lilarda qo‘sh urug‘lanish ro‘y beradi.' },
      { title: 'Urug‘ va meva hosil bo‘lishi', text: 'Urug‘kurtakdan urug‘, tugunchadan meva rivojlanadi. Urug‘ ichida yangi o‘simlik murtagi bo‘ladi.' },
      { title: 'Urug‘larning tarqalishi', text: 'Urug‘lar shamol, suv, hayvonlar yordamida yoki o‘zi sochilib tarqaladi. Bu o‘simlik yangi joylarni egallashiga yordam beradi.' },
      { title: 'Unib chiqish', text: 'Namlik, iliqlik va havo yetarli bo‘lsa, urug‘ unib, yangi o‘simlik hosil qiladi.' },
      { title: 'Vegetativ ko‘payish', text: 'O‘simlik vegetativ a’zolari orqali ham ko‘payadi: qalamcha, ildizpoya, piyoz, tuganak, payvand. Bunda ona o‘simlikning belgilari saqlanadi.' },
      { title: 'Solishtirish', text: 'Urug‘ bilan ko‘payishda nasl belgilarning yangi kombinatsiyasiga ega bo‘ladi. Vegetativ ko‘payishda esa nasl ona o‘simlikning aniq nusxasi bo‘ladi.' },
    ],
  },
  'b8-reflex': {
    intro: 'Reflektor yoyi: ta’sirdan javobgacha signal yo‘li (masalan, qo‘lni issiq narsadan tortib olish).',
    steps: [
      { title: 'Retseptor', text: 'Terida joylashgan issiqlik retseptorlari ta’sirni sezib, qo‘zg‘aladi va nerv impulsini hosil qiladi.' },
      { title: 'Sezuvchi neyron', text: 'Impuls sezuvchi (afferent) neyron bo‘ylab orqa miyaga uzatiladi.' },
      { title: 'Nerv markazi (orqa miya)', text: 'Orqa miyada signal qayta ishlanadi va miyaning qarorini kutmasdan javob buyrug‘i hosil bo‘ladi.' },
      { title: 'Harakatlantiruvchi neyron', text: 'Buyruq harakatlantiruvchi (efferent) neyron orqali mushakka yuboriladi.' },
      { title: 'Effektor (mushak)', text: 'Mushak qisqaradi va qo‘l ta’sir manbaidan tortib olinadi. Bu soniyaning juda kichik qismida ro‘y beradi.' },
      { title: 'Miyaga xabar', text: 'Impuls bosh miyaga ham yetib boradi: og‘riq va issiqni anglaymiz, lekin qo‘l allaqachon tortib olingan bo‘ladi.' },
    ],
  },
  'b11-geneng': {
    intro: 'Genetik muhandislikda yangi gen bakteriyaga kiritiladi (masalan, insulin uchun).',
    steps: [
      { title: 'Kerakli genni ajratish', text: 'Odam DNKsidan insulin genini ajratib olishadi.' },
      { title: 'Restriktaza bilan kesish', text: 'Restriksiya fermenti genni ham, bakteriya plazmidasini ham aniq joyidan kesadi.' },
      { title: 'Ligaza bilan biriktirish', text: 'Ligaza fermenti gen bo‘lagini plazmidaga tikadi — rekombinant DNK hosil bo‘ladi.' },
      { title: 'Bakteriyaga kiritish', text: 'Plazmida bakteriya hujayrasiga kiritiladi (transformatsiya).' },
      { title: 'Klonlash', text: 'Bakteriyalar tez bo‘linib, gen nusxalari soni oshadi.' },
      { title: 'Oqsil sintezi', text: 'Bakteriyalar insulin oqsilini sintez qila boshlaydi. Uni ajratib tozalab, dori sifatida ishlatishadi.' },
    ],
  },
  'b11-ontogenesis': {
    intro: 'Individual rivojlanish (ontogenez) bosqichlari.',
    steps: [
      { title: 'Zigota', text: 'Urug‘langan tuxum hujayra — yangi organizmning boshlanishi.' },
      { title: 'Bo‘linish', text: 'Hujayralar soni ko‘payadi, hajmi o‘zgarmaydi.' },
      { title: 'Gastrulyatsiya', text: 'Uch kurtak varag‘i (ekto-, mezo-, endoderma) hosil bo‘ladi.' },
      { title: 'Organogenez', text: 'Kurtak varaqlaridan to‘qimalar va organlar rivojlanadi.' },
      { title: 'O‘sish va yetilish', text: 'Organizm o‘sadi, jinsiy yetiladi.' },
      { title: 'Qarish', text: 'Hayotiy jarayonlar sekinlashadi va organizm nobud bo‘ladi.' },
    ],
  },
  'b11-immune': {
    intro: 'Immun tizim begona moddaga qanday javob beradi?',
    steps: [
      { title: 'Antigenning kirishi', text: 'Organizmga bakteriya yoki virus kabi begona modda — antigen kiradi.' },
      { title: 'Makrofag yutadi', text: 'Makrofaglar antigenni yutib, uning qismini o‘z yuzasida ko‘rsatadi.' },
      { title: 'T-limfotsit faollashadi', text: 'T-limfotsitlar antigenni taniydi va immun javobni boshqaradi.' },
      { title: 'B-limfotsit antitela chiqaradi', text: 'B-limfotsitlar bu antigenga mos antitelalar ishlab chiqaradi.' },
      { title: 'Antigen zararsizlanadi', text: 'Antitelalar antigenga yopishib, uni zararsizlantiradi va yo‘q qilishga yordam beradi.' },
      { title: 'Xotira hujayralari', text: 'Xotira hujayralari qoladi: bu antigen yana kirsa, javob tez bo‘ladi. Vaksina shu printsipga asoslangan.' },
    ],
  },
  'b11-virus': {
    intro: 'Virus va bakteriofagning ko‘payish sikli.',
    steps: [
      { title: 'Yopishish', text: 'Virus yoki faj hujayra yuzasidagi maxsus retseptorga yopishadi.' },
      { title: 'Kirish', text: 'Virus genetik materialini (DNK yoki RNK) hujayraga kiritadi.' },
      { title: 'Replikatsiya va sintez', text: 'Hujayra virus genomini nusxalab, virus oqsillarini sintez qila boshlaydi.' },
      { title: 'Yig‘ilish', text: 'Yangi virus zarralari yig‘iladi.' },
      { title: 'Chiqish', text: 'Hujayra parchalanadi (lizis) va yangi viruslar boshqa hujayralarni zararlaydi.' },
    ],
  },
  'c10-ester': {
    intro: 'Murakkab efirlar (esterifikatsiya) va yog‘larning hosil bo‘lishi.',
    steps: [
      { title: 'Kislota va spirt', text: 'Karbon kislota (masalan, sirka) va spirt (etanol) aralashtiriladi.' },
      { title: 'Katalizator', text: 'Konsentrlangan H₂SO₄ reaksiyani tezlatadi va suvni tortadi.' },
      { title: 'Qizdirish', text: 'Aralashma qizdirilganda –COOH va –OH guruhlaridan suv ajraladi.' },
      { title: 'Murakkab efir', text: 'Mevaga xos yoqimli hidli efir (etilatsetat) hosil bo‘ladi: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O.' },
      { title: 'Yog‘lar', text: 'Yog‘lar — glitserin va uchta yuqori yog‘ kislotasining murakkab efirlari.' },
      { title: 'Sovunlanish', text: 'Yog‘ ishqor bilan qizdirilsa, glitserin va yog‘ kislotasining tuzi — sovun hosil bo‘ladi.' },
    ],
  },
  'c11-redox': {
    intro: 'Oksidlanish-qaytarilish: elektronlar qanday ko‘chadi (Zn va Cu²⁺ misolida).',
    steps: [
      { title: 'Oksidlanish darajalari', text: 'Zn⁰ + Cu²⁺SO₄ → Zn²⁺SO₄ + Cu⁰. Reaksiyada ikki elementning oksidlanish darajasi o‘zgaradi.' },
      { title: 'Oksidlanish', text: 'Zn → Zn²⁺ + 2e⁻: rux elektron beradi, oksidlanadi, ya’ni qaytaruvchi.' },
      { title: 'Qaytarilish', text: 'Cu²⁺ + 2e⁻ → Cu: mis ioni elektron oladi, qaytariladi, ya’ni oksidlovchi.' },
      { title: 'Elektron balans', text: 'Berilgan elektronlar soni qabul qilinganiga teng bo‘lishi shart: 2e⁻ = 2e⁻.' },
      { title: 'Natija', text: 'Rux plastinkasida qizil-mis qatlami hosil bo‘ladi, eritmaning ko‘k rangi susayadi.' },
    ],
  },
};
