"use client";

import { type FC, useState } from "react";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import Figure from "@/components/story/shared/Figure";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import COLORS from "@/utils/styles";

function format(probability: number, dec = 0): string {
  return `${(probability * 100).toFixed(dec)}%`;
}

interface CoinFlipTableProps {
  caption?: string;
}

const cellClass = "text-center py-3 px-4 border border-black/10";

const CoinFlipTable: FC<CoinFlipTableProps> = ({ caption }) => {
  const [headsProb, setHeadsProb] = useState(0.5);
  const tailsProb = 1 - headsProb;
  const pairProb = headsProb * tailsProb;

  return (
    <Figure caption={caption}>
      <LabeledSlider
        min={0.01}
        max={0.99}
        step={0.01}
        value={headsProb}
        handleValueChange={setHeadsProb}
        title={`Probability of flipping heads: ${format(headsProb)}`}
        color={COLORS.GREEN}
      />
      {/* Fixed column widths prevent the cells from resizing as text changes. */}
      <div className="mt-3 w-full overflow-x-auto text-center">
        <table className="mx-auto w-full table-fixed border-collapse border shadow-sm">
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/4" />
          </colgroup>
          <thead>
            <tr>
              {["Prob. of H", "Prob. of T", "Prob. of HT", "Prob. of TH"].map(
                (h) => (
                  <th
                    key={h}
                    className={`${cellClass} bg-black/[0.03] font-extrabold uppercase tracking-wider text-sm`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cellClass}>{format(headsProb)}</td>
              <td className={cellClass}>{format(tailsProb)}</td>
              <td className={cellClass}>
                {format(headsProb)} &times; {format(tailsProb)} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>
                  {format(pairProb, 2)}
                </ColoredSpan>
              </td>
              <td className={cellClass}>
                {format(tailsProb)} &times; {format(headsProb)} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>
                  {format(pairProb, 2)}
                </ColoredSpan>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Figure>
  );
};

export default CoinFlipTable;
