import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import PieChart from "../molecules/PieChart";
import "react-select/dist/react-select.css";

class SelectablePieChart extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, chartValues } = this.state.selectedOption;
    const { selectOptions, data } = this.props;
    return (
      <StyledNarrowContainer width="50%">
        <Select
          name="bar-data"
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <PieChart values={chartValues(data)} padding={20} />
      </StyledNarrowContainer>
    );
  }
}

SelectablePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withCaption(SelectablePieChart);
