const strategies = [
  function mostPlentiful(fruitCounts) {
    const maxCount = Math.max(...fruitCounts);
    return fruitCounts.findIndex(c => c === maxCount);
  },
  function leastPlentiful(fruitCounts) {
    const minCount = Math.min(...fruitCounts.filter(c => c > 0));
    return fruitCounts.findIndex(c => c === minCount);
  },
  function random(fruitCounts) {
    const validIndices = [];
    for (var i = 0; i < fruitCounts.length; i++) {
      if (fruitCounts[i] > 0) validIndices.push(i);
    }
    const randomIndex = Math.floor(Math.random() * validIndices.length);
    return validIndices[randomIndex];
  },
  function favoriteColor(fruitCounts) {
    return fruitCounts.findIndex(c => c > 0);
  }
];

export default strategies;
