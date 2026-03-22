
// can't use named functions
// names are removed during minification
const strategies = [
  {
    name: "mostPlentiful",
    fn: fruitCounts =>{
      const maxCount = Math.max(...fruitCounts);
      return fruitCounts.findIndex(c => c === maxCount);
    }
  },
  {
    name: "leastPlentiful",
    fn: fruitCounts => {
      const minCount = Math.min(...fruitCounts.filter(c => c > 0));
      return fruitCounts.findIndex(c => c === minCount);
    }
  },
  {
    name: "random",
    fn: fruitCounts => {
      const validIndices = [];
      for (var i = 0; i < fruitCounts.length; i++) {
        if (fruitCounts[i] > 0) validIndices.push(i);
      }
      const randomIndex = Math.floor(Math.random() * validIndices.length);
      return validIndices[randomIndex];
    }
  },
  {
    name: "favoriteColor",
    fn: fruitCounts => fruitCounts.findIndex(c => c > 0)
  }
];

export default strategies;
