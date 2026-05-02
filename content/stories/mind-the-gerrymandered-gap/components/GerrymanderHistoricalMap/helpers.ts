import usTopoRaw from "@/components/story/shared/USMap/us-topo.json";
import { lightenHex } from "@/utils/colorHelpers";
import COLORS from "@/utils/styles";
import type { ElectionRow, StateSummary } from "../../data";

const stateCodeMap: Record<string, string> = {};
for (const geom of (usTopoRaw as any).objects.states.geometries) {
  stateCodeMap[geom.properties.name] = geom.properties.code;
}

export function getStateCode(stateName: string): string {
  return stateCodeMap[stateName] ?? stateName;
}

export function getStateBarColor(seatGap: number): string {
  const base = seatGap > 0 ? COLORS.RED : COLORS.DARK_BLUE;
  return Math.abs(seatGap) < 2 ? lightenHex(base, 0.4) : base;
}

export function computeFillValue(
  yearRowCount: number,
  minElectors: number,
  efficiencyGap: number | undefined,
): number | null {
  if (yearRowCount < minElectors || efficiencyGap === undefined) return null;
  return efficiencyGap;
}

export function formatTooltip(
  yearRowCount: number,
  minElectors: number,
  efficiencyGap: number | undefined,
  seatGap: number | undefined,
): string | string[] {
  if (yearRowCount < minElectors) return "Not enough districts.";
  if (efficiencyGap === undefined || seatGap === undefined) return "No data.";
  const favoredParty = efficiencyGap < 0 ? "Democrats" : "Republicans";
  const pct = Math.abs(efficiencyGap * 100);
  return [
    `${pct.toFixed(2)}% efficiency gap in favor of ${favoredParty}.`,
    `${yearRowCount} districts total.`,
    `${Math.abs(seatGap).toFixed(2)} seat gap.`,
  ];
}

export function buildBarData(
  year: number,
  minElectors: number,
  electionData: ElectionRow[],
  stateSummaries: StateSummary[],
): { key: string; height: number; color: string }[] {
  const countByState: Record<string, number> = {};
  for (const row of electionData) {
    if (row.year === year) {
      countByState[row.state] = (countByState[row.state] ?? 0) + 1;
    }
  }

  return stateSummaries
    .filter((s) => (countByState[s.state] ?? 0) >= minElectors)
    .map((s) => {
      const seatGap = s.seatGaps[year] ?? 0;
      return {
        key: getStateCode(s.state),
        height: Math.abs(seatGap),
        color: getStateBarColor(seatGap),
      };
    })
    .sort((a, b) => a.height - b.height);
}
