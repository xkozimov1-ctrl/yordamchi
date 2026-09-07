// src/utils.js
// Statistika saqlash, obunachilar ro'yxati va boshqa yordamchi funksiyalar

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

// data papkasi mavjudligiga ishonch hosil qilamiz
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    logError("readJsonSafe", err);
    return fallback;
  }
}

function writeJsonSafe(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    logError("writeJsonSafe", err);
  }
}

/* ----------------------- STATISTIKA ----------------------- */

function loadStats() {
  return readJsonSafe(STATS_FILE, {});
}

function saveStats(stats) {
  writeJsonSafe(STATS_FILE, stats);
}

/**
 * Foydalanuvchi statistikasini oladi (mavjud bo'lmasa - default qiymat bilan yaratadi)
 */
function getUserStats(userId) {
  const stats = loadStats();
  if (!stats[userId]) {
    stats[userId] = {
      wordsViewed: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    };
    saveStats(stats);
  }
  return stats[userId];
}

/**
 * Foydalanuvchi statistikasini yangilaydi (delta qiymatlar qo'shiladi)
 */
function updateUserStats(userId, deltas) {
  const stats = loadStats();
  if (!stats[userId]) {
    stats[userId] = {
      wordsViewed: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      totalQuestions: 0,
    };
  }
  for (const key of Object.keys(deltas)) {
    stats[userId][key] = (stats[userId][key] || 0) + deltas[key];
  }
  saveStats(stats);
  return stats[userId];
}

/* ----------------------- OBUNACHILAR ----------------------- */

function loadSubscribers() {
  return readJsonSafe(SUBSCRIBERS_FILE, []);
}

function addSubscriber(chatId) {
  const subscribers = loadSubscribers();
  if (!subscribers.includes(chatId)) {
    subscribers.push(chatId);
    writeJsonSafe(SUBSCRIBERS_FILE, subscribers);
  }
}

/* ----------------------- BOSHQA YORDAMCHILAR ----------------------- */

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Telegram Markdown uchun maxsus belgilarni escape qiladi
 */
function escapeMarkdown(text = "") {
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

/**
 * Xatoликлarni konsolga vaqt bilan birga log qiladi
 */
function logError(context, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ Xatolik (${context}):`, error?.message || error);
}

function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ℹ️  ${message}`);
}

module.exports = {
  loadStats,
  saveStats,
  getUserStats,
  updateUserStats,
  loadSubscribers,
  addSubscriber,
  shuffleArray,
  escapeMarkdown,
  logError,
  logInfo,
};
