import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { scaleLinear } from "d3-scale";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import "react-select/dist/react-select.css";

class SelectablePieChart extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value } = this.state.selectedOption;
    const { selectOptions } = this.props;
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
        <div>PIE CHART</div>
      </StyledNarrowContainer>
    );
  }
}

SelectablePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withCaption(SelectablePieChart);
