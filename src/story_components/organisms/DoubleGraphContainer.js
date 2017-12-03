import React, { Component } from "react";
import Graph from "./Graph";
import SliderContainer from "../molecules/SliderContainer";
import StyledCaptionContainer from "../atoms/StyledCaptionContainer";
import PropTypes from "prop-types";
import styled from "styled-components";
import media from "../../utils/media";

const StyledDoubleGraphContainer = styled.div`
  width: 150%;
  margin-left: -25%;
  display: flex;
  flex-wrap: wrap;

  ${media.medium`
    width: 100%;
    margin-left: 0;
  `};
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
        <StyledCaptionContainer>
          {this.props.caption}
        </StyledCaptionContainer>
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

export default DoubleGraphContainer;
