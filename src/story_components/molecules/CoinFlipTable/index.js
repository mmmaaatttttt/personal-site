import React, { useState } from "react";
import { ColoredSpan, LabeledSlider, StyledTable } from "story_components";
import { withCaption } from "providers";
import COLORS from "utils/styles";

const format = (prob, dec = 0) => `${(prob * 100).toFixed(dec)}%`;

function CoinFlipTable() {
  const [headsProb, setHeadsProb] = useState(0.5);
  const tailsProb = 1 - headsProb;
  const pairProb = headsProb * tailsProb;
  const headsFormat = format(headsProb);
  const tailsFormat = format(tailsProb);
  const pairFormat = format(pairProb, 2);

  return (
    <div>
      <LabeledSlider
        min={0.01}
        max={0.99}
        step={0.01}
        value={headsProb}
        handleValueChange={setHeadsProb}
        title={`Probability of flipping heads: ${headsFormat}`}
        color={COLORS.GREEN}
        minIcon="times-circle"
        maxIcon="check-circle"
      />
      <StyledTable margin="0.72rem 0 0 0">
        <thead>
          <tr>
            <th>Prob. of H</th>
            <th>Prob. of T</th>
            <th>Prob. of HT</th>
            <th>Prob. of TH</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{headsFormat}</td>
            <td>{tailsFormat}</td>
            <td>
              {headsFormat} &times; {tailsFormat} ={" "}
              <ColoredSpan color={COLORS.GREEN} bold>
                {pairFormat}
              </ColoredSpan>
            </td>
            <td>
              {tailsFormat} &times; {headsFormat} ={" "}
              <ColoredSpan color={COLORS.GREEN} bold>
                {pairFormat}
              </ColoredSpan>
            </td>
          </tr>
        </tbody>
      </StyledTable>
    </div>
  );
}

export default React.memo(withCaption(CoinFlipTable));

export { CoinFlipTable };
