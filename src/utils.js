// Yordamchi funksiyalar
function formatDate(date) {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

module.exports = {
  formatDate,
  shuffleArray,
  capitalize
};