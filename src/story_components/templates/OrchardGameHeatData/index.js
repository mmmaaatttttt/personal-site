import React, { Component } from "react";
import PropTypes from "prop-types";
import { json } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import styled from "styled-components";
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

const StyledSelectWrapper = styled.div`
  margin: 0.25rem 0 -1rem 0;
`;

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
    const { selectOptions, sliderMax } = this.props;
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
        max: sliderMax,
        step: 1,
        value: colorCount,
        title: `Number of Fruit Colors: ${colorCount}`,
        handleValueChange: this.handleSliderChange.bind(this, "colorCount"),
        color: COLORS.DARK_GRAY,
        tickCount: sliderMax
      },
      {
        min: 1,
        max: sliderMax,
        step: 1,
        value: wildCardCount,
        title: `Number of Fruits You Can Remove on the Wild Card: ${wildCardCount}`,
        handleValueChange: this.handleSliderChange.bind(this, "wildCardCount"),
        color: COLORS.DARK_GRAY,
        tickCount: sliderMax
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
      <NarrowContainer width="50%" fullWidthAt="small">
        <SliderGroup data={sliderData} />
        <StyledSelectWrapper>
          <StyledSelect
            name="orchard-heat-options"
            value={value}
            onChange={this.handleSelectChange}
            options={selectOptions}
            searchable={false}
            clearable={false}
          />
        </StyledSelectWrapper>
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

OrchardGameHeatData.propTypes = {
  initialWildCardCount: PropTypes.number.isRequired,
  initialColorCount: PropTypes.number.isRequired,
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.func.isRequired
    })
  ).isRequired,
  sliderMax: PropTypes.number.isRequired
};

OrchardGameHeatData.defaultProps = {
  initialWildCardCount: 1,
  initialColorCount: 4,
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
    }),
  sliderMax: new Set(data.map(d => d.colors)).size
};

export default withCaption(OrchardGameHeatData);
