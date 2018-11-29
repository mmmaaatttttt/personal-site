import React, { Component } from "react";
import PropTypes from "prop-types";
import { BarGraph, SliderGroup } from "story_components";

class CoinFlipHistogram extends Component {
  state = {
    headsProb: 0.5,
    numTrials: 10
  }

  handleSliderChange = (stateKey, val) => {
    this.setState({ [stateKey]: val });
  }

  render() {
    const { headsProb, numTrials } = this.state;
    let sliderData = [{
      min: 0,
      max: 1,
      step: 0.01,
      value: headsProb,
      title: `Probability of flipping heads: ${(headsProb * 100).toFixed(0)}%`,
      handleValueChange: val => this.handleSliderChange("headsProb", val),
      minIcon: "times-circle",
      maxIcon: "check-circle"
    }, {
      min: 1,
      max: 100,
      step: 1,
      value: numTrials,
      title: `Number of coin flips: ${numTrials}`,
      handleValueChange: val => this.handleSliderChange("numTrials", val),
      minIcon: "circle",
      maxIcon: "coins"
    }]
    return <div>
      <SliderGroup data={sliderData}/>
    </div>
  }
}

CoinFlipHistogram.propTypes = {};

CoinFlipHistogram.defaultProps = {};

export default CoinFlipHistogram;