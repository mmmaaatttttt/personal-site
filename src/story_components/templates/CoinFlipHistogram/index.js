import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import {  max } from "d3-array";
import { BarGraph, SliderGroup } from "story_components";
import COLORS from "utils/styles";

class CoinFlipHistogram extends PureComponent {
  state = {
    headsProb: 0.5,
    numTrials: 10
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
        min: 0,
        max: 1,
        step: 0.01,
        value: headsProb,
        title: `Probability of flipping heads: ${(headsProb * 100).toFixed(0)}%`,
        handleValueChange: val => this.handleSliderChange("headsProb", val),
        color: COLORS.GREEN,
        minIcon: "times-circle",
        maxIcon: "check-circle"
      },
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
      }
    ];
    let barData = this.binomialDensityValues(numTrials, headsProb).map(
      (height, key) => ({ key, height })
    );
    let maxBarHeight = max(barData, d => d.height);
    let yScale = scaleLinear()
                   .domain([0, maxBarHeight])
                   .range([height, padding]);
    return (
      <div>
        <SliderGroup data={sliderData} />
        <BarGraph
          barData={barData}
          // barLabel={bar => bar.key}
          height={height}
          width={width}
          padding={padding}
          svgId="coinflips"
          yScale={yScale}
          color={COLORS.GREEN}
          tickFormat={".2%"}
          tickStep={0.02}
        />
      </div>
    );
  }
}

CoinFlipHistogram.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
};

CoinFlipHistogram.defaultProps = {
  height: 400,
  width: 600,
  padding: 20
};

export default CoinFlipHistogram;
