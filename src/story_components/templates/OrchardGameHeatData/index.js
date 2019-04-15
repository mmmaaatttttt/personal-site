import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeatChart, StyledSelect } from "story_components";
import strategies, { data } from "data/orchard-game";
import { withCaption, SliderProvider } from "containers";
import { sliderDataType } from "utils/types";
import { camelCaseToTitle } from "utils/stringHelpers";
import COLORS from "utils/styles";

class OrchardGameHeatData extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleSelectChange = selectedOption => this.setState({ selectedOption });

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
    const { selectOptions, sliderMax, sliderData } = this.props;
    const { value, label, accessor } = this.state.selectedOption;
    const colorDomain = [0, 0.2, 0.4, 0.6, 0.8, 1];
    const colorRange = [
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
      <SliderProvider
        initialData={sliderData}
        width="50%"
        render={sliderVals => {
          const [colorCount, wildCardCount] = sliderVals;
          const heatData = data
            .filter(
              d => d.colors === colorCount && d.wildCardCount === wildCardCount
            )
            .reduce((matrix, obj) => {
              let x = obj.ravenCount - 1;
              let y = obj.fruits - 1;
              if (!matrix[x]) matrix[x] = [];
              matrix[x][y] = obj;
              return matrix;
            }, []);
          return (
            <React.Fragment>
              <StyledSelect
                name="orchard-heat-options"
                value={value}
                onChange={this.handleSelectChange}
                options={selectOptions}
                isSearchable={false}
                placeholder={label}
                margin="0.25rem 0 -1rem 0;"
              />
              <HeatChart
                data={heatData}
                accessor={accessor}
                getTooltipBody={this.getTooltipBody}
                colorDomain={colorDomain}
                colorRange={colorRange}
              />
            </React.Fragment>
          );
        }}
      />
    );
  }
}

OrchardGameHeatData.propTypes = {
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.func.isRequired
    })
  ).isRequired,
  sliderData: sliderDataType,
  sliderMax: PropTypes.number.isRequired
};

const SLIDER_MAX = new Set(data.map(d => d.colors)).size;

OrchardGameHeatData.defaultProps = {
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
  sliderMax: SLIDER_MAX,
  sliderData: [
    {
      min: 1,
      max: SLIDER_MAX,
      step: 1,
      initialValue: 4,
      title: val => `Number of Fruit Colors: ${val}`,
      color: COLORS.DARK_GRAY,
      tickCount: SLIDER_MAX
    },
    {
      min: 1,
      max: SLIDER_MAX,
      step: 1,
      initialValue: 1,
      title: val => `Number of Fruits You Can Remove on the Wild Card: ${val}`,
      color: COLORS.DARK_GRAY,
      tickCount: SLIDER_MAX
    }
  ]
};

export default withCaption(OrchardGameHeatData);

export { OrchardGameHeatData };
