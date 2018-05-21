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
    const validIndices = fruitCounts
      .map((count, idx) => ({ count, idx }))
      .filter(obj => obj.count > 0)
      .map(obj => obj.idx);
    const randomIndex = Math.floor(Math.random() * validIndices.length);
    return validIndices[randomIndex];
  },
  function favoriteColor(fruitCounts) {
    return fruitCounts.findIndex(c => c > 0);
  }
];

export default strategies;
