import { cryptoRandom } from "@/utils/mathHelpers";
import type { StandeeData } from "./data";

export function standeesForCharacterCount(
  standeeData: StandeeData[],
  numCharacters: number,
): StandeeData[] {
  const characters: string[] = [];
  for (const standee of standeeData) {
    if (!characters.includes(standee.character)) {
      if (characters.length >= numCharacters) break;
      characters.push(standee.character);
    }
  }
  const characterSet = new Set(characters);
  return standeeData.filter((standee) => characterSet.has(standee.character));
}

export function computeStarterFlags(characters: string[]): boolean[] {
  return characters.map(
    (character, index) => index === 0 || character !== characters[index - 1],
  );
}

export type DrawStrategy = "random" | "guaranteed";

export interface Draw {
  index: number;
  strategy: DrawStrategy;
}

export function pickDraw(
  found: boolean[],
  switchStrategyAfter: number,
  rng: () => number = cryptoRandom,
): Draw {
  const foundCount = found.filter(Boolean).length;

  if (foundCount >= switchStrategyAfter) {
    return {
      index: found.findIndex((isFound) => !isFound),
      strategy: "guaranteed",
    };
  }

  return {
    index: Math.floor(rng() * found.length),
    strategy: "random",
  };
}

export function pickInitialOwned(
  numStandees: number,
  alreadyOwned: number,
  rng: () => number = cryptoRandom,
): boolean[] {
  const owned = new Array<boolean>(numStandees).fill(false);
  const indices = Array.from({ length: numStandees }, (_, i) => i);
  const count = Math.min(alreadyOwned, numStandees);

  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (numStandees - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
    owned[indices[i]] = true;
  }

  return owned;
}

export interface RunResult {
  totalCost: number;
  randomDraws: number;
  guaranteedDraws: number;
}

export function simulateFullRun(
  numStandees: number,
  switchStrategyAfter: number,
  randomCost: number,
  guaranteedCost: number,
  rng: () => number = cryptoRandom,
): RunResult {
  const found = new Array<boolean>(numStandees).fill(false);
  let randomDraws = 0;
  let guaranteedDraws = 0;
  let foundCount = 0;

  while (foundCount < numStandees) {
    const draw = pickDraw(found, switchStrategyAfter, rng);
    if (draw.strategy === "random") {
      randomDraws++;
    } else {
      guaranteedDraws++;
    }
    if (!found[draw.index]) {
      found[draw.index] = true;
      foundCount++;
    }
  }

  return {
    totalCost: randomDraws * randomCost + guaranteedDraws * guaranteedCost,
    randomDraws,
    guaranteedDraws,
  };
}

export function harmonicNumber(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += 1 / i;
  return sum;
}

export function expectedRandomDraws(
  numStandees: number,
  switchStrategyAfter: number,
): number {
  const k = Math.min(switchStrategyAfter, numStandees);
  return (
    numStandees *
    (harmonicNumber(numStandees) - harmonicNumber(numStandees - k))
  );
}

export function expectedTotalDraws(
  numStandees: number,
  switchStrategyAfter: number,
): number {
  const k = Math.min(switchStrategyAfter, numStandees);
  return (
    expectedRandomDraws(numStandees, switchStrategyAfter) + (numStandees - k)
  );
}

export function expectedCost(
  numStandees: number,
  switchStrategyAfter: number,
  randomCost: number,
  guaranteedCost: number,
): number {
  const k = Math.min(switchStrategyAfter, numStandees);
  return (
    randomCost * expectedRandomDraws(numStandees, switchStrategyAfter) +
    guaranteedCost * (numStandees - k)
  );
}

export function optimalSwitchPoint(
  numStandees: number,
  randomCost: number,
  guaranteedCost: number,
): number {
  const raw = numStandees * (1 - randomCost / guaranteedCost);
  const candidates = [Math.floor(raw), Math.ceil(raw)].map((k) =>
    Math.min(numStandees, Math.max(0, k)),
  );

  let best = candidates[0];
  let bestCost = expectedCost(numStandees, best, randomCost, guaranteedCost);
  for (const k of candidates) {
    const cost = expectedCost(numStandees, k, randomCost, guaranteedCost);
    if (cost < bestCost) {
      best = k;
      bestCost = cost;
    }
  }
  return best;
}

export type Tier = "black" | "silver" | "gold";

const BLACK_POSES = new Set(["Jumping", "Posing", "Crouching", "Swimming"]);
const GOLD_POSES = new Set(["Balloon", "Goomba", "Hoppycat", "Spike Ball"]);

export function getTier(pose: string): Tier {
  if (BLACK_POSES.has(pose)) return "black";
  if (GOLD_POSES.has(pose)) return "gold";
  return "silver";
}

export type TierWeights = Record<Tier, number>;
