import React, { Component } from "react";
import Graph from "./Graph";
import SliderContainer from "./SliderContainer";
import PropTypes from "prop-types";

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
    const newValues = this.state.values.map(v => {
      if (v.id === id) return { id, value: newVal };
      return v;
    });
    this.setState({ values: newValues, transitioning: true });
  }

  render() {
    const { initialData, width, height, smallestY, largestY } = this.props.data;
    const { values } = this.state;
    const data = initialData.map(d => {
      const value = values.find(v => v.id === d.id).value;
      const newObj = { ...d, value };
      delete newObj.initialValue;
      return newObj;
    });
    return (
      <div className="GraphContainer">
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
        />
      </div>
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
    largestY: PropTypes.number.isRequired
  }).isRequired
};

export default GraphContainer;
