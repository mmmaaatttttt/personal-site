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
      values: props.data.initialData.map(d => ({
        id: d.id,
        value: d.initialValue
      }))
    };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(id, newVal) {
    console.log(newVal);
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
      diffEqs,
      min,
      max,
      step,
      padding,
      ids
    } = this.props.data;
    const { values } = this.state;
    const data = initialData.map(d => {
      const value = values.find(v => v.id === d.id).value;
      const newObj = { ...d, value };
      delete newObj.initialValue;
      return newObj;
    });
    return (
      <StyledDoubleGraphContainer>
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
          double
        />
        <Graph
          data={data}
          width={width}
          height={height}
          smallestY={smallestY}
          largestY={largestY}
          diffEq={diffEqs[0]}
          min={min}
          max={max}
          step={step}
          padding={padding}
          id={ids[0]}
          index={0}
          double
        />
        <Graph
          data={data}
          width={width}
          height={height}
          smallestY={smallestY}
          largestY={largestY}
          diffEq={diffEqs[1]}
          min={min}
          max={max}
          step={step}
          padding={padding}
          id={ids[1]}
          index={1}
          double
        />
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
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
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
    ids: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
};

export default withCaption(DoubleGraphContainer);
