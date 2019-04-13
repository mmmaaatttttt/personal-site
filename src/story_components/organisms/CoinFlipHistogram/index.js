import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { withCaption } from "containers";
import { BarGraph, NarrowContainer, SliderGroup } from "story_components";
import COLORS from "utils/styles";

class CoinFlipHistogram extends PureComponent {
  state = {
    headsProb: 0.5,
    numTrials: 20
  };

  handleSliderChange = (stateKey, val) => {
    this.setState({ [stateKey]: val });
  };

  binomialDensityValues(n, p) {
    if (p === 0 || p === 1) return Array.from({ length: n + 1 }).fill(p);
    let masses = [(1 - p) ** n];
    for (var k = 0; k < n; k++) {
      let lastValue = masses[masses.length - 1];

      // recurrence relation for the kth value in the probability mass function
      // for the binomial distribution, based on the (k-1)st value
      let nextValue = ((n - k) * p * lastValue) / ((k + 1) * (1 - p));
      masses.push(nextValue);
    }
    return masses;
  }

  render() {
    const { headsProb, numTrials } = this.state;
    const { height, width, padding } = this.props;
    
    let sliderData = [
      {
        min: 1,
        max: 100,
        step: 1,
        value: numTrials,
        title: `Number of coin flips: ${numTrials}`,
        handleValueChange: val => this.handleSliderChange("numTrials", val),
        color: COLORS.GREEN,
        minIcon: "circle",
        maxIcon: "coins"
      },
      {
        min: 0,
        max: 1,
        step: 0.01,
        value: headsProb,
        title: `Probability of flipping heads: ${(headsProb * 100).toFixed(0)}%`,
        handleValueChange: val => this.handleSliderChange("headsProb", val),
        color: COLORS.GREEN,
        minIcon: "times-circle",
        maxIcon: "check-circle"
      }
    ];
    let barData = this.binomialDensityValues(numTrials, headsProb).map(
      (height, key) => ({ key, height, x0: key, x1: key + 1 })
    );
    let maxBarHeight = max(barData, d => d.height);
    let yScale = scaleLinear()
                   .domain([0, max([maxBarHeight, 0.1])])
                   .range([height - padding.bottom, padding.top]);
    return (
      <NarrowContainer width="60%" fullWidthAt="small">
        <SliderGroup data={sliderData} />
        <BarGraph
          barData={barData}
          color={COLORS.GREEN}
          height={height}
          histogram
          padding={padding}
          svgId="coinflips"
          thresholds={barData.map(d => d.key).concat(numTrials+1)}
          yTickFormat={".0%"}
          tickStep={0.02}
          width={width}
          yScale={yScale}
        />
      </NarrowContainer>
    );
  }
}

CoinFlipHistogram.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  padding: PropTypes.object.isRequired,
};

CoinFlipHistogram.defaultProps = {
  height: 400,
  width: 600,
  padding: {
    top: 10,
    left: 10,
    bottom: 20,
    right: 10
  }
};

export default withCaption(CoinFlipHistogram);

export { CoinFlipHistogram };
