export function hammingDistance(str1: string, str2: string): number {
  if (str1.length !== str2.length)
    throw new Error("strings must have the same length.");
  let diffCount = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) diffCount++;
  }
  return diffCount;
}

export function levenshteinDistance(str1: string, str2: string): number {
  return _editDistance(str1, str2, str1.length, str2.length, {}, false);
}

export function damerauLevenshteinDistance(str1: string, str2: string): number {
  return _editDistance(str1, str2, str1.length, str2.length, {}, true);
}

function _editDistance(
  str1: string,
  str2: string,
  len1: number,
  len2: number,
  memo: Record<string, number>,
  swapsAllowed: boolean,
): number {
  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  memo[`${len1 - 1}|${len2}`] =
    memo[`${len1 - 1}|${len2}`] ??
    _editDistance(str1, str2, len1 - 1, len2, memo, swapsAllowed);

  memo[`${len1}|${len2 - 1}`] =
    memo[`${len1}|${len2 - 1}`] ??
    _editDistance(str1, str2, len1, len2 - 1, memo, swapsAllowed);

  memo[`${len1 - 1}|${len2 - 1}`] =
    memo[`${len1 - 1}|${len2 - 1}`] ??
    _editDistance(str1, str2, len1 - 1, len2 - 1, memo, swapsAllowed);

  const cost = str1[len1 - 1] === str2[len2 - 1] ? 0 : 1;
  let dist = Math.min(
    memo[`${len1 - 1}|${len2}`] + 1,
    memo[`${len1}|${len2 - 1}`] + 1,
    memo[`${len1 - 1}|${len2 - 1}`] + cost,
  );

  if (
    swapsAllowed &&
    len1 > 1 &&
    len2 > 1 &&
    str1[len1 - 1] === str2[len2 - 2] &&
    str1[len1 - 2] === str2[len2 - 1]
  ) {
    dist = Math.min(dist, memo[`${len1 - 2}|${len2 - 2}`] + cost);
  }

  return dist;
}
