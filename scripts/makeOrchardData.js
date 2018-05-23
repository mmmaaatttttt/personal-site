import strategies from "../src/data/orchard-game-strategies.js";
import fs from "fs";

const colorCountMax = 5;
const wildCardCountMax = 5;
const fruitsPerColorMax = 12;
const ravenCountMax = 12;
const total =
  colorCountMax * wildCardCountMax * fruitsPerColorMax * ravenCountMax;
const data = [];
let percent = 0;

// update random strategy for dynamic programming approach
strategies[2] = function random(fruitCounts) {
  const possibleNewCounts = [];
  for (var i = 0; i < fruitCounts.length; i++) {
    if (fruitCounts[i] > 0) {
      let copy = [...fruitCounts];
      copy[i]--;
      possibleNewCounts.push(copy);
    }
  }
  return possibleNewCounts;
};

for (let colorCount = 1; colorCount <= colorCountMax; colorCount++) {
  for (
    let wildCardCount = 1;
    wildCardCount <= wildCardCountMax;
    wildCardCount++
  ) {
    let memo = {};
    for (
      let fruitsPerColor = 1;
      fruitsPerColor <= fruitsPerColorMax;
      fruitsPerColor++
    ) {
      for (let ravenCount = 1; ravenCount <= ravenCountMax; ravenCount++) {
        let datum = {
          colors: colorCount,
          fruits: fruitsPerColor,
          r: ravenCount,
          wc: wildCardCount,
          probs: {}
        };
        strategies.forEach(strategy => {
          datum.probs[strategy.name] = probWin(
            Array(colorCount).fill(fruitsPerColor),
            ravenCount,
            wildCardCount,
            strategy,
            memo
          );
        });
        data.push(datum);
        let newPercent = (data.length / total * 100).toFixed(1);
        if (+newPercent > percent) {
          percent = newPercent;
          console.log(
            `${percent}% complete.`,
            `colorCount: ${colorCount}`,
            `wildCardCount: ${wildCardCount}`,
            `fruitsPerColor: ${fruitsPerColor}`,
            `ravenCount: ${ravenCount}`
          );
        }
      }
    }
  }
}

console.log("about to write to this file");
fs.writeFile("static/data/orchard_game.json", JSON.stringify(data), err => {
  if (err) throw err;
  console.log("file write complete!");
});

function probWin(fruitCounts, ravenCount, wildCardCount, strategy, memo = {}) {
  // check base cases
  if (ravenCount === 0) return 0;
  if (fruitCounts.every(count => count === 0)) return 1;

  // check if previously calculated
  let countsForKey = [...fruitCounts];
  if (strategy.name !== "favoriteColor") countsForKey.sort((a, b) => a - b);
  let key =
    ravenCount + "," + countsForKey + "," + wildCardCount + "," + strategy.name;
  if (memo[key]) return memo[key];

  // calculate
  let fruitsLeft = fruitCounts.filter(Boolean).length;
  let total = fruitsLeft + 2;

  // raven
  let prob = probWin(
    fruitCounts,
    ravenCount - 1,
    wildCardCount,
    strategy,
    memo
  );

  // fruit basket
  let strategyCopy = [...fruitCounts];
  let fruitsRemaining = strategyCopy.reduce((total, count) => total + count, 0);
  let probFromFruitBasket = 0;
  if (fruitsRemaining <= wildCardCount) probFromFruitBasket = 1;
  else if (strategy.name !== "random") {
    for (var i = 0; i < wildCardCount; i++) {
      let idx = strategy(strategyCopy);
      strategyCopy[idx]--;
    }
    probFromFruitBasket = probWin(
      strategyCopy,
      ravenCount,
      wildCardCount,
      strategy,
      memo
    );
  } else {
    // for random strategy, check all possible outcomes
    let possibleNewCounts = [strategyCopy];
    for (var i = 0; i < wildCardCount; i++) {
      let newCounts = [];
      possibleNewCounts.forEach(countsArr => {
        newCounts = newCounts.concat(strategy(countsArr));
      });
      possibleNewCounts = newCounts;
    }
    possibleNewCounts.forEach(countsArr => {
      probFromFruitBasket +=
        probWin(countsArr, ravenCount, wildCardCount, strategy, memo) /
        possibleNewCounts.length;
    });
  }
  prob += probFromFruitBasket;

  // remaining fruits
  fruitCounts.forEach((fruitCount, idx) => {
    if (fruitCount === 0) return;
    let fruitCopy = [...fruitCounts];
    fruitCopy[idx] = fruitCount - 1;
    let multiplier = 1;
    prob += probWin(fruitCopy, ravenCount, wildCardCount, strategy, memo);
  });
  memo[key] = prob / total;
  return memo[key];
}
