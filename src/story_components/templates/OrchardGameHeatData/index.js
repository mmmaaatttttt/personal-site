import React, { Component } from "react";
import PropTypes from "prop-types";
import { json } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import {
  HeatChart,
  SliderGroup,
  NarrowContainer,
  StyledSelect
} from "story_components";
import strategies, { data } from "data/orchard-game";
import withCaption from "hocs/withCaption";
import { camelCaseToTitle } from "utils/stringHelpers";
import COLORS from "utils/styles";

class OrchardGameHeatData extends Component {
  state = {
    colorCount: this.props.initialColorCount,
    selectedOption: this.props.selectOptions[0],
    wildCardCount: this.props.initialWildCardCount
  };

  handleSelectChange = selectedOption => this.setState({ selectedOption });

  handleSliderChange = (key, val) => this.setState({ [key]: val });

  getTooltipBody = d => {
    const { label, accessor, value } = this.state.selectedOption;
    const percentage = (accessor(d) * 100).toFixed(3);
    return [
      `Fruits per color: ${d.fruits}`,
      `Raven count: ${d.ravenCount}`,
      value === "diff"
        ? `${label}: ${percentage} points`
        : `Win probability with ${label.toLowerCase()}: ${percentage}%`
    ];
  };

  render() {
    const { colorCount, wildCardCount } = this.state;
    const { selectOptions } = this.props;
    const { value, accessor } = this.state.selectedOption;
    const heatData = data
      .filter(d => d.colors === colorCount && d.wildCardCount === wildCardCount)
      .reduce((matrix, obj) => {
        let x = obj.ravenCount - 1;
        let y = obj.fruits - 1;
        if (!matrix[x]) matrix[x] = [];
        matrix[x][y] = obj;
        return matrix;
      }, []);
    const sliderData = [
      {
        min: 1,
        max: 5,
        step: 1,
        value: colorCount,
        title: "Number of Fruit Colors",
        handleValueChange: this.handleSliderChange.bind(this, "colorCount"),
        color: COLORS.DARK_GRAY
      },
      {
        min: 1,
        max: 5,
        step: 1,
        value: wildCardCount,
        title: "Fruits per Basket Spin",
        handleValueChange: this.handleSliderChange.bind(this, "wildCardCount"),
        color: COLORS.DARK_GRAY
      }
    ];
    let colorDomain = [0, 0.2, 0.4, 0.6, 0.8, 1];
    let colorRange = [
      COLORS.BLACK,
      COLORS.RED,
      COLORS.ORANGE,
      COLORS.YELLOW,
      COLORS.GREEN,
      COLORS.DARK_GREEN
    ];
    if (value === "diff") {
      colorDomain = [0.05, 0.25];
      colorRange = [COLORS.BLUE, COLORS.DARK_BLUE];
    }
    return (
      <NarrowContainer width="80%">
        <SliderGroup column={false} data={sliderData} />
        <StyledSelect
          name="orchard-heat-options"
          value={value}
          onChange={this.handleSelectChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <HeatChart
          data={heatData}
          accessor={accessor}
          getTooltipBody={this.getTooltipBody}
          colorDomain={colorDomain}
          colorRange={colorRange}
        />
      </NarrowContainer>
    );
  }
}

OrchardGameHeatData.propTypes = {};

OrchardGameHeatData.defaultProps = {
  initialWildCardCount: 1,
  initialColorCount: 4,
  initialShading: "mostPlentiful",
  selectOptions: strategies
    .map(strategy => ({
      value: strategy.name,
      label: `${camelCaseToTitle(strategy.name)} Strategy`,
      accessor: d => d.probs[strategy.name]
    }))
    .concat({
      value: "diff",
      label: "Largest difference between strategies",
      accessor: d => {
        const probs = Object.values(d.probs);
        return Math.max(...probs) - Math.min(...probs);
      }
    })
};

export default withCaption(OrchardGameHeatData);
