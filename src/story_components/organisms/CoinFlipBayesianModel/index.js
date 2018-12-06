import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import withCaption from "hocs/withCaption";
import { Graph, NarrowContainer, SliderGroup, ToggleSwitch } from "story_components";
import COLORS from "utils/styles";

class CoinFlipBayesianModel extends PureComponent {
  state = {
    numTrials: 100,
    numHeads: 50
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
    const { numTrials, numHeads } = this.state;
    const { height, width, padding } = this.props;
    
    // let sliderData = [
    //   {
    //     min: 1,
    //     max: 1000,
    //     step: 1,
    //     value: numTrials,
    //     title: `Number of coin flips: ${numTrials}`,
    //     handleValueChange: val => this.handleSliderChange("numTrials", val),
    //     color: COLORS.GREEN,
    //     minIcon: "circle",
    //     maxIcon: "coins"
    //   },
    //   {
    //     min: 0,
    //     max: 1000,
    //     step: 1,
    //     value: headsProb,
    //     title: `Number of heads: ${numHeads}`,
    //     handleValueChange: val => this.handleSliderChange("numHeads", val),
    //     color: COLORS.GREEN,
    //     minIcon: "times-circle",
    //     maxIcon: "check-circle"
    //   }
    // ];
    // let barData = this.binomialDensityValues(numTrials, headsProb).map(
    //   (height, key) => ({ key, height, x0: key, x1: key + 1 })
    // );
    // let maxBarHeight = max(barData, d => d.height);
    // let yScale = scaleLinear()
    //                .domain([0, max([maxBarHeight, 0.1])])
    //                .range([height - padding.bottom, padding.top]);
    return (
      <NarrowContainer width="60%" fullWidthAt="small">

        {/* <SliderGroup data={sliderData} /> */}
        {/* <Graph /> */}
        <ToggleSwitch />
      </NarrowContainer>
    );
  }
}

CoinFlipBayesianModel.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  padding: PropTypes.object.isRequired,
};

CoinFlipBayesianModel.defaultProps = {
  height: 400,
  width: 600,
  padding: {
    top: 10,
    left: 10,
    bottom: 20,
    right: 10
  }
};

export default withCaption(CoinFlipBayesianModel);
