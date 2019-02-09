import React, { Component } from "react";
import { ColoredSpan, LabeledSlider, StyledTable } from "story_components";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";

class CoinFlipTable extends Component {
  state = {
    headsProb: 0.5
  };

  handleProbChange = val => {
    this.setState({ headsProb: val });
  };

  format = (probability, dec = 0) => `${(probability * 100).toFixed(dec)}%`;

  render() {
    const { headsProb } = this.state;
    const tailsProb = 1 - headsProb;
    const pairProb = headsProb * tailsProb;
    const formatted = {
      heads: this.format(headsProb),
      tails: this.format(tailsProb),
      pair: this.format(pairProb, 2)
    };
    return (
      <div>
        <LabeledSlider
          min={0.01}
          max={0.99}
          step={0.01}
          value={headsProb}
          handleValueChange={this.handleProbChange}
          title={`Probability of flipping heads: ${formatted.heads}`}
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
              <td>{formatted.heads}</td>
              <td>{formatted.tails}</td>
              <td>
                {formatted.heads} &times; {formatted.tails} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>{formatted.pair}</ColoredSpan>
              </td>
              <td>
                {formatted.tails} &times; {formatted.heads} ={" "}
                <ColoredSpan color={COLORS.GREEN} bold>{formatted.pair}</ColoredSpan>
              </td>
            </tr>
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

CoinFlipTable.propTypes = {};

CoinFlipTable.defaultProps = {};

export default withCaption(CoinFlipTable);

export { CoinFlipTable };
