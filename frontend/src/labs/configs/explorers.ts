import type { ExploreDef } from '../ExplorerLab';

export const EXPLORERS: Record<string, ExploreDef> = {
  'p11-zoo': {
    intro: 'Elementar zarralar oilalarini birma-bir ko‘rib chiqing.',
    items: [
      { title: 'Kvarklar', sub: 'u, d, s, c, b, t', text: 'Kvarklar — proton va neytronlarni tashkil etuvchi zarralar. Ular erkin holda uchramaydi. Proton — uud, neytron — udd kvarklardan iborat.' },
      { title: 'Leptonlar', sub: 'elektron, muon, tau, neytrinolar', text: 'Leptonlar kuchli o‘zaro ta’sirda qatnashmaydi. Elektron — atomning tashqi qismidagi zarra. Neytrinolar deyarli massasiz va materiya bilan juda kam ta’sirlashadi.' },
      { title: 'Bozonlar', sub: 'foton, gluon, W va Z, Xiggs', text: 'Bozonlar — o‘zaro ta’sir tashuvchilari. Foton elektromagnit, gluon kuchli, W va Z bozonlar kuchsiz ta’sirni uzatadi. Xiggs bozoni zarralarga massa berish mexanizmi bilan bog‘liq.' },
      { title: 'Proton va neytron', sub: 'barionlar', text: 'Uch kvarkdan tuzilgan zarralar barionlar deyiladi. Proton musbat zaryadli, neytron neytral. Ular atom yadrosini tashkil qiladi.' },
      { title: 'Antizarralar', sub: 'pozitron, antiproton', text: 'Har bir zarraning massasi bir xil, zaryadi teskari bo‘lgan antizarrasi bor. Zarra va antizarra uchrashsa, annigilyatsiya bo‘lib, energiya (fotonlar) ajraladi.' },
      { title: 'Fundamental ta’sirlar', sub: 'to‘rt xil', text: 'Tabiatda to‘rtta fundamental o‘zaro ta’sir bor: tortishish, elektromagnit, kuchli va kuchsiz. Kuchli ta’sir yadroni yaxlit ushlab turadi.' },
    ],
  },
  'c9-sulfur': {
    intro: 'Oltingugurt va uning muhim birikmalarini ko‘rib chiqing.',
    items: [
      { title: 'Oltingugurt', sub: 'S, sariq kristall modda', text: 'Tabiatda sof holda va sulfidlar, sulfatlar tarkibida uchraydi. Suvda erimaydi, uglerod sulfidda eriydi.' },
      { title: 'Allotropik shakllar', sub: 'rombik, monoklin, plastik', text: 'Oltingugurt bir necha allotropik shaklda bo‘ladi. Eng barqarori — rombik. Suyuq oltingugurtni suvga quyilsa, plastik oltingugurt hosil bo‘ladi.' },
      { title: 'Yonishi', sub: 'S + O₂ → SO₂', text: 'Oltingugurt havoda ko‘k alanga bilan yonib, o‘tkir hidli oltingugurt(IV) oksid (SO₂) hosil qiladi.' },
      { title: 'Metallar bilan', sub: 'Fe + S → FeS', text: 'Temir va oltingugurt aralashmasi qizdirilsa, temir(II) sulfid hosil bo‘ladi. Bu kimyoviy reaksiya, chunki yangi modda paydo bo‘ladi.' },
      { title: 'Vodorod sulfid', sub: 'H₂S', text: 'Chirigan tuxum hidli zaharli gaz. Suvdagi eritmasi kuchsiz sulfid kislota.' },
      { title: 'Sulfat kislota', sub: 'H₂SO₄', text: 'Eng muhim sanoat kislotalaridan biri. Konsentrlangan H₂SO₄ suvni kuchli tortadi va organik moddalarni ko‘mirlantiradi. Suyultirganda kislotani suvga oz-ozdan quyish kerak.' },
    ],
  },
  'c9-phosphorus': {
    intro: 'Fosforning xossalari va ahamiyati bilan tanishing.',
    items: [
      { title: 'Allotroplar', sub: 'oq va qizil fosfor', text: 'Oq fosfor zaharli va havoda o‘z-o‘zidan alangalanadi, shuning uchun suv ostida saqlanadi. Qizil fosfor barqaror va kam zaharli.' },
      { title: 'Yonishi', sub: '4P + 5O₂ → 2P₂O₅', text: 'Fosfor yonganda oq tutun — fosfor(V) oksid hosil bo‘ladi.' },
      { title: 'Fosfat kislota', sub: 'H₃PO₄', text: 'P₂O₅ suv bilan fosfat kislota beradi. U uch negizli kislota.' },
      { title: 'O‘g‘itlar', sub: 'superfosfat', text: 'Fosfor o‘simliklar uchun zarur element. Fosforli o‘g‘itlar hosildorlikni oshiradi.' },
      { title: 'Biologik rol', sub: 'DNK, ATF, suyak', text: 'Fosfor DNK, ATF molekulalari va suyak to‘qimasi tarkibiga kiradi.' },
    ],
  },
  'c10-amino': {
    intro: 'Aminlar va aminokislotalarning xususiyatlarini o‘rganing.',
    items: [
      { title: 'Aminlar', sub: 'R–NH₂', text: 'Aminlar ammiakning hosilalari. Ularda azot atomining erkin elektron jufti bor, shuning uchun ular asos xossasini namoyon qiladi.' },
      { title: 'Metilamin', sub: 'CH₃NH₂', text: 'Eng oddiy amin, o‘tkir hidli gaz. Suvda yaxshi eriydi va eritmasi ishqoriy.' },
      { title: 'Aminokislotalar', sub: 'H₂N–CHR–COOH', text: 'Molekulada ham amino guruh (–NH₂), ham karboksil guruh (–COOH) bor. Shuning uchun ular amfoter: kislota bilan ham, asos bilan ham reaksiyaga kirishadi.' },
      { title: 'Glitsin', sub: 'eng oddiy aminokislota', text: 'H₂N–CH₂–COOH. Qattiq holda ichki tuz (zvitter-ion) sifatida mavjud.' },
      { title: 'Peptid bog‘', sub: '–CO–NH–', text: 'Ikki aminokislota karboksil va amino guruhlari orasida suv ajralib, peptid bog‘ hosil qiladi. Ko‘p aminokislotalar birikib oqsilni beradi.' },
    ],
  },
  'c10-organic': {
    intro: 'Organik kimyoning asosiy tushunchalarini birma-bir ko‘rib chiqing.',
    items: [
      { title: 'Organik kimyo nimani o‘rganadi?', sub: 'uglerod birikmalari', text: 'Organik kimyo uglerod birikmalarini (karbonat, karbid, uglerod oksidlaridan tashqari) va ularning o‘zgarishlarini o‘rganadi. Barcha tirik organizmlar organik moddalardan tuzilgan.' },
      { title: 'Uglerodning valentligi', sub: 'C — IV', text: 'Organik birikmalarda uglerod to‘rt valentli: har bir atom to‘rtta kovalent bog‘ hosil qiladi. Uglerod atomlari bir-biri bilan zanjir va halqa hosil qila oladi.' },
      { title: 'Butlerov nazariyasi', sub: '1861', text: 'Moddaning xossalari faqat tarkibiga emas, atomlarning o‘zaro bog‘lanish tartibiga (kimyoviy tuzilishiga) ham bog‘liq. Tuzilishni bilib, moddaning xossalarini oldindan aytish mumkin.' },
      { title: 'Izomeriya', sub: 'C₄H₁₀: butan va izobutan', text: 'Tarkibi bir xil, tuzilishi turlicha moddalar izomerlar deyiladi. Butan (qaynash harorati taxminan −0,5 °C) va izobutan (taxminan −11,7 °C) ning formulasi bir xil, xossalari esa har xil.' },
      { title: 'Gomologik qator', sub: 'CₙH₂ₙ₊₂', text: 'Tuzilishi va kimyoviy xossalari o‘xshash, tarkibi bir yoki bir necha CH₂ guruhiga farq qiladigan moddalar gomologlar deyiladi. CH₂ — gomologik ayirma.' },
      { title: 'Uglerod zanjirlari', sub: 'tarmoqlanmagan, tarmoqlangan, halqali', text: 'Uglerod skeleti ochiq (tarmoqlanmagan yoki tarmoqlangan) yoki halqali bo‘lishi mumkin. Zanjir shakli moddaning xossalariga ta’sir qiladi.' },
      { title: 'Funksional guruhlar', sub: '–OH, –CHO, –COOH, –NH₂', text: 'Moddaning sinfini va kimyoviy xossalarini belgilovchi atomlar guruhi funksional guruh deyiladi: –OH (spirtlar), –CHO (aldegidlar), –COOH (karbon kislotalar), –NH₂ (aminlar).' },
    ],
  },
  'b7-birds': {
    intro: 'Qushlarning uchishga moslashuvlarini birma-bir ko‘rib chiqing.',
    items: [
      { title: 'Patlar', sub: 'konturli va par patlar', text: 'Konturli patlar tananing shaklini belgilaydi, qanot va dum patlari uchish va yo‘nalish berishni ta’minlaydi. Par patlar issiqlikni saqlaydi.' },
      { title: 'Yengil skelet', sub: 'havo bilan to‘lgan suyaklar', text: 'Ko‘p suyaklarining ichi kovak va havo bilan to‘la, shu sabab skelet yengil. To‘sh suyagining o‘simtasi (kil) ko‘krak mushaklarini mahkam biriktirish uchun xizmat qiladi.' },
      { title: 'Ko‘krak muskullari', sub: 'qanotlarni harakatga keltiradi', text: 'Kuchli ko‘krak mushaklari qanotlarni yuqori-pastga harakatlantiradi. Ular tana massasining katta qismini tashkil qiladi.' },
      { title: 'Nafas olish', sub: 'o‘pka va havo xaltachalari', text: 'Qushlarda o‘pkaga qo‘shimcha havo xaltachalari ulangan. Shu sabab nafas olishda ham, chiqarishda ham o‘pka orqali toza havo o‘tadi: bu uchishda ko‘p kislorod talab qiladigan organizm uchun juda foydali.' },
      { title: 'Yurak va issiqqonlilik', sub: 'to‘rt kamerali yurak', text: 'Yuragi to‘rt kamerali: toza (arterial) va kislorodi kam (venoz) qon aralashmaydi. Qushlar issiqqonli: tana harorati doimiy va yuqori.' },
      { title: 'Ko‘payish', sub: 'tuxum va inkubatsiya', text: 'Qushlar tuxum qo‘yadi, tuxumlarni bosib isitadi (inkubatsiya) va ko‘pchiligi bolalariga g‘amxo‘rlik qiladi.' },
      { title: 'Mavsumiy ko‘chish', sub: 'migratsiya', text: 'Ko‘plab qushlar ozuqa kamayganda sovuq mavsumda iliq o‘lkalarga ko‘chib o‘tadi va bahorda qaytib keladi.' },
    ],
  },
  'b9-levels': {
    intro: 'Hayotning tashkil topish darajalari: eng kichigidan eng kattasigacha.',
    items: [
      { title: 'Molekulyar', sub: 'DNK, oqsil', text: 'Hayotning eng quyi darajasi: organik molekulalar (oqsil, DNK, lipid, uglevod) va ularning ishlashi.' },
      { title: 'Hujayra', sub: 'tirik tizimning birligi', text: 'Hujayra — tirik organizmning tuzilish va hayotiy faoliyat birligi.' },
      { title: 'To‘qima va organ', sub: 'yurak, barg', text: 'Bir xil hujayralar to‘qimani, to‘qimalar esa organni hosil qiladi.' },
      { title: 'Organizm', sub: 'yaxlit tizim', text: 'Organlar sistemasi birgalikda yaxlit organizmni tashkil qiladi.' },
      { title: 'Populyatsiya-tur', sub: 'bir turdagi guruh', text: 'Bir hududda yashovchi bir tur individlari populyatsiyani hosil qiladi. Evolyutsiya shu darajada ro‘y beradi.' },
      { title: 'Biogeotsenoz', sub: 'ekosistema', text: 'Turli turlar va ular yashaydigan jonsiz muhit birligi.' },
      { title: 'Biosfera', sub: 'Yerdagi hayot qobig‘i', text: 'Yerdagi barcha tirik organizmlar va ular yashaydigan muhit yig‘indisi.' },
    ],
  },
  'b9-celltheory': {
    intro: 'Hujayra nazariyasining shakllanish tarixi.',
    items: [
      { title: '1665: R. Guk', sub: 'hujayra atamasi', text: 'Robert Guk mikroskop ostida po‘kak kesmasini ko‘rib, uyachalarni «hujayra» deb atadi.' },
      { title: '1670-yillar: A. Levenguk', sub: 'mikroorganizmlar', text: 'Antoni van Levenguk o‘z mikroskopi bilan bir hujayrali organizmlar va bakteriyalarni birinchi bo‘lib kuzatdi.' },
      { title: '1838–1839: Shleyden va Shvann', sub: 'hujayra nazariyasi', text: 'Barcha o‘simlik va hayvon organizmlari hujayralardan tuzilgan degan xulosaga kelishdi.' },
      { title: '1858: R. Virxov', sub: 'hujayradan hujayra', text: 'Har bir hujayra faqat hujayraning bo‘linishidan paydo bo‘ladi.' },
      { title: 'Zamonaviy nazariya', sub: 'asosiy qoidalar', text: 'Hujayra — tirik organizm birligi; hujayralar bo‘linib ko‘payadi; barcha organizmlar hujayralar tuzilishida o‘xshashdir.' },
    ],
  },
  'b10-biosphere': {
    intro: 'Biosfera va moddalar aylanishi.',
    items: [
      { title: 'Vernadskiy ta’limoti', sub: 'biosfera', text: 'V. I. Vernadskiy biosferani Yerdagi tirik moddalar faoliyati bilan shakllangan qobiq sifatida ta’riflagan.' },
      { title: 'Uglerod aylanishi', sub: 'CO₂ ⇄ organik moddalar', text: 'O‘simliklar CO₂ ni fotosintezda o‘zlashtiradi; nafas olish, chirish va yonish uni atmosferaga qaytaradi.' },
      { title: 'Suv aylanishi', sub: 'bug‘lanish–yog‘in', text: 'Suv bug‘lanadi, quyuqlashadi, yog‘in bo‘lib qaytadi. O‘simliklar transpiratsiyasi ham qatnashadi.' },
      { title: 'Azot aylanishi', sub: 'tuganak bakteriyalar', text: 'Tuganak bakteriyalar atmosfera azotini o‘simliklar o‘zlashtira oladigan shaklga o‘tkazadi.' },
      { title: 'Kislorod', sub: 'fotosintez mahsuloti', text: 'Atmosferadagi kisloroddan asosiy qismi fotosintez natijasida to‘planib borgan.' },
    ],
  },
  'b10-human-origin': {
    intro: 'Odam evolyutsiyasidagi asosiy bosqichlar (taxminiy yillar).',
    items: [
      { title: 'Avstralopiteklar', sub: '~4–2 mln yil avval', text: 'Ikki oyoqda yurgan, miyasi hozirgi odamnikidan ancha kichik bo‘lgan qadimgi primatlar.' },
      { title: 'Ishchan odam', sub: 'Homo habilis, ~2,4 mln yil avval', text: 'Tosh qurollar yasay boshlagan.' },
      { title: 'To‘g‘ri yuruvchi odam', sub: 'Homo erectus, ~1,9 mln yil avval', text: 'Olovdan foydalangan, Afrikadan tashqariga tarqalgan.' },
      { title: 'Neandertal', sub: '~400–40 ming yil avval', text: 'Yevropa va G‘arbiy Osiyoda yashagan, qurol yasagan va o‘liklarini ko‘mgan.' },
      { title: 'Zamonaviy odam', sub: 'Homo sapiens, ~300 ming yil avval', text: 'Aqli rivojlangan, nutq, san’at va murakkab madaniyatga ega.' },
    ],
  },
  'b11-life-evolution': {
    intro: 'Yerda hayotning rivojlanish yo‘li (taxminiy yillar).',
    items: [
      { title: 'Prokariotlar', sub: '~3,5 mlrd yil avval', text: 'Yadrosiz bir hujayrali organizmlar — eng qadimgi hayot shakli.' },
      { title: 'Fotosintez va kislorod', sub: '~2,4 mlrd yil avval', text: 'Siyanobakteriyalar fotosintez qilib atmosferani kislorod bilan boyitdi.' },
      { title: 'Eukariotlar', sub: '~2 mlrd yil avval', text: 'Yadroli hujayralar paydo bo‘ldi.' },
      { title: 'Ko‘p hujayralilar', sub: '~600 mln yil avval', text: 'Hujayralar birlashib ko‘p hujayrali organizmlar hosil qildi.' },
      { title: 'Kembriy portlashi', sub: '~540 mln yil avval', text: 'Hayvonlarning ko‘pgina yirik guruhlari juda qisqa vaqtda paydo bo‘ldi.' },
      { title: 'Quruqlikka chiqish', sub: '~470 mln yil avval', text: 'O‘simliklar, keyinroq hayvonlar quruqlikni egalladi.' },
      { title: 'Dinozavrlar davri', sub: '~230–66 mln yil avval', text: 'Reptiliyalar hukmron bo‘ldi; keyin sutemizuvchilar va qushlar ko‘payib ketdi.' },
    ],
  },
  'b9-organelles': {
    intro: 'Hujayra organoidlarini birma-bir ko‘rib chiqing: tuzilishi va vazifasi.',
    items: [
      { title: 'Yadro', sub: 'irsiy axborot markazi', text: 'Ikki membranali qobiq bilan o‘ralgan. Ichida xromosomalar (DNK) bor, ular irsiy axborotni saqlaydi va hujayra faoliyatini boshqaradi.' },
      { title: 'Mitoxondriya', sub: 'hujayra «energiya stansiyasi»', text: 'Ikki membranali. Ichki membrana burmalar (kristalar) hosil qiladi. Bu yerda organik moddalar oksidlanib, ATF ko‘rinishida energiya to‘planadi.' },
      { title: 'Ribosoma', sub: 'oqsil sintezi', text: 'Membranasiz mayda zarracha. Oqsil sintezi shu yerda o‘tadi. Erkin holda yoki endoplazmatik to‘rda joylashadi.' },
      { title: 'Endoplazmatik to‘r', sub: 'tashish tizimi', text: 'Membranali kanalchalar tizimi. Donador to‘r (ribosomalar bilan) oqsil sintezida, silliq to‘r yog‘lar va uglevodlar sintezida qatnashadi, moddalarni tashiydi.' },
      { title: 'Golji kompleksi', sub: 'to‘plash va chiqarish', text: 'Yassi xaltachalar va pufakchalar to‘plami. Sintez qilingan moddalarni yig‘adi, o‘zgartiradi va hujayradan tashqariga chiqaradi, lizosomalar hosil qiladi.' },
      { title: 'Lizosoma', sub: 'hazm qilish organoidi', text: 'Hazm fermentlariga to‘la pufakcha. Ovqat zarrachalarini va eskirgan organoidlarni parchalaydi.' },
      { title: 'Plastidlar', sub: 'faqat o‘simliklarda', text: 'Xloroplastlar yashil rangli, fotosintez o‘tadi. Xromoplastlar mevalarga rang beradi. Leykoplastlarda zaxira moddalar (kraxmal) to‘planadi.' },
      { title: 'Vakuola', sub: 'hujayra shirasi', text: 'O‘simlik hujayrasida katta markaziy vakuola hujayra shirasini saqlaydi, suv balansini boshqaradi, hujayraga taranglik beradi.' },
      { title: 'Hujayra membranasi', sub: 'chegara va tanlab o‘tkazish', text: 'Hujayrani o‘rab turadi, moddalarning kirishi va chiqishini tartibga soladi, atrof muhit bilan aloqa o‘rnatadi.' },
    ],
  },
};
