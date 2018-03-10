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
    selectedOptionY: this.props.selectOptions[1]
  };

  handleChange = (key, selectedOption) =>
    this.setState({ [key]: selectedOption });

  render() {
    const { selectedOptionX, selectedOptionY, selectedOptionR } = this.state;
    const {
      accessor: accessorX,
      value: valueX,
      format: formatX
    } = selectedOptionX;
    const {
      accessor: accessorY,
      value: valueY,
      format: formatY
    } = selectedOptionY;
    const accessorR = selectedOptionR ? selectedOptionR.accessor : d => 100;
    const { selectOptions, data, graphOptions } = this.props;
    const { colorScale } = graphOptions;
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
        fill: colorScale(d.ranking),
        key: `${d.season}:${d.episode} - ${d.description}`
      }));
    return (
      <StyledNarrowContainer width="50%">
        <Select
          name="scatter-data-x"
          value={valueX}
          onChange={option => this.handleChange("selectedOptionX", option)}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <Select
          name="scatter-data-y"
          value={valueY}
          onChange={option => this.handleChange("selectedOptionY", option)}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        <Scatterplot
          data={scatterData}
          {...graphOptions}
          graphPadding={55}
          tickFormatX={formatX}
          tickFormatY={formatY}
        />
      </StyledNarrowContainer>
    );
  }
}

SelectableScatterplot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  graphOptions: PropTypes.object.isRequired
};

export default withCaption(SelectableScatterplot);
