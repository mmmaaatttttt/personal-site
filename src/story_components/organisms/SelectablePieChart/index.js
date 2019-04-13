import React, { Component } from "react";
import PropTypes from "prop-types";
import { NarrowContainer, PieChart, StyledSelect } from "story_components";

class SelectablePieChart extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, label, chartValues } = this.state.selectedOption;
    const { selectOptions, data, graphOptions } = this.props;
    return (
      <NarrowContainer width="50%">
        <StyledSelect
          name="pie-data"
          value={value}
          placeholder={label}
          onChange={this.handleChange}
          options={selectOptions}
          isSearchable={false}
        />
        <PieChart values={chartValues(data)} padding={20} {...graphOptions} />
      </NarrowContainer>
    );
  }
}

SelectablePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.isRequired,
    label: PropTypes.string.isRequired,
    chartValues: PropTypes.func.isRequired
  })).isRequired,
  graphOptions: PropTypes.object.isRequired
};

export default SelectablePieChart;
