/**
 * For strings of the same length, calculates the number of characters
 * at corresponding position in the strings which are different.
 * @param {String} str1
 * @param {String} str2
 */
function hammingDistance(str1, str2) {
  if (str1.length !== str2.length)
    throw new Error("strings must have the same length.");
  let diffCount = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) diffCount++;
  }
  return diffCount;
}

/**
 * For strings of any length, calculate the Levenshtein distance between them.
 * See https://en.wikipedia.org/wiki/Levenshtein_distance for more details.
 * @param {String} str1
 * @param {String} str2
 */
function levenshteinDistance(
  str1,
  str2,
  len1 = str1.length,
  len2 = str2.length,
  memo = {}
) {
  return _editDistance(str1, str2, len1, len2, memo);
}

/**
 * For strings of any length, calculate the Damerau-Levenshtein distance between them.
 * See https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance for more details.
 * @param {String} str1
 * @param {String} str2
 */
function damerauLevenshteinDistance(
  str1,
  str2,
  len1 = str1.length,
  len2 = str2.length,
  memo = {}
) {
  return _editDistance(str1, str2, len1, len2, memo, true);
}

function _editDistance(
  str1,
  str2,
  len1 = str1.length,
  len2 = str2.length,
  memo = {},
  swapsAllowed = false
) {
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // deletion
  memo[`${len1 - 1}|${len2}`] =
    memo[`${len1 - 1}|${len2}`] ||
    _editDistance(str1, str2, len1 - 1, len2, memo, swapsAllowed);

  // insertion
  memo[`${len1}|${len2 - 1}`] =
    memo[`${len1}|${len2 - 1}`] ||
    _editDistance(str1, str2, len1, len2 - 1, memo, swapsAllowed);

  // substitution
  memo[`${len1 - 1}|${len2 - 1}`] =
    memo[`${len1 - 1}|${len2 - 1}`] ||
    _editDistance(str1, str2, len1 - 1, len2 - 1, memo, swapsAllowed);

  let cost = str1[len1 - 1] === str2[len2 - 1] ? 0 : 1;

  let dist = Math.min(
    memo[`${len1 - 1}|${len2}`] + 1,
    memo[`${len1}|${len2 - 1}`] + 1,
    memo[`${len1 - 1}|${len2 - 1}`] + cost
  );

  let lastTwoSwapped =
    len1 > 1 &&
    len2 > 1 &&
    str1[len1 - 1] === str2[len2 - 2] &&
    str1[len1 - 2] === str2[len2 - 1];

  if (swapsAllowed && lastTwoSwapped) {
    // transposition
    memo[`${len1 - 2}|${len2 - 2}`] =
      memo[`${len1 - 2}|${len2 - 2}`] ||
      _editDistance(str1, str2, len1 - 2, len2 - 2, memo, swapsAllowed);
    dist = Math.min(dist, memo[`${len1 - 2}|${len2 - 2}`] + cost);
  }

  return dist;
}

export { hammingDistance, levenshteinDistance, damerauLevenshteinDistance };
