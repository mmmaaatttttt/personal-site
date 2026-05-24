"use client";

import type { FC } from "react";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import StyledTable from "@/components/story/shared/StyledTable";
import { calculateWastedVotes, total } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";

interface EfficiencyGapTableProps {
  districtCounts: [number, number][] | null;
}

const EfficiencyGapTable: FC<EfficiencyGapTableProps> = ({
  districtCounts,
}) => {
  if (!districtCounts) {
    return (
      <p>
        <b>
          To see a sample calculation of the efficiency gap, please finish
          drawing your districts above.
        </b>
      </p>
    );
  }

  const blueAcc = (d: [number, number]) => d[0];
  const redAcc = (d: [number, number]) => d[1];
  const wastedVotes = calculateWastedVotes(districtCounts, blueAcc, redAcc);
  const totalWasted = wastedVotes.reduce<[number, number]>(
    ([b, r], [wb, wr]) => [b + wb, r + wr],
    [0, 0],
  );
  const totalVotes = total(districtCounts, (d) => d[0] + d[1]);
  const eg = (totalWasted[0] - totalWasted[1]) / totalVotes;

  let gapCopyEnd = "";
  if (totalWasted[0] !== totalWasted[1]) {
    gapCopyEnd = ` in favor of ${eg < 0 ? "blue" : "red"}`;
  }

  const gapCopy = (
    <span>
      (<ColoredSpan color={COLORS.DARK_BLUE}>{totalWasted[0]}</ColoredSpan>
      {" – "}
      <ColoredSpan color={COLORS.RED}>{totalWasted[1]}</ColoredSpan>){" ÷ "}
      {totalVotes} = {(Math.abs(eg) * 100).toFixed(2)}%{gapCopyEnd}.
    </span>
  );

  return (
    <div>
      <p>
        Here&rsquo;s a sample efficiency gap calculation based on the districts
        you created above.
      </p>
      <StyledTable>
        <thead>
          <tr>
            <th>District</th>
            <th className="text-dark-blue">Wasted Votes (Blue)</th>
            <th className="text-red">Wasted Votes (Red)</th>
          </tr>
        </thead>
        <tbody>
          {wastedVotes
            .map(([blue, red], i) => ({ blue, red, district: i + 1 }))
            .map(({ blue, red, district }) => (
              <tr key={district}>
                <td className="font-bold">{district}</td>
                <td className="text-dark-blue">{blue}</td>
                <td className="text-red">{red}</td>
              </tr>
            ))}
          <tr>
            <td className="font-bold">Total</td>
            <td className="text-dark-blue">{totalWasted[0]}</td>
            <td className="text-red">{totalWasted[1]}</td>
          </tr>
          <tr>
            <td className="font-bold">Efficiency Gap</td>
            <td colSpan={2}>{gapCopy}</td>
          </tr>
        </tbody>
      </StyledTable>
    </div>
  );
};

export default EfficiencyGapTable;
