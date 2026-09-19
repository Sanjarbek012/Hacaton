# Virtual laboratoriya (fizika, kimyo, biologiya)

Stek: **NestJS (TS)** + **React (TS, Vite)** + **PostgreSQL + TypeORM** + **AI yordamchi (Claude)**.

## Ishga tushirish

1. Ma'lumotlar bazasi: PostgreSQL'da `virtual_lab` bazasini yarating (yoki `docker compose up -d`).
2. `backend/.env.example` ni `backend/.env` ga nusxalang va to'ldiring:
   - `DB_PASS` — PostgreSQL parolingiz
   - `JWT_SECRET` — uzun tasodifiy matn (login xavfsizligi uchun)
   - `AI_PROVIDER=groq` va `GROQ_API_KEY` — tekin kalit: https://console.groq.com/keys dan "Create API Key". (Boshqalar: `AI_PROVIDER=gemini` + `GEMINI_API_KEY`, yoki `anthropic` + `ANTHROPIC_API_KEY`.) Kalit bo'sh bo'lsa, AI o'chiq turadi, qolgan hammasi ishlaydi.
3. Backend: `cd backend && npm install && npm run start:dev` (http://localhost:3000/api)
4. Frontend: `cd frontend && npm install && npm run dev` (http://localhost:5173)

Birinchi kirishda "Ro'yxatdan o'tish" orqali hisob yarating.

## Nimalar bor

- **Login:** ro'yxatdan o'tish / kirish (JWT, parollar bcrypt bilan hashlangan). Barcha API login talab qiladi.
- **Bosh sahifa:** fanlar bo'yicha mavzular soni, tayyor tajribalar va sizning bajargan tajribalaringiz (hammasi bazadan hisoblanadi), so'nggi natijalar.
- **Laboratoriya:** fan va sinf tanlanadi, mavzular bazadan olinadi.
- **AI yordamchi:** har tajribada "Nima sodir bo'lyapti?" (hozirgi qiymatlar asosida sabab tushuntiradi), "Ishni qanday bajaraman?" (qadamlar) va erkin savol.
- **Moddalarni aralashtirish (kimyo):** kislota, asos, tuz, metall va indikatordan ikkitasini tanlab aralashtiring. Reaksiya tenglamasi, gaz/cho'kma/rang/isish animatsiya bilan ko'rsatiladi, AI esa nima uchun shunday bo'lishini tushuntiradi. Reaksiyalar jadvali `backend/src/chem/reagents.ts` da.

## API

| Metod | Yo'l | Vazifa |
|-------|------|--------|
| POST | `/api/auth/register`, `/api/auth/login` | Hisob yaratish, kirish (ochiq) |
| GET | `/api/auth/me` | Joriy foydalanuvchi |
| GET | `/api/topics?subject=&grade=` | Mavzular |
| GET | `/api/stats/overview` | Fanlar bo'yicha statistika |
| POST / GET | `/api/results` | Natijani saqlash / o'zimning natijalarim |
| GET | `/api/chem/reagents`, POST `/api/chem/mix` | Moddalar, aralashtirish |
| POST | `/api/ai/assist` | AI yordamchi (`mode`: explain, steps, ask) |

## Yangi tajriba qo'shish

1. `frontend/src/simulations/` da komponent yozing (`SimProps` oladi, oxirida `<SaveBar />`; SaveBar'ga berilgan `data` AI ga ham ko'rinadi).
2. `frontend/src/registry.ts` ga kalit bilan ulang.
3. `backend/src/topics/curriculum.ts` da mavzuni `['Nomi', 'kalit']` qiling.
4. `backend/src/ai/sim-goals.ts` ga tajriba maqsadini yozing (AI aniqroq javob beradi).
5. Backendni qayta ishga tushiring: mavzular bazaga avtomatik moslanadi, natijalar o'chmaydi.

## Eslatma (eski bazadan yangilash)

Avvalgi versiyada natijalarda ism saqlangan edi; endi natijalar foydalanuvchiga bog'lanadi. `DB_SYNC=true` bo'lsa, jadvallar avtomatik yangilanadi (eski natijalar egasiz qoladi va ko'rinmaydi).
