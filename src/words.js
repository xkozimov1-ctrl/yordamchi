// So'zlar bazasi - 30+ so'z
const words = [
  { en: 'perseverance', uz: 'qat\'iyat', example: 'Perseverance leads to success.', translation: 'Qat\'iyat muvaffaqiyatga olib keladi.' },
  { en: 'diligent', uz: 'tirishqoq', example: 'She is a diligent student.', translation: 'U tirishqoq talaba.' },
  { en: 'knowledge', uz: 'bilim', example: 'Knowledge is power.', translation: 'Bilim kuchdir.' },
  { en: 'curiosity', uz: 'qiziquvchanlik', example: 'Curiosity drove her to explore.', translation: 'Qiziquvchanlik uni kashfiyotga undadi.' },
  { en: 'inspire', uz: 'ilhomlantirmoq', example: 'Great leaders inspire others.', translation: 'Buyuk rahbarlar boshqalarni ilhomlantiradi.' },
  { en: 'opportunity', uz: 'imkoniyat', example: 'Seize the opportunity!', translation: 'Imkoniyatni qo\'ldan boy berma!' },
  { en: 'challenge', uz: 'qiyinchilik', example: 'Every challenge is a chance to grow.', translation: 'Har bir qiyinchilik o\'sish imkoniyatidir.' },
  { en: 'achieve', uz: 'erishmoq', example: 'You can achieve anything.', translation: 'Siz hamma narsaga erisha olasiz.' },
  { en: 'develop', uz: 'rivojlantirmoq', example: 'We must develop new skills.', translation: 'Biz yangi ko\'nikmalarni rivojlantirishimiz kerak.' },
  { en: 'improve', uz: 'yaxshilamoq', example: 'Practice helps improve.', translation: 'Amaliyot yaxshilashga yordam beradi.' },
  { en: 'determined', uz: 'qat\'iy', example: 'He is determined to succeed.', translation: 'U muvaffaqiyatga qat\'iy intiladi.' },
  { en: 'motivate', uz: 'rag\'batlantirmoq', example: 'Teachers motivate students.', translation: 'O\'qituvchilar o\'quvchilarni rag\'batlantiradi.' },
  { en: 'brilliant', uz: 'ajoyib', example: 'That\'s a brilliant idea!', translation: 'Bu ajoyib fikr!' },
  { en: 'courage', uz: 'jasorat', example: 'Courage is not the absence of fear.', translation: 'Jasorat qo\'rquvning yo\'qligi emas.' },
  { en: 'wisdom', uz: 'donolik', example: 'Wisdom comes with experience.', translation: 'Donolik tajriba bilan keladi.' },
  { en: 'faith', uz: 'ishonch', example: 'Have faith in yourself.', translation: 'O\'zingizga ishoning.' },
  { en: 'honesty', uz: 'halollik', example: 'Honesty is the best policy.', translation: 'Halollik eng yaxshi siyosatdir.' },
  { en: 'grateful', uz: 'minnatdor', example: 'I am grateful for your help.', translation: 'Yordamingiz uchun minnatdorman.' },
  { en: 'patience', uz: 'sabr', example: 'Patience is a virtue.', translation: 'Sabr - fazilat.' },
  { en: 'ambition', uz: 'ambitsiya', example: 'His ambition is limitless.', translation: 'Uning ambitsiyasi cheksiz.' },
  { en: 'creative', uz: 'ijodiy', example: 'She has a creative mind.', translation: 'U ijodiy fikrlaydi.' },
  { en: 'kindness', uz: 'mehribonlik', example: 'Kindness changes the world.', translation: 'Mehribonlik dunyoni o\'zgartiradi.' },
  { en: 'success', uz: 'muvaffaqiyat', example: 'Success requires effort.', translation: 'Muvaffaqiyat harakat talab qiladi.' },
  { en: 'failure', uz: 'muvaffaqiyatsizlik', example: 'Failure is a stepping stone.', translation: 'Muvaffaqiyatsizlik - pog\'ona.' },
  { en: 'believe', uz: 'ishonmoq', example: 'Believe in your dreams.', translation: 'Orzularingizga ishoning.' },
  { en: 'grow', uz: 'o\'smoq', example: 'Plants grow with water.', translation: 'O\'simliklar suv bilan o\'sadi.' },
  { en: 'learn', uz: 'o\'rganmoq', example: 'We learn every day.', translation: 'Biz har kuni o\'rganamiz.' },
  { en: 'teach', uz: 'o\'rgatmoq', example: 'Life teaches us lessons.', translation: 'Hayot bizga saboq beradi.' },
  { en: 'peace', uz: 'tinchlik', example: 'Peace begins with a smile.', translation: 'Tinchlik tabassumdan boshlanadi.' },
  { en: 'hope', uz: 'umid', example: 'Hope keeps us going.', translation: 'Umid bizni davom ettirishga undaydi.' },
];

// Kunlik so'zni olish
let lastWordIndex = 0;

function getDailyWord() {
  const word = words[lastWordIndex % words.length];
  lastWordIndex++;
  return word;
}

// Bugungi so'zni olish (kunga qarab)
function getWordOfDay() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return words[dayOfYear % words.length];
}

// Random so'z
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Test savollari
function getQuizQuestions(count = 5) {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(word => ({
    question: `"${word.en}" so'zining ma'nosi nima?`,
    options: [
      word.uz,
      words[Math.floor(Math.random() * words.length)].uz,
      words[Math.floor(Math.random() * words.length)].uz,
      words[Math.floor(Math.random() * words.length)].uz
    ].sort(() => Math.random() - 0.5),
    correct: word.uz,
    word: word
  }));
}

module.exports = {
  words,
  getDailyWord,
  getWordOfDay,
  getRandomWord,
  getQuizQuestions
};