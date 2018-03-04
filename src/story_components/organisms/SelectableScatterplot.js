import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import Scatterplot from "./Scatterplot";
import "react-select/dist/react-select.css";

class SelectableScatterplot extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, chartValues } = this.state.selectedOption;
    const { selectOptions, data } = this.props;
    const scatterData = data
      .filter(d => d.budget && d.guests && d.age)
      .map(d => ({
        cx: d.budget,
        cy: d.guests,
        area: d.age,
        fill: "#ccc",
        key: `${d.season}:${d.episode} - ${d.description}`
      }));
    return (
      <StyledNarrowContainer width="50%">
        <Select
          name="scatter-data"
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <Scatterplot data={scatterData} />
      </StyledNarrowContainer>
    );
  }
}

SelectableScatterplot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withCaption(SelectableScatterplot);
