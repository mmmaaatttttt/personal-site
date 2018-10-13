import React, { Component } from "react";
import PropTypes from "prop-types";
import { DraggableCircle } from "story_components";

class InteractivePolygon extends Component {
  getPointsString = () => {
    return this.props.points
      .reduce((str, obj) => `${str} ${obj.x},${obj.y}`, "")
      .trim();
  };

  render() {
    const { points } = this.props;
    let circles = points.map((point, i) => (
      <DraggableCircle
        cx={point.x}
        cy={point.y}
        key={point.id}
        onDrag={coords => this.props.handleDrag(i, coords)}
      />
    ));
    let lines = points.map((point, i) => {
      let nextPoint = points[(i + 1) % points.length];
      return (
        <line
          x1={point.x}
          x2={nextPoint.x}
          y1={point.y}
          y2={nextPoint.y}
          stroke="black"
          strokeWidth="3"
          key={`${point.id}-${nextPoint.id}`}
        />
      );
    });
    let polygon = (
      <polygon
        points={this.getPointsString()}
        fill="red"
      />
    );
    return (
      <g>
        {polygon}
        {lines}
        {circles}
      </g>
    );
  }
}

InteractivePolygon.propTypes = {
  handleDrag: PropTypes.func.isRequired,
  points: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired
};

InteractivePolygon.defaultProps = {
  handleDrag: coords => console.log(coords)
};

export default InteractivePolygon;
