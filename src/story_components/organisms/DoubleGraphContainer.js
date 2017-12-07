import React, { Component } from "react";
import Graph from "./Graph";
import SliderContainer from "../molecules/SliderContainer";
import PropTypes from "prop-types";
import styled from "styled-components";
import withCaption from "../../hocs/withCaption";

const StyledDoubleGraphContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class DoubleGraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.data.initialData.map(d => d.initialValue)
    };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(idx, newVal) {
    const newValues = [...this.state.values];
    newValues[idx] = newVal;
    this.setState({ values: newValues });
  }

  render() {
    const {
      initialData,
      width,
      height,
      smallestY,
      largestY,
      diffEqs,
      min,
      max,
      step,
      padding,
      svgIds,
      xLabel,
      yLabel
    } = this.props.data;
    const { values } = this.state;
    const data = initialData.map((d, i) => {
      const newObj = { ...d, value: values[i] };
      delete newObj.initialValue;
      return newObj;
    });
    const graphs = [0, 1].map(idx => (
      <Graph
        key={idx}
        data={data}
        width={width}
        height={height}
        smallestY={smallestY}
        largestY={largestY}
        diffEq={diffEqs[idx]}
        min={min}
        max={max}
        step={step}
        padding={padding}
        svgId={svgIds[idx]}
        xLabel={xLabel}
        yLabel={yLabel}
        double
      />
    ))
    return (
      <StyledDoubleGraphContainer>
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
          double
        />
        {graphs}
      </StyledDoubleGraphContainer>
    );
  }
}

DoubleGraphContainer.propTypes = {
  data: PropTypes.shape({
    initialData: PropTypes.arrayOf(
      PropTypes.shape({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        initialValue: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        equationParameter: PropTypes.bool.isRequired
      })
    ).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    smallestY: PropTypes.number.isRequired,
    largestY: PropTypes.number.isRequired,
    diffEqs: PropTypes.arrayOf(PropTypes.func).isRequired,
    padding: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    svgIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    xLabel: PropTypes.string.isRequired,
    yLabel: PropTypes.string.isRequired
  }).isRequired
};

export default withCaption(DoubleGraphContainer);
