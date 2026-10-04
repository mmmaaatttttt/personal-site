import type { FC } from "react";
import StyledTable from "@/components/story/shared/StyledTable";
import type { UsHappinessYear } from "../../data";
import { computeRankDeltas } from "./utils";

interface HappinessRankTableProps {
  rows: UsHappinessYear[];
}

const RankDelta: FC<{ rankDelta: number | null }> = ({ rankDelta }) => {
  if (rankDelta === null) return "—";
  if (rankDelta === 0) return <span className="text-gray-400">—</span>;

  const improved = rankDelta > 0;
  return (
    <span className={improved ? "text-green-600" : "text-red-600"}>
      <span className="sr-only">
        {improved ? "improved" : "worsened"} by {Math.abs(rankDelta)}
      </span>
      <span aria-hidden="true">
        {improved ? "▲" : "▼"} {Math.abs(rankDelta)}
      </span>
    </span>
  );
};

const HappinessRankTable: FC<HappinessRankTableProps> = ({ rows }) => {
  const deltaRows = computeRankDeltas(rows);

  return (
    <StyledTable
      headers={[
        { key: "year", content: "Year" },
        { key: "score", content: "Happiness Score" },
        { key: "rank", content: "Rank" },
        { key: "delta", content: "Change from Previous Year" },
      ]}
      rows={deltaRows.map((row) => ({
        key: row.year,
        cells: [
          { key: "year", content: row.year },
          { key: "score", content: row.score.toFixed(2) },
          { key: "rank", content: row.rank },
          {
            key: "delta",
            content: <RankDelta rankDelta={row.rankDelta} />,
          },
        ],
      }))}
    />
  );
};

export default HappinessRankTable;
