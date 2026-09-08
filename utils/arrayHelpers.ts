/**
 * Returns a frequency map of the array values (value → count).
 */
export function generateFreqMap<T>(arr: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const item of arr) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }
  return map;
}

/**
 * Partitions an array into groups by a key function, preserving each
 * group's items in original order and each group in first-seen order.
 */
export function groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of arr) {
    const key = keyFn(item);
    const group = map.get(key);
    if (group) group.push(item);
    else map.set(key, [item]);
  }
  return map;
}
