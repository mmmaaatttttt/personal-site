/**
 * Converts an array to a Map of key-value pairs,
 * where each key is an array element, and each value
 * is the frequency of the element in the array.
 *
 * @param {Array} array of values
 */
function generateFreqMap(arr) {
  const map = new Map();
  for (let val of arr) {
    let count = 0;
    if (map.has(val)) count = map.get(val);
    map.set(val, count + 1);
  }
  return map;
}

export { generateFreqMap };
