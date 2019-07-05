function generatePAdicPoints(prime, level) {
  const points = Array.from({ length: prime }, (_, i) => {
    const angle = (Math.PI * 2 * i) / prime + Math.PI / 2;
    return {
      cx: Math.cos(angle),
      cy: Math.sin(angle),
      fillIdx: 0,
      num: i
    };
  });
  while (points.length < prime ** level) {
    const nextNum = points.length;
    const pAdicDigits = _pAdicExpansion(nextNum, prime);
    const lastDigit = pAdicDigits[pAdicDigits.length - 1];
    const highestPower = pAdicDigits.length - 1;
    points.push({
      cx: _pointSum(points, nextNum, highestPower, lastDigit, prime, "cx"),
      cy: _pointSum(points, nextNum, highestPower, lastDigit, prime, "cy"),
      fillIdx: Math.floor(Math.log(nextNum) / Math.log(prime)),
      num: nextNum
    });
  }
  return points;
}

// recurrence relation for generating graphical representation
// of a point in p-adic space given points already calculated.
function _pointSum(points, n, k, a_k, prime, key) {
  const firstIdx = n % prime ** k;
  const secondIdx = (n + a_k * prime ** (k - 1)) % prime ** k;
  return ((prime - 1) * points[firstIdx][key] + points[secondIdx][key]) / prime;
}

// return the p-adic expansion of a number as an array.
// Example: _pAdicExpansion(11, 3) -> [2, 0, 1]
function _pAdicExpansion(num, prime) {
  if (num < 0) return "num must be a nonnegative integer.";
  let maxPrimePower = _largestPrimePower(num, prime);
  let coefficients = Array.from({ length: maxPrimePower + 1 }).fill(0);
  for (let currentExp = coefficients.length - 1; currentExp > 0; currentExp--) {
    const currentCoeff = Math.floor(num / prime ** currentExp);
    coefficients[currentExp] = currentCoeff;
    num -= currentCoeff * prime ** currentExp;
  }
  coefficients[0] = num;
  return coefficients;
}

// returns the largest power of p which is less than n.
// Example: _largestPrimePower(11, 3) should return 2
function _largestPrimePower(n, p) {
  if (n === 0) return 0;
  return Math.floor(Math.log(n) / Math.log(p));
}

function animationStart(num, prime, points, colorsArr) {
  let firstIdx = 0;
  let exponent = _largestPrimePower(num, prime);
  if (exponent > 0) firstIdx = num % prime ** exponent;
  return { ...points[firstIdx], fill: colorsArr[points[firstIdx].fillIdx], opacity: 0 };
}

function animationLeave(d, i) {
  return {
    opacity: [0],
    timing: { duration: 500, delay: i * 10 }
  };
}

function animationUpdate(d, i, colorsArr) {
  return {
    cx: [d.cx],
    cy: [d.cy],
    fill: [colorsArr[d.fillIdx]],
    opacity: [1],
    timing: { duration: 500, delay: i * 10 }
  };
}

export { generatePAdicPoints, animationStart, animationUpdate, animationLeave };
