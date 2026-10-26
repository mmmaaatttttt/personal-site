import type { FC } from "react";

interface RankDeltaProps {
  rankDelta: number | null;
}

const RankDelta: FC<RankDeltaProps> = ({ rankDelta }) => {
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

export default RankDelta;
