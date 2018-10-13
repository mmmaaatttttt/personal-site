import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ClippedSVG,
  InteractivePolygon,
  LabeledSlider
} from "story_components";
import { average } from "utils/mathHelpers";
import COLORS from "utils/styles";

class IsoperimetricExplorer extends Component {
  // need constructor pattern when using a method to initialize state
  constructor(props) {
    super(props);
    this.state = {
      points: this.generatePointsFromCount(props.initialSides),
    };
  }

  generatePointsFromCount = newCount => {
    return Array.from({ length: newCount }, (_, i) => {
      const { width, height } = this.props;
      const angle = (2 * Math.PI * i) / newCount - Math.PI / 2;
      const distance = 100;
      return {
        x: width / 2 + distance * Math.cos(angle),
        y: height / 2 + distance * Math.sin(angle)
      };
    });
  };

  getCenter = () => {
    let { points } = this.state;
    return {
      x: average(points, p => p.x),
      y: average(points, p => p.y)
    };
  };

  getLength = () => {
    let { points } = this.state;
    return points.reduce((length, point, i) => {
      let nextPoint = points[(i + 1) % points.length];
      let xSquare = (point.x - nextPoint.x) ** 2;
      let ySquare = (point.y - nextPoint.y) ** 2;
      let newDistance = (xSquare + ySquare) ** (1 / 2);
      return length + newDistance;
    }, 0);
  };

  handleDrag = (idx, coords) => {
    let points = [...this.state.points];
    points[idx] = { ...points[idx], ...coords };
    this.setState({ points });
  };

  handleValueChange = newVal => {
    this.setState({ points: this.generatePointsFromCount(newVal) });
  };

  getCircleParams = () => {
    let center = this.getCenter();
    let r = this.getLength() / (2 * Math.PI);
    return {...center, r};
  };

  render() {
    const { width, height, initialSides } = this.props;
    const { points } = this.state;
    let circleParams = this.getCircleParams();
    let maxSides = 20;
    let strokeWidth = 3;
    return (
      <div>
        <LabeledSlider
          min={initialSides}
          max={maxSides}
          step={1}
          value={points.length}
          title={`Number of district sides: ${points.length}`}
          handleValueChange={this.handleValueChange}
          color={COLORS.DARK_GRAY}
        />
        <ClippedSVG width={width} height={height} id="isoperimetric-svg">
          <circle
            cx={circleParams.x}
            cy={circleParams.y}
            r={circleParams.r}
            fill={COLORS.GRAY}
            stroke={COLORS.DARK_GRAY}
            strokeWidth={strokeWidth}
          />
          <InteractivePolygon
            points={points}
            handleDrag={this.handleDrag}
            strokeWidth={strokeWidth}
            fill={COLORS.GREEN}
            stroke={COLORS.DARK_GREEN}
          />
        </ClippedSVG>
        <p>foo</p>
      </div>
    );
  }
}

IsoperimetricExplorer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired
};

IsoperimetricExplorer.defaultProps = {
  width: 600,
  height: 400,
  initialSides: 3
};

export default IsoperimetricExplorer;
