// Draws random tiles until every fruit color is harvested (win) or the raven arrives (loss).
export function simulateGame(
  fruitCounts: number[],
  ravenCount: number,
  wildCardCount: number,
  strategyFn: (counts: number[]) => number,
): boolean {
  const counts = [...fruitCounts];
  let raven = ravenCount;
  const colorCount = counts.length;

  while (true) {
    const idx = Math.floor((colorCount + 2) * Math.random());
    if (idx < colorCount) {
      counts[idx] = Math.max(counts[idx] - 1, 0);
    } else if (idx === colorCount) {
      raven--;
    } else {
      for (let i = 0; i < wildCardCount; i++) {
        const si = strategyFn(counts);
        counts[si] = Math.max(counts[si] - 1, 0);
      }
    }
    if (counts.every((c) => c === 0)) return true;
    if (raven === 0) return false;
  }
}
