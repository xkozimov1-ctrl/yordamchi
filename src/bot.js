const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { words, getDailyWord, getWordOfDay } = require('./words');
const { setupHandlers } = require('./handlers');

dotenv.config();

const token = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

if (!token) {
  console.error('❌ BOT_TOKEN topilmadi!');
  process.exit(1);
}

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

console.log('🚀 Bot ishga tushdi!');

// Barcha handlerlarni ulash
setupHandlers(bot);

// Kunlik so'z yuborish (har kuni soat 09:00 da)
cron.schedule('0 9 * * *', async () => {
  try {
    const word = getWordOfDay();
    const message = `📚 *Kun so'zi: ${word.uz}*\n\n` +
                   `🇬🇧 *${word.en}*\n` +
                   `📝 ${word.example}` +
                   (word.translation ? `\n🔄 Tarjimasi: ${word.translation}` : '');
    
    // Barcha foydalanuvchilarga yuborish (siz admin orqali boshqarasiz)
    // Bu yerda o'z foydalanuvchilar ro'yxatini saqlashingiz mumkin
    await bot.sendMessage(adminId, message, { parse_mode: 'Markdown' });
    console.log('✅ Kunlik so\'z yuborildi');
  } catch (error) {
    console.error('❌ Kunlik so\'z yuborishda xatolik:', error);
  }
});

// Botni ishga tushirish
bot.on('polling_error', (error) => {
  console.error('Polling xatosi:', error);
});

module.exports = bot;