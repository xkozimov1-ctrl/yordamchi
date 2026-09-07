const { words, getRandomWord, getQuizQuestions } = require('./words');

// Foydalanuvchi holatlari
const userStates = new Map();

function setupHandlers(bot) {
  
  // /start komandasi
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || 'Do\'stim';
    
    const message = `👋 *Assalomu alaykum, ${firstName}!*\n\n` +
                   `📚 Bu bot ingliz tilini o'rganishga yordam beradi.\n\n` +
                   `🔹 *Komandalar:*\n` +
                   `/word - Yangi so'z olish\n` +
                   `/quiz - Test topshirish (5 savol)\n` +
                   `/daily - Bugungi so'z\n` +
                   `/stats - Statistika\n` +
                   `/help - Yordam\n\n` +
                   `💡 Bot har kuni soat 09:00 da yangi so'z yuboradi!`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // /word - yangi so'z
  bot.onText(/\/word/, (msg) => {
    const chatId = msg.chat.id;
    const word = getRandomWord();
    
    const message = `📖 *Yangi so'z*\n\n` +
                   `🇬🇧 *${word.en}*\n` +
                   `🇺🇿 ${word.uz}\n` +
                   `📝 *Misol:* ${word.example}\n` +
                   `🔄 Tarjimasi: ${word.translation || 'Mavjud emas'}\n\n` +
                   `💡 Bu so'zni eslab qolish uchun 3 marta takrorlang!`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // /daily - bugungi so'z
  bot.onText(/\/daily/, (msg) => {
    const chatId = msg.chat.id;
    const word = getRandomWord(); // words.js da getWordOfDay() ham bor
    
    const message = `📅 *Bugungi so'z*\n\n` +
                   `🇬🇧 *${word.en}*\n` +
                   `🇺🇿 ${word.uz}\n` +
                   `📝 *Misol:* ${word.example}\n` +
                   `🔄 Tarjimasi: ${word.translation || 'Mavjud emas'}`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // /quiz - test
  bot.onText(/\/quiz/, async (msg) => {
    const chatId = msg.chat.id;
    const questions = getQuizQuestions(5);
    
    userStates.set(chatId, {
      quiz: true,
      questions: questions,
      currentQuestion: 0,
      score: 0,
      answered: false
    });
    
    await sendQuestion(bot, chatId, questions[0]);
  });

  // /stats - statistika
  bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const wordCount = words.length;
    
    const message = `📊 *Statistika*\n\n` +
                   `📚 Jami so'zlar soni: ${wordCount}\n` +
                   `📝 O'rgangan so'zlaringiz: 0\n` +
                   `✅ Testlar: 0\n` +
                   `🎯 To'g'ri javoblar: 0%\n\n` +
                   `💪 Botda yangi so'zlar o'rganing va natijangizni oshiring!`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // /help - yordam
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    const message = `🆘 *Yordam*\n\n` +
                   `📌 *Asosiy komandalar:*\n` +
                   `/start - Boshlash\n` +
                   `/word - Yangi so'z olish\n` +
                   `/quiz - Test topshirish\n` +
                   `/daily - Bugungi so'z\n` +
                   `/stats - Statistika\n` +
                   `/help - Yordam\n\n` +
                   `🤖 Bot har kuni soat 09:00 da yangi so'z yuboradi!\n` +
                   `💡 Savollar yoki takliflar uchun @admin ga yozing.`;
    
    bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  });

  // Test javoblarini qayta ishlash
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    if (!text || text.startsWith('/')) return;
    
    const state = userStates.get(chatId);
    if (!state || !state.quiz) return;
    
    // Test davom etayotgan bo'lsa
    const currentQ = state.questions[state.currentQuestion];
    const isCorrect = text === currentQ.correct;
    
    if (isCorrect) state.score++;
    
    const feedback = isCorrect ? '✅ *To\'g\'ri!*' : `❌ *Noto\'g\'ri!* To\'g\'ri javob: *${currentQ.correct}*`;
    const wordInfo = `📖 *${currentQ.word.en}* - ${currentQ.word.uz}\n📝 ${currentQ.word.example}`;
    
    bot.sendMessage(chatId, `${feedback}\n\n${wordInfo}`, { parse_mode: 'Markdown' });
    
    state.currentQuestion++;
    state.answered = false;
    
    if (state.currentQuestion < state.questions.length) {
      // Keyingi savol
      setTimeout(() => {
        sendQuestion(bot, chatId, state.questions[state.currentQuestion]);
      }, 1500);
    } else {
      // Test tugadi
      const total = state.questions.length;
      const score = state.score;
      const percentage = Math.round((score / total) * 100);
      
      let emoji = '😊';
      if (percentage >= 80) emoji = '🎉';
      else if (percentage >= 60) emoji = '👍';
      else emoji = '📚';
      
      const result = `📊 *Test natijalari*\n\n` +
                    `${emoji} *${score}/${total}* to\'g\'ri javob\n` +
                    `📈 *${percentage}%*\n\n` +
                    `💪 Davom eting! Ko'proq mashq qiling!`;
      
      bot.sendMessage(chatId, result, { parse_mode: 'Markdown' });
      
      // Holatni tozalash
      userStates.delete(chatId);
    }
  });
}

// Savol yuborish funksiyasi
async function sendQuestion(bot, chatId, question) {
  const options = question.options.map((opt, index) => 
    `${String.fromCharCode(65 + index)}. ${opt}`
  ).join('\n');
  
  const message = `📝 *Savol ${question.options.indexOf(question.correct) + 1}/${question.options.length}*\n\n` +
                 `${question.question}\n\n` +
                 `${options}`;
  
  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
}

module.exports = { setupHandlers };