// src/bot.js
// Botning asosiy kirish nuqtasi: polling, komandalar, cron va Render uchun keep-alive server

require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const express = require("express");
const https = require("https");

const { getDailyWord } = require("./words");
const { loadSubscribers, escapeMarkdown, logError, logInfo } = require("./utils");
const {
  handleStart,
  handleHelp,
  handleWord,
  handleDaily,
  handleQuiz,
  handleStats,
  handleCallbackQuery,
} = require("./handlers");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
const PORT = process.env.PORT || 3000;
const TIMEZONE = process.env.TIMEZONE || "Asia/Tashkent";
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN topilmadi. .env faylini tekshiring.");
  process.exit(1);
}

/* ----------------------- BOTNI ISHGA TUSHIRISH ----------------------- */

// Avval polling'siz bot yaratamiz, webhookni o'chiramiz, keyin pollingni yoqamiz
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

async function startBot() {
  try {
    // Agar avval webhook o'rnatilgan bo'lsa, uni o'chiramiz — aks holda polling ishlamaydi
    await bot.deleteWebHook();
    logInfo("Webhook o'chirildi, polling rejimi yoqilmoqda...");

    await bot.startPolling();
    logInfo("✅ Bot polling rejimida muvaffaqiyatli ishga tushdi!");
  } catch (err) {
    logError("startBot", err);
    process.exit(1);
  }
}

/* ----------------------- KOMANDALARNI RO'YXATDAN O'TKAZISH ----------------------- */

bot.onText(/^\/start/, (msg) => handleStart(bot, msg).catch((e) => logError("/start", e)));
bot.onText(/^\/help/, (msg) => handleHelp(bot, msg).catch((e) => logError("/help", e)));
bot.onText(/^\/word/, (msg) => handleWord(bot, msg).catch((e) => logError("/word", e)));
bot.onText(/^\/daily/, (msg) => handleDaily(bot, msg).catch((e) => logError("/daily", e)));
bot.onText(/^\/quiz/, (msg) => handleQuiz(bot, msg).catch((e) => logError("/quiz", e)));
bot.onText(/^\/stats/, (msg) => handleStats(bot, msg).catch((e) => logError("/stats", e)));

bot.on("callback_query", (query) => {
  handleCallbackQuery(bot, query).catch((e) => logError("callback_query", e));
});

// Umumiy polling xatoliklarini log qilish
bot.on("polling_error", (err) => logError("polling_error", err));
bot.on("webhook_error", (err) => logError("webhook_error", err));

/* ----------------------- KUNLIK SO'Z YUBORISH (CRON) ----------------------- */

async function broadcastDailyWord() {
  const word = getDailyWord();
  const today = new Date().toLocaleDateString("uz-UZ");

  const text =
    `🔔 *Bugungi so'z (${escapeMarkdown(today)})*\n\n` +
    `📘 *${escapeMarkdown(word.en)}* — _${escapeMarkdown(word.uz)}_\n\n` +
    `✏️ *Misol:*\n${escapeMarkdown(word.example)}\n${escapeMarkdown(word.translation)}`;

  // 1) Avval admin'ga yuboriladi
  if (ADMIN_ID) {
    try {
      await bot.sendMessage(ADMIN_ID, `👑 *[ADMIN nusxa]*\n\n${text}`, { parse_mode: "Markdown" });
    } catch (err) {
      logError("broadcastDailyWord -> admin", err);
    }
  }

  // 2) Keyin barcha obunachilarga yuboriladi
  const subscribers = loadSubscribers();
  for (const chatId of subscribers) {
    if (String(chatId) === String(ADMIN_ID)) continue; // adminga ikki marta yubormaslik uchun
    try {
      await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    } catch (err) {
      logError(`broadcastDailyWord -> ${chatId}`, err);
    }
  }

  logInfo(`📤 Kunlik so'z ${subscribers.length} obunachiga yuborildi.`);
}

// Har kuni soat 09:00 da (belgilangan vaqt zonasida) ishga tushadi
cron.schedule(
  "0 9 * * *",
  () => {
    broadcastDailyWord().catch((e) => logError("cron broadcastDailyWord", e));
  },
  { timezone: TIMEZONE }
);

logInfo(`⏰ Kunlik so'z yuborish rejalashtirildi: har kuni 09:00 (${TIMEZONE})`);

/* ----------------------- RENDER.COM UCHUN WEB SERVER (KEEP-ALIVE) ----------------------- */
// Render'ning bepul "web service" rejimi doim ochiq HTTP portni talab qiladi.
// Shuningdek, bot "uxlab qolmasligi" uchun o'z-o'ziga muntazam ping yuboradi.

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("✅ English Learning Bot ishlamoqda!");
});

app.listen(PORT, () => {
  logInfo(`🌐 Keep-alive server ${PORT}-portda ishga tushdi.`);
});

// O'z-o'ziga har 10 daqiqada ping yuborish (Render bepul reja uxlab qolmasligi uchun)
// Eslatma: buning o'rniga tashqi UptimeRobot xizmatidan foydalanish tavsiya etiladi.
function selfPing() {
  if (!RENDER_EXTERNAL_URL) return;

  https
    .get(RENDER_EXTERNAL_URL, (res) => {
      logInfo(`🔁 Self-ping yuborildi, status: ${res.statusCode}`);
    })
    .on("error", (err) => {
      logError("selfPing", err);
    });
}

if (RENDER_EXTERNAL_URL) {
  setInterval(selfPing, 10 * 60 * 1000); // har 10 daqiqada
  logInfo("🔁 Self-ping mexanizmi yoqildi (har 10 daqiqada).");
} else {
  logInfo("ℹ️ RENDER_EXTERNAL_URL berilmagan — self-ping o'chiq. UptimeRobot ishlatishingiz mumkin.");
}

/* ----------------------- ISHGA TUSHIRISH ----------------------- */

startBot();

process.on("unhandledRejection", (reason) => {
  logError("unhandledRejection", reason);
});

process.on("uncaughtException", (err) => {
  logError("uncaughtException", err);
});
