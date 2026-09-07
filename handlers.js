// src/handlers.js
// Barcha bot komandalari va interaktiv test (quiz) mantig'i

const { getDailyWord, getRandomWord, getQuizQuestions } = require("./words");
const {
  addSubscriber,
  getUserStats,
  updateUserStats,
  escapeMarkdown,
  logError,
  logInfo,
} = require("./utils");

// Har bir foydalanuvchining joriy quiz holatini saqlaydigan xotira (RAM)
// Struktura: { questions, currentIndex, score, chatId }
const userStates = new Map();

/* ----------------------- YORDAMCHI: SO'Z XABARINI FORMATLASH ----------------------- */

function formatWordMessage(word, title) {
  return (
    `${title}\n\n` +
    `📘 *${escapeMarkdown(word.en)}* — _${escapeMarkdown(word.uz)}_\n\n` +
    `✏️ *Misol:*\n` +
    `${escapeMarkdown(word.example)}\n` +
    `${escapeMarkdown(word.translation)}`
  );
}

/* ----------------------- /start ----------------------- */

async function handleStart(bot, msg) {
  const chatId = msg.chat.id;
  addSubscriber(chatId);

  const text =
    `👋 *Assalomu alaykum, ${escapeMarkdown(msg.from.first_name || "do'stim")}!*\n\n` +
    `Men — *English Learning Bot* 🇬🇧\n` +
    `Men sizga har kuni yangi inglizcha so'zlar yuboraman va bilimingizni test orqali tekshiraman.\n\n` +
    `*Mavjud komandalar:*\n` +
    `📖 /word — Tasodifiy yangi so'z\n` +
    `📅 /daily — Bugungi kun so'zi\n` +
    `📝 /quiz — 5 savoldan iborat test\n` +
    `📊 /stats — Statistikangiz\n` +
    `❓ /help — Yordam\n\n` +
    `Boshlash uchun /word buyrug'ini yuboring! 🚀`;

  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

/* ----------------------- /help ----------------------- */

async function handleHelp(bot, msg) {
  const chatId = msg.chat.id;
  const text =
    `❓ *Yordam*\n\n` +
    `Quyidagi komandalardan foydalanishingiz mumkin:\n\n` +
    `📖 /word — Tasodifiy inglizcha so'z va uning tarjimasini oling\n` +
    `📅 /daily — Har kuni yangilanadigan "kunning so'zi"\n` +
    `📝 /quiz — 5 ta savoldan iborat interaktiv test boshlash\n` +
    `📊 /stats — Ko'rgan so'zlaringiz va test natijalaringiz\n` +
    `🏁 /start — Botni qayta ishga tushirish\n\n` +
    `Har kuni soat 09:00 da sizga avtomatik ravishda yangi so'z yuboriladi. 🔔`;

  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

/* ----------------------- /word ----------------------- */

async function handleWord(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const word = getRandomWord();
  updateUserStats(userId, { wordsViewed: 1 });

  const text = formatWordMessage(word, "🎲 *Tasodifiy so'z:*");
  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

/* ----------------------- /daily ----------------------- */

async function handleDaily(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const word = getDailyWord();
  updateUserStats(userId, { wordsViewed: 1 });

  const today = new Date().toLocaleDateString("uz-UZ");
  const text = formatWordMessage(word, `📅 *Bugungi so'z (${escapeMarkdown(today)}):*`);
  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

/* ----------------------- /quiz ----------------------- */

async function handleQuiz(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const questions = getQuizQuestions(5);

  userStates.set(userId, {
    chatId,
    questions,
    currentIndex: 0,
    score: 0,
  });

  await bot.sendMessage(
    chatId,
    `📝 *Test boshlandi!*\n5 ta savolga javob bering. Har bir savolga faqat bitta to'g'ri javob bor.`,
    { parse_mode: "Markdown" }
  );

  await sendQuizQuestion(bot, userId);
}

async function sendQuizQuestion(bot, userId) {
  const state = userStates.get(userId);
  if (!state) return;

  const { chatId, questions, currentIndex } = state;
  const q = questions[currentIndex];

  const keyboard = q.options.map((option, index) => [
    {
      text: option,
      callback_data: `quiz_${userId}_${currentIndex}_${index}`,
    },
  ]);

  await bot.sendMessage(
    chatId,
    `❓ *Savol ${currentIndex + 1}/${questions.length}*\n\n${escapeMarkdown(q.question)}`,
    {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard },
    }
  );
}

/* ----------------------- CALLBACK QUERY (quiz javoblari) ----------------------- */

async function handleCallbackQuery(bot, callbackQuery) {
  const data = callbackQuery.data || "";
  if (!data.startsWith("quiz_")) return;

  const [, userIdStr, questionIndexStr, optionIndexStr] = data.split("_");
  const userId = Number(userIdStr);
  const questionIndex = Number(questionIndexStr);
  const optionIndex = Number(optionIndexStr);

  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  const state = userStates.get(userId);

  // Eskirgan yoki boshqa foydalanuvchiga tegishli tugma bosilsa
  if (!state || state.currentIndex !== questionIndex) {
    await bot.answerCallbackQuery(callbackQuery.id, {
      text: "⚠️ Bu savol eskirgan. /quiz bilan qaytadan boshlang.",
      show_alert: true,
    });
    return;
  }

  const q = state.questions[questionIndex];
  const isCorrect = optionIndex === q.correctIndex;

  if (isCorrect) {
    state.score += 1;
  }

  await bot.answerCallbackQuery(callbackQuery.id, {
    text: isCorrect ? "✅ To'g'ri!" : "❌ Noto'g'ri!",
  });

  const resultText =
    `❓ *${escapeMarkdown(q.question)}*\n\n` +
    `${isCorrect ? "✅ *To'g'ri javob berdingiz!*" : "❌ *Noto'g'ri javob.*"}\n` +
    `✔️ To'g'ri javob: *${escapeMarkdown(q.options[q.correctIndex])}*\n\n` +
    `✏️ _${escapeMarkdown(q.example)}_\n${escapeMarkdown(q.translation)}`;

  try {
    await bot.editMessageText(resultText, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "Markdown",
    });
  } catch (err) {
    logError("editMessageText", err);
  }

  state.currentIndex += 1;

  if (state.currentIndex < state.questions.length) {
    await sendQuizQuestion(bot, userId);
  } else {
    await finishQuiz(bot, userId);
  }
}

async function finishQuiz(bot, userId) {
  const state = userStates.get(userId);
  if (!state) return;

  const { chatId, score, questions } = state;
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  updateUserStats(userId, {
    quizzesTaken: 1,
    correctAnswers: score,
    totalQuestions: total,
  });

  let verdict;
  if (percent === 100) verdict = "🏆 Ajoyib! Barcha savollarga to'g'ri javob berdingiz!";
  else if (percent >= 60) verdict = "👍 Yaxshi natija! Davom eting.";
  else verdict = "💪 Mashq qilishda davom eting, siz uddalaysiz!";

  const text =
    `🏁 *Test yakunlandi!*\n\n` +
    `✅ To'g'ri javoblar: *${score}/${total}*\n` +
    `📊 Natija: *${percent}%*\n\n` +
    `${verdict}\n\n` +
    `Yana urinib ko'rish uchun /quiz buyrug'ini yuboring.`;

  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });

  userStates.delete(userId);
}

/* ----------------------- /stats ----------------------- */

async function handleStats(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const stats = getUserStats(userId);
  const accuracy =
    stats.totalQuestions > 0
      ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
      : 0;

  const text =
    `📊 *Sizning statistikangiz*\n\n` +
    `📖 Ko'rilgan so'zlar: *${stats.wordsViewed}*\n` +
    `📝 Topshirilgan testlar: *${stats.quizzesTaken}*\n` +
    `✅ To'g'ri javoblar: *${stats.correctAnswers}/${stats.totalQuestions}*\n` +
    `🎯 Aniqlik darajasi: *${accuracy}%*`;

  await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
}

module.exports = {
  handleStart,
  handleHelp,
  handleWord,
  handleDaily,
  handleQuiz,
  handleStats,
  handleCallbackQuery,
  userStates,
};
