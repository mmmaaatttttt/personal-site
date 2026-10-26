import type { FC } from "react";
import StyledTable from "@/components/story/shared/StyledTable";
import type { UsHappinessYear } from "../../data/data";
import RankDelta from "./RankDelta";
import { computeRankDeltas } from "./utils";

interface HappinessRankTableProps {
  rows: UsHappinessYear[];
}

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
