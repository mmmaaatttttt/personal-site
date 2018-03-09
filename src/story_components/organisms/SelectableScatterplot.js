import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import Scatterplot from "./Scatterplot";
import "react-select/dist/react-select.css";

class SelectableScatterplot extends Component {
  state = {
    selectedOptionX: this.props.selectOptions[0],
    selectedOptionY: this.props.selectOptions[1],
    selectedOptionR: this.props.selectOptions[2]
  };

  handleChange = (key, selectedOption) =>
    this.setState({ [key]: selectedOption });

  render() {
    const { selectedOptionX, selectedOptionY, selectedOptionR } = this.state;
    const { accessor: accessorX } = selectedOptionX;
    const { accessor: accessorY } = selectedOptionY;
    const { accessor: accessorR } = selectedOptionR;
    const { selectOptions, data } = this.props;
    const scatterData = data
      .filter(
        d =>
          accessorX(d) !== null &&
          accessorY(d) !== null &&
          accessorR(d) !== null
      )
      .map(d => ({
        cx: accessorX(d),
        cy: accessorY(d),
        area: accessorR(d),
        fill: "dodgerblue",
        key: `${d.season}:${d.episode} - ${d.description}`
      }));
    return (
      <StyledNarrowContainer width="50%">
        <Select
          name="scatter-data-x"
          value={selectedOptionX.value}
          onChange={option => this.handleChange("selectedOptionX", option)}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <Select
          name="scatter-data-y"
          value={selectedOptionY.value}
          onChange={option => this.handleChange("selectedOptionY", option)}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <Select
          name="scatter-data-r"
          value={selectedOptionR.value}
          onChange={option => this.handleChange("selectedOptionR", option)}
          options={selectOptions.filter(option => option.radiusOption)}
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
