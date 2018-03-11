import React, { Component } from "react";
import PropTypes from "prop-types";
import { histogram, max, range, extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import withCaption from "../../hocs/withCaption";
import BarGraph from "./BarGraph";
import COLORS from "../../utils/styles";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import StyledSelect from "../atoms/StyledSelect";

class SelectableHistogram extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, accessor, step, format } = this.state.selectedOption;
    const { selectOptions, data } = this.props;
    const validData = data.filter(d => accessor(d) !== null);
    const vals = extent(validData, accessor);
    const thresholds = range(Math.min(vals[0], 0), vals[1] + 2 * step, step);
    const histogramData = histogram()
      .value(accessor)
      .thresholds(thresholds)(validData);
    // fixing bar widths for first and last histogram
    const lastIdx = histogramData.length - 1;
    const barWidth = histogramData[1].x1 - histogramData[1].x0;
    histogramData[0].x0 = histogramData[0].x1 - barWidth;
    histogramData[lastIdx].x1 = histogramData[lastIdx].x0 + barWidth;
    const width = 600;
    const height = 600;
    const padding = 10;
    const tickStep = 10;
    const barData = histogramData.map((d, i) => ({
      key: i,
      height: d.length,
      x0: d.x0,
      x1: d.x1
    }));
    const yScale = scaleLinear()
      .domain([0, max(histogramData, d => d.length) * 1.1])
      .range([height - padding, padding]);
    return (
      <StyledNarrowContainer width="50%">
        <StyledSelect
          name="bar-data"
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <BarGraph
          svgId="histogram"
          width={width}
          height={height}
          padding={padding}
          yScale={yScale}
          barData={barData}
          tickStep={tickStep}
          barLabel={bar => bar.height}
          histogram
          thresholds={thresholds}
          tickFormat={format}
          color={COLORS.BLUE}
          timing={{ duration: 500, delay: 25 }}
        />
      </StyledNarrowContainer>
    );
  }
}

SelectableHistogram.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withCaption(SelectableHistogram);
