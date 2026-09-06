import { groupBy } from "@/utils/arrayHelpers";
import type { StandeeData } from "../../data";

export interface StandeeGroupItem {
  index: number;
  standee: StandeeData;
  tally: number;
}

export interface StandeeGroup {
  character: string;
  items: StandeeGroupItem[];
}

export function getGridColumnClass(numCharacters: number): string {
  if (numCharacters <= 1) return "grid-cols-1";
  if (numCharacters <= 4) return "grid-cols-1 sm:grid-cols-2";
  if (numCharacters <= 8) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}

export function getTallyBadgeClass(numCharacters: number): string {
  if (numCharacters <= 1) return "-top-0.5 right-0.25 text-2xl";
  if (numCharacters <= 4) return "-top-0.5 right-0.25 text-lg leading-none";
  return "-top-0.5 right-0.25 text-[10px]";
}

export function groupByCharacter(
  standeeData: StandeeData[],
  tallies: number[],
): StandeeGroup[] {
  const items: StandeeGroupItem[] = standeeData.map((standee, index) => ({
    index,
    standee,
    tally: tallies[index],
  }));

  const grouped = groupBy(items, (item) => item.standee.character);

  return Array.from(grouped, ([character, groupItems]) => ({
    character,
    items: groupItems,
  }));
}
