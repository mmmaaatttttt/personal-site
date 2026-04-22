"use client";

import { FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import StyledTable from "@/components/story/shared/StyledTable";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import COLORS from "@/utils/styles";

function format(probability: number, dec = 0): string {
  return `${(probability * 100).toFixed(dec)}%`;
}

interface CoinFlipTableProps {
  caption?: string;
}

const CoinFlipTable: FC<CoinFlipTableProps> = ({ caption }) => {
  const [headsProb, setHeadsProb] = useState(0.5);
  const tailsProb = 1 - headsProb;
  const pairProb = headsProb * tailsProb;

  const headers = [
    { key: 0, content: "Prob. of H" },
    { key: 1, content: "Prob. of T" },
    { key: 2, content: "Prob. of HT" },
    { key: 3, content: "Prob. of TH" },
  ];

  const rows = [
    {
      key: 0,
      cells: [
        { key: 0, content: format(headsProb) },
        { key: 1, content: format(tailsProb) },
        {
          key: 2,
          content: (
            <>
              {format(headsProb)} &times; {format(tailsProb)} ={" "}
              <ColoredSpan color={COLORS.GREEN} bold>
                {format(pairProb, 2)}
              </ColoredSpan>
            </>
          ),
        },
        {
          key: 3,
          content: (
            <>
              {format(tailsProb)} &times; {format(headsProb)} ={" "}
              <ColoredSpan color={COLORS.GREEN} bold>
                {format(pairProb, 2)}
              </ColoredSpan>
            </>
          ),
        },
      ],
    },
  ];

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
      <StyledTable headers={headers} rows={rows} />
    </Caption>
  );
};

export default CoinFlipTable;
