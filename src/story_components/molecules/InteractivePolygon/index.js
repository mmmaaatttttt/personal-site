import React, { Component } from "react";
import PropTypes from "prop-types";

class InteractivePolygon extends Component {
  state = {
    points: Array.from({ length: this.props.initialSides }, (_, i) => {
      const { cx, cy, initialSides } = this.props;
      const angle = (2 * Math.PI * i) / initialSides - Math.PI / 2;
      const distance = 100;
      return {
        id: i,
        x: cx + distance * Math.cos(angle),
        y: cy + distance * Math.sin(angle)
      };
    }),
    nextId: this.props.initialSides + 1
  };

  getPointsString = () => {
    return this.state.points
      .reduce((str, obj) => `${str} ${obj.x},${obj.y}`, "")
      .trim();
  };

  getLength = () => {
    return this.polygon.getTotalLength();
  }

  getCenter = () => {
    let box = this.polygon.getBBox();
    return {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    }
  }

  render() {
    const { points } = this.state;
    const radius = 8;
    let circles = points.map(point => (
      <circle cx={point.x} cy={point.y} r={radius} key={point.id} />
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
    let polygon = <polygon points={this.getPointsString()} fill="red" ref={polygon => this.polygon = polygon}/>
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
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired
};

InteractivePolygon.defaultProps = {
  cx: 0,
  cy: 0,
  initialSides: 3
};

export default InteractivePolygon;
