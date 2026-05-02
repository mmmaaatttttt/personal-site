"use client";

import { type FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import COLORS from "@/utils/styles";

function format(probability: number, dec = 0): string {
  return `${(probability * 100).toFixed(dec)}%`;
}

interface CoinFlipTableProps {
  caption?: string;
}

// Shared cell style matching StyledTable appearance
const cellStyle = {
  textAlign: "center" as const,
  padding: "0.75rem 1rem",
  border: "1px solid rgba(0, 0, 0, 0.1)",
};

const CoinFlipTable: FC<CoinFlipTableProps> = ({ caption }) => {
  const [headsProb, setHeadsProb] = useState(0.5);
  const tailsProb = 1 - headsProb;
  const pairProb = headsProb * tailsProb;

  return (
    <Caption caption={caption}>
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
      <div className="my-12 w-full overflow-x-auto text-center">
        <table
          className="mx-auto w-full border-collapse border shadow-sm"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr>
              {["Prob. of H", "Prob. of T", "Prob. of HT", "Prob. of TH"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      ...cellStyle,
                      backgroundColor: "rgba(0, 0, 0, 0.03)",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.875rem",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>{format(headsProb)}</td>
              <td style={cellStyle}>{format(tailsProb)}</td>
              <td style={cellStyle}>
                {format(headsProb)} &times; {format(tailsProb)} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>
                  {format(pairProb, 2)}
                </ColoredSpan>
              </td>
              <td style={cellStyle}>
                {format(tailsProb)} &times; {format(headsProb)} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>
                  {format(pairProb, 2)}
                </ColoredSpan>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Caption>
  );
};

export default CoinFlipTable;
