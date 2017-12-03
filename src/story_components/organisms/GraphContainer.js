import React, { Component } from "react";
import Graph from "./Graph";
import SliderContainer from "../molecules/SliderContainer";
import PropTypes from "prop-types";
import styled from "styled-components";
import media from "../../utils/media";
import { rhythm } from "../../utils/typography";
import withCaption from "../../hocs/withCaption";

const StyledGraphContainer = styled.div`
  display: flex;

  ${media.small`
    flex-direction: column;
  `};
`;

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.data.initialData.map(d => ({
        id: d.id,
        value: d.initialValue
      }))
    };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(id, newVal) {
    const newValues = this.state.values.map(
      v => (v.id === id ? { id, value: newVal } : v)
    );
    this.setState({ values: newValues });
  }

  render() {
    const {
      initialData,
      width,
      height,
      smallestY,
      largestY,
      diffEq,
      min,
      max,
      step,
      padding,
      id,
      xLabel,
      yLabel
    } = this.props.data;
    const { values } = this.state;
    const data = initialData.map(d => {
      const value = values.find(v => v.id === d.id).value;
      const newObj = { ...d, value };
      delete newObj.initialValue;
      return newObj;
    });
    return (
      <StyledGraphContainer>
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
        />
        <Graph
          data={data}
          width={width}
          height={height}
          smallestY={smallestY}
          largestY={largestY}
          diffEq={diffEq}
          min={min}
          max={max}
          step={step}
          padding={padding}
          id={id}
          xLabel={xLabel}
          yLabel={yLabel}
        />
      </StyledGraphContainer>
    );
  }
}

GraphContainer.propTypes = {
  data: PropTypes.shape({
    initialData: PropTypes.arrayOf(
      PropTypes.shape({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        initialValue: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
      })
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    smallestY: PropTypes.number.isRequired,
    largestY: PropTypes.number.isRequired,
    diffEq: PropTypes.func.isRequired,
    padding: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    id: PropTypes.string.isRequired,
    xLabel: PropTypes.string.isRequired,
    yLabel: PropTypes.string.isRequired,
  }).isRequired
};

export default withCaption(GraphContainer);
