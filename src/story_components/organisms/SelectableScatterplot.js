import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import withCaption from "hocs/withCaption";
import { NarrowContainer, FlexContainer, StyledSelect } from "story_components";
import Scatterplot from "./Scatterplot";

const StyledParagraph = styled.p`
  margin: 0.5rem;
`;

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
      <NarrowContainer width="50%">
        <FlexContainer cross="center">
          <StyledParagraph>X-Axis:</StyledParagraph>
          <StyledSelect
            name="scatter-data-x"
            value={valueX}
            onChange={option => this.handleChange("selectedOptionX", option)}
            options={selectOptions}
            searchable={false}
            clearable={false}
          />
        </FlexContainer>
        <FlexContainer cross="center">
          <StyledParagraph>Y-Axis:</StyledParagraph>
          <StyledSelect
            name="scatter-data-y"
            value={valueY}
            onChange={option => this.handleChange("selectedOptionY", option)}
            options={selectOptions}
            searchable={false}
            clearable={false}
          />
        </FlexContainer>
        <Scatterplot
          data={scatterData}
          {...graphOptions}
          graphPadding={55}
          tickFormatX={formatX}
          tickFormatY={formatY}
        />
      </NarrowContainer>
    );
  }
}

SelectableScatterplot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  graphOptions: PropTypes.object.isRequired
};

export default withCaption(SelectableScatterplot);
