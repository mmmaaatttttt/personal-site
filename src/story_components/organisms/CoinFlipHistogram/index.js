import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { withCaption, SliderProvider } from "containers";
import { BarGraph } from "story_components";
import COLORS from "utils/styles";
import { sliderDataType } from "utils/types";

class CoinFlipHistogram extends PureComponent {
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
    const { height, width, padding, sliderData } = this.props;
    return (
      <SliderProvider
        initialData={sliderData}
        width="60%"
        render={sliderVals => {
          const [ numTrials, headsProb ] = sliderVals;
          const barData = this.binomialDensityValues(numTrials, headsProb).map(
            (height, key) => ({ key, height, x0: key, x1: key + 1 })
          );
          const maxBarHeight = max(barData, d => d.height);
          const yScale = scaleLinear()
            .domain([0, max([maxBarHeight, 0.1])])
            .range([height - padding.bottom, padding.top]);
          return (
            <BarGraph
              barData={barData}
              color={COLORS.GREEN}
              height={height}
              histogram
              padding={padding}
              svgId="coinflips"
              thresholds={barData.map(d => d.key).concat(numTrials + 1)}
              yTickFormat={".0%"}
              tickStep={0.02}
              width={width}
              yScale={yScale}
            />
          );
        }}
      />
    );
  }
}

CoinFlipHistogram.propTypes = {
  height: PropTypes.number.isRequired,
  padding: PropTypes.object.isRequired,
  sliderData: sliderDataType,
  width: PropTypes.number.isRequired
};

CoinFlipHistogram.defaultProps = {
  height: 400,
  padding: {
    top: 10,
    left: 10,
    bottom: 20,
    right: 10
  },
  sliderData: [
    {
      min: 1,
      max: 100,
      step: 1,
      initialValue: 20,
      title: val => `Number of coin flips: ${val}`,
      color: COLORS.GREEN,
      minIcon: "circle",
      maxIcon: "coins"
    },
    {
      min: 0,
      max: 1,
      step: 0.01,
      initialValue: 0.05,
      title: val => `Probability of flipping heads: ${(val * 100).toFixed(0)}%`,
      color: COLORS.GREEN,
      minIcon: "times-circle",
      maxIcon: "check-circle"
    }
  ],
  width: 600
};

export default withCaption(CoinFlipHistogram);

export { CoinFlipHistogram };
