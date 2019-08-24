const bezier = require('./bezier-easing')
const base = 10; // min

const times = 15
Array.from({
  length: times
}).reduce((b, c, i) => {
  const increase = bezier(.78, .18, .71, .32)((i + 1) / 5);
  b = b * (1 + increase);
  // console.log(`No.${i+1}`, dd(b), increase);
  console.log(`No.${i}`, dd(b), increase);
  return b;
}, base);

function dd(peroid) {
  if (peroid < 60) return parseInt(peroid) + 'm';
  if (peroid < 24 * 60) return parseInt(peroid / 60) + 'h';
  if (peroid < 30 * 24 * 60) return parseInt(peroid / (24 * 60)) + 'd';
  if (peroid < 12 * 30 * 24 * 60) return parseInt(peroid / (30 * 24 * 60)) + 'M';
  return parseInt(peroid / (12 * 30 * 24 * 60)) + 'Y';
}

exports.generateLevels = function generateLevels() {
  const times = 15;
  let base = 10;
  return Array.from({
    length: times
  }).map((r, i) => {
    const increase = bezier(.78, .18, .71, .32)((i + 1) / 5);
    base = base * (1 + increase);
    return parseInt(base);
  });
}