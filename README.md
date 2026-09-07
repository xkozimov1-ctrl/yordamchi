# 📘 English Learning Bot (Telegram)

Ingliz tilini o'rganuvchilar uchun kunlik so'zlar va interaktiv testlar yuboruvchi Telegram bot.

## 🚀 Lokal ishga tushirish

1. Bog'liqliklarni o'rnating:
   ```bash
   npm install
   ```
2. `.env` faylini to'ldiring:
   - `BOT_TOKEN` — [@BotFather](https://t.me/BotFather) orqali oling
   - `ADMIN_ID` — o'z Telegram ID raqamingiz ([@userinfobot](https://t.me/userinfobot) orqali bilib oling)
3. Botni ishga tushiring:
   ```bash
   npm start
   ```

## ☁️ Render.com'ga deploy qilish

1. Loyihani GitHub'ga yuklang.
2. Render.com'da **New + → Web Service** tanlang va repozitoriyni ulang.
3. `render.yaml` avtomatik sozlamalarni o'qiydi (Blueprint deploy). Yoki qo'lda:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Environment Variables bo'limida quyidagilarni kiriting:
   - `BOT_TOKEN`
   - `ADMIN_ID`
   - `RENDER_EXTERNAL_URL` — deploy bo'lgach Render bergan URL (masalan `https://your-app.onrender.com`)
   - `TIMEZONE` — `Asia/Tashkent`
5. Deploy tugagach, bot avtomatik pollingda ishga tushadi.

### 🔁 Botni "uxlab qolishdan" saqlash

Render'ning bepul rejasi 15 daqiqa faolsiz qolsa, ilovani "uxlatib qo'yadi". Buning oldini olish uchun ikki variant bor:
- **Ichki self-ping** — kodda allaqachon mavjud (`RENDER_EXTERNAL_URL` berilsa, har 10 daqiqada o'ziga so'rov yuboradi).
- **UptimeRobot** (tavsiya etiladi) — [uptimerobot.com](https://uptimerobot.com) saytida bepul monitor yarating va Render URL'ingizni har 5 daqiqada tekshirtiring.

## ⚠️ Muhim eslatma: statistika saqlash

Statistika va obunachilar `data/*.json` fayllarida saqlanadi. Render'ning bepul reja diski **doimiy emas** — har safar qayta deploy qilinganda yoki konteyner qayta ishga tushganda bu fayllar **tozalanishi mumkin**. Production uchun uzoq muddatli saqlash kerak bo'lsa, buning o'rniga haqiqiy ma'lumotlar bazasidan (masalan, Render Postgres yoki MongoDB Atlas) foydalanishni tavsiya qilamiz.

## 📂 Fayl tuzilishi

```
english-learning-bot/
├── package.json
├── .env
├── .gitignore
├── render.yaml
├── .npmrc
└── src/
    ├── bot.js       # asosiy ishga tushirish, cron, keep-alive server
    ├── words.js     # 50 ta so'zlik baza + kunlik/random/quiz funksiyalari
    ├── handlers.js  # /start /word /daily /quiz /stats /help logikasi
    └── utils.js     # statistika, obunachilar, log va yordamchi funksiyalar
```

## 🤖 Komandalar ro'yxati

| Komanda | Vazifasi |
|---|---|
| `/start` | Bot haqida ma'lumot va komandalar ro'yxati |
| `/word` | Tasodifiy yangi so'z |
| `/daily` | Bugungi kun so'zi |
| `/quiz` | 5 savoldan iborat interaktiv test |
| `/stats` | Foydalanuvchi statistikasi |
| `/help` | Yordam |
