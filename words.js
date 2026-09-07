// src/words.js
// Ingliz tili so'zlar bazasi (kamida 50 ta) + kunlik/random/test so'zlarini olish funksiyalari

const words = [
  { en: "Abundant", uz: "Mo'l-ko'l", example: "The region has abundant natural resources.", translation: "Bu hududda tabiiy resurslar mo'l-ko'l." },
  { en: "Achieve", uz: "Erishmoq", example: "She worked hard to achieve her goals.", translation: "U o'z maqsadlariga erishish uchun qattiq mehnat qildi." },
  { en: "Ancient", uz: "Qadimiy", example: "They found ancient ruins in the desert.", translation: "Ular sahroda qadimiy xarobalarni topishdi." },
  { en: "Announce", uz: "E'lon qilmoq", example: "The teacher will announce the results tomorrow.", translation: "O'qituvchi natijalarni ertaga e'lon qiladi." },
  { en: "Apologize", uz: "Uzr so'ramoq", example: "He apologized for being late.", translation: "U kech qolgani uchun uzr so'radi." },
  { en: "Appreciate", uz: "Qadrlamoq", example: "I really appreciate your help.", translation: "Men sizning yordamingizni chin dildan qadrlayman." },
  { en: "Approach", uz: "Yondashuv", example: "We need a new approach to this problem.", translation: "Bizga bu muammoga yangi yondashuv kerak." },
  { en: "Argue", uz: "Bahslashmoq", example: "They often argue about small things.", translation: "Ular ko'pincha mayda-chuyda narsalar haqida bahslashishadi." },
  { en: "Attempt", uz: "Urinish", example: "She made an attempt to fix the car.", translation: "U mashinani ta'mirlashga urinib ko'rdi." },
  { en: "Available", uz: "Mavjud", example: "The doctor is not available today.", translation: "Doktor bugun band." },
  { en: "Awful", uz: "Dahshatli", example: "The weather was awful yesterday.", translation: "Kecha ob-havo juda yomon edi." },
  { en: "Behavior", uz: "Xulq-atvor", example: "His behavior surprised everyone.", translation: "Uning xulq-atvori hammani hayratda qoldirdi." },
  { en: "Benefit", uz: "Foyda", example: "Exercise has many health benefits.", translation: "Jismoniy mashqlar sog'liq uchun ko'plab foydalarga ega." },
  { en: "Brilliant", uz: "Ajoyib", example: "That was a brilliant idea.", translation: "Bu ajoyib g'oya edi." },
  { en: "Capable", uz: "Qobiliyatli", example: "She is capable of solving difficult problems.", translation: "U qiyin muammolarni yechishga qodir." },
  { en: "Career", uz: "Karyera", example: "He started his career as a teacher.", translation: "U o'z karyerasini o'qituvchi sifatida boshladi." },
  { en: "Challenge", uz: "Qiyinchilik", example: "Learning a new language is a big challenge.", translation: "Yangi til o'rganish katta sinovdir." },
  { en: "Comfortable", uz: "Qulay", example: "This chair is very comfortable.", translation: "Bu kreslo juda qulay." },
  { en: "Competition", uz: "Raqobat", example: "There is a lot of competition in this market.", translation: "Bu bozorda katta raqobat bor." },
  { en: "Confident", uz: "Ishonchli", example: "She felt confident before the exam.", translation: "U imtihon oldidan o'ziga ishongan edi." },
  { en: "Consider", uz: "Ko'rib chiqmoq", example: "Please consider my request.", translation: "Iltimos, mening so'rovimni ko'rib chiqing." },
  { en: "Convenient", uz: "Qulay", example: "This time is more convenient for me.", translation: "Bu vaqt men uchun qulayroq." },
  { en: "Curious", uz: "Qiziquvchan", example: "Children are naturally curious.", translation: "Bolalar tabiatan qiziquvchan bo'ladi." },
  { en: "Decision", uz: "Qaror", example: "It was a difficult decision to make.", translation: "Bu qiyin qaror edi." },
  { en: "Determine", uz: "Aniqlamoq", example: "The test will determine your level.", translation: "Test sizning darajangizni aniqlaydi." },
  { en: "Diligent", uz: "Tirishqoq", example: "He is a diligent student.", translation: "U tirishqoq talaba." },
  { en: "Encourage", uz: "Rag'batlantirmoq", example: "Parents should encourage their children to read.", translation: "Ota-onalar farzandlarini o'qishga rag'batlantirishlari kerak." },
  { en: "Enormous", uz: "Ulkan", example: "They live in an enormous house.", translation: "Ular ulkan uyda yashashadi." },
  { en: "Environment", uz: "Atrof-muhit", example: "We must protect the environment.", translation: "Biz atrof-muhitni asrashimiz kerak." },
  { en: "Essential", uz: "Zarur", example: "Water is essential for life.", translation: "Suv hayot uchun zarurdir." },
  { en: "Exhausted", uz: "Charchagan", example: "I was exhausted after the long trip.", translation: "Uzoq safardan so'ng men juda charchagandim." },
  { en: "Expensive", uz: "Qimmat", example: "This phone is too expensive for me.", translation: "Bu telefon men uchun juda qimmat." },
  { en: "Experience", uz: "Tajriba", example: "She has a lot of experience in teaching.", translation: "Uning o'qitishda katta tajribasi bor." },
  { en: "Familiar", uz: "Tanish", example: "This song sounds familiar.", translation: "Bu qo'shiq tanish eshitiladi." },
  { en: "Frequent", uz: "Tez-tez uchraydigan", example: "There are frequent buses to the city center.", translation: "Shahar markaziga tez-tez avtobuslar qatnaydi." },
  { en: "Generous", uz: "Saxiy", example: "He is very generous with his money.", translation: "U pulga nisbatan juda saxiy." },
  { en: "Habit", uz: "Odat", example: "Reading before bed is a good habit.", translation: "Uxlashdan oldin kitob o'qish yaxshi odat." },
  { en: "Improve", uz: "Yaxshilamoq", example: "I want to improve my English.", translation: "Men ingliz tilimni yaxshilamoqchiman." },
  { en: "Independent", uz: "Mustaqil", example: "She became independent at a young age.", translation: "U yosh vaqtida mustaqil bo'ldi." },
  { en: "Influence", uz: "Ta'sir", example: "Friends can influence your decisions.", translation: "Do'stlar sizning qarorlaringizga ta'sir qilishi mumkin." },
  { en: "Journey", uz: "Sayohat", example: "Our journey took five hours.", translation: "Bizning sayohatimiz besh soat davom etdi." },
  { en: "Knowledge", uz: "Bilim", example: "Knowledge is power.", translation: "Bilim - bu kuch." },
  { en: "Manage", uz: "Boshqarmoq", example: "She manages a large team.", translation: "U katta jamoani boshqaradi." },
  { en: "Necessary", uz: "Zarur", example: "It is necessary to arrive on time.", translation: "Vaqtida yetib kelish zarur." },
  { en: "Opportunity", uz: "Imkoniyat", example: "This job is a great opportunity for you.", translation: "Bu ish siz uchun ajoyib imkoniyat." },
  { en: "Patience", uz: "Sabr", example: "Teaching children requires patience.", translation: "Bolalarni o'qitish sabr talab qiladi." },
  { en: "Persuade", uz: "Ishontirmoq", example: "He tried to persuade me to stay.", translation: "U meni qolishga ishontirishga harakat qildi." },
  { en: "Reliable", uz: "Ishonchli", example: "She is a reliable friend.", translation: "U ishonchli do'st." },
  { en: "Struggle", uz: "Kurash", example: "Many students struggle with grammar.", translation: "Ko'p talabalar grammatika bilan kurashadi." },
  { en: "Success", uz: "Muvaffaqiyat", example: "Hard work leads to success.", translation: "Qattiq mehnat muvaffaqiyatga olib keladi." },
];

/**
 * Kun bo'yicha barqaror kunlik so'z qaytaradi.
 * Har kuni butun dunyo uchun bir xil so'z chiqadi (sana asosida hisoblanadi).
 */
function getDailyWord() {
  const startDate = new Date(2024, 0, 1); // boshlang'ich sana
  const now = new Date();
  const diffInDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
  const index = ((diffInDays % words.length) + words.length) % words.length;
  return words[index];
}

/**
 * Ro'yxatdan tasodifiy so'z qaytaradi.
 */
function getRandomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

/**
 * Massivni Fisher-Yates algoritmi bilan aralashtiradi (utils.js bilan mos).
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * `count` ta test savolini shakllantiradi.
 * Har bir savol: { question, options: [4 ta variant], correctIndex, wordEn }
 */
function getQuizQuestions(count = 5) {
  const total = Math.min(count, words.length);
  const chosenWords = shuffle(words).slice(0, total);

  return chosenWords.map((word) => {
    // 3 ta noto'g'ri variantni boshqa so'zlardan tanlaymiz
    const wrongPool = words.filter((w) => w.en !== word.en);
    const wrongOptions = shuffle(wrongPool)
      .slice(0, 3)
      .map((w) => w.uz);

    const allOptions = shuffle([word.uz, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(word.uz);

    return {
      question: `"${word.en}" so'zining tarjimasi qaysi?`,
      wordEn: word.en,
      example: word.example,
      translation: word.translation,
      options: allOptions,
      correctIndex,
    };
  });
}

module.exports = {
  words,
  getDailyWord,
  getRandomWord,
  getQuizQuestions,
};
