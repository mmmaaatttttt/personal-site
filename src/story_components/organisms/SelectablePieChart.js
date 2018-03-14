import React, { Component } from "react";
import PropTypes from "prop-types";
import StyledSelect from "../atoms/StyledSelect";
import withCaption from "../../hocs/withCaption";
import NarrowContainer from "../atoms/NarrowContainer";
import PieChart from "../molecules/PieChart";

class SelectablePieChart extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, chartValues } = this.state.selectedOption;
    const { selectOptions, data, graphOptions } = this.props;
    return (
      <NarrowContainer width="50%">
        <StyledSelect
          name="pie-data"
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <PieChart values={chartValues(data)} padding={20} {...graphOptions} />
      </NarrowContainer>
    );
  }
}

SelectablePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  graphOptions: PropTypes.object.isRequired
};

export default withCaption(SelectablePieChart);
