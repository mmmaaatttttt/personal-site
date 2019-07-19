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

/**
 * Calculates the Jaccard Distance between two collections:
 * https://en.wikipedia.org/wiki/Jaccard_index
 *
 * Inputs are assumed to be arrays. Determines the intersection and the union,
 * uses the sizes of these collections to calculate the distance.
 * @param {Array} arr1
 * @param {Array} arr2
 */
function jaccardDistance(arr1, arr2) {
  let intersectionSize = intersection(arr1, arr2).size;
  let unionSize = union(arr1, arr2).size;
  return (unionSize - intersectionSize) / unionSize;
}

/**
 * Calculate the set union between two arrays or sets.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
 *
 * @param {Array || Set} collection1
 * @param {Array || Set} collection2
 */
function union(collection1, collection2) {
  return new Set([...collection1, ...collection2]);
}

/**
 * Calculate the set intersection between two arrays or sets.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
 *
 * @param {Array || Set} collection1
 * @param {Array || Set} collection2
 */
function intersection(collection1, collection2) {
  if (Array.isArray(collection1)) collection1 = new Set(collection1);
  if (Array.isArray(collection2)) collection2 = new Set(collection2);
  let _intersection = new Set();
  for (let item of collection2) {
    if (collection1.has(item)) _intersection.add(item);
  }
  return _intersection;
}

export { generateFreqMap, jaccardDistance };
