import React, { Component } from "react";
import PropTypes from "prop-types";
import { HeatChart } from "story_components";
import strategies, { data } from "data/orchard-game";
import { withCaption, SliderProvider, SelectProvider } from "providers";
import { sliderType, selectType } from "utils/types";
import { camelCaseToTitle } from "utils/stringHelpers";
import COLORS from "utils/styles";

class OrchardGameHeatData extends Component {
  getTooltipBody = option => d => {
    const { label, accessor, value } = option;
    const percentage = (accessor(d.original.data) * 100).toFixed(3);
    const { fruits, ravenCount } = d.original.data;
    return [
      `Fruits per color: ${fruits}`,
      `Raven count: ${ravenCount}`,
      value === "diff"
        ? `${label}: ${percentage} points`
        : `Win probability with ${label.toLowerCase()}: ${percentage}%`
    ];
  };

  render() {
    const { selectOptions, sliderData } = this.props;
    return (
      <SliderProvider
        initialData={sliderData}
        width="50%"
        render={sliderVals => (
          <SelectProvider
            options={selectOptions}
            width="100%"
            margin="0.25rem 0 -1rem"
            render={selectVals => {
              const [colorCount, wildCardCount] = sliderVals;
              const { value, accessor } = selectVals[0];
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
              console.log("DATA", data);
              console.log("OPTIONS", selectOptions);
              const heatData = data
                .filter(
                  d =>
                    d.colors === colorCount && d.wildCardCount === wildCardCount
                )
                .reduce((matrix, obj) => {
                  let x = obj.ravenCount - 1;
                  let y = obj.fruits - 1;
                  if (!matrix[x]) matrix[x] = [];
                  matrix[x][y] = obj;
                  return matrix;
                }, []);
              return (
                <HeatChart
                  data={heatData}
                  accessor={accessor}
                  getTooltipBody={this.getTooltipBody(selectVals[0])}
                  colorDomain={colorDomain}
                  colorRange={colorRange}
                  xAxisLabel="Raven Count"
                  yAxisLabel="Fruits per Color"
                />
              );
            }}
          />
        )}
      />
    );
  }
}

OrchardGameHeatData.propTypes = {
  selectOptions: selectType,
  sliderData: sliderType,
  sliderMax: PropTypes.number.isRequired
};

const SLIDER_MAX = new Set(data.map(d => d.colors)).size;

OrchardGameHeatData.defaultProps = {
  selectOptions: [
    strategies
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
  ],
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
