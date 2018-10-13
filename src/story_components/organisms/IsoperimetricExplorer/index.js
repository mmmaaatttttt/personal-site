import React, { Component } from "react";
import PropTypes from "prop-types";
import { ClippedSVG, InteractivePolygon } from "story_components";
import { average, euclideanDistance } from "utils/mathHelpers";

class IsoperimetricExplorer extends Component {
  state = {
    points: Array.from({ length: this.props.initialSides }, (_, i) => {
      const { width, height, initialSides } = this.props;
      const angle = (2 * Math.PI * i) / initialSides - Math.PI / 2;
      const distance = 100;
      return {
        id: i,
        x: width / 2 + distance * Math.cos(angle),
        y: height / 2 + distance * Math.sin(angle)
      };
    }),
    nextId: this.props.initialSides + 1,
    bigCircleX: 0,
    bigCircleY: 0,
    bigCircleR: 0
  };

  componentDidMount() {
    this.updateBigCircle();
  }

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
      return length + newDistance
    }, 0);
  };

  handleDrag = (idx, coords) => {
    let points = [...this.state.points];
    points[idx] = { ...points[idx], ...coords };
    this.setState({ points }, this.updateBigCircle);
  };

  updateBigCircle = () => {
    let center = this.getCenter();
    let radius = this.getLength() / (2 * Math.PI);
    this.setState({
      bigCircleX: center.x,
      bigCircleY: center.y,
      bigCircleR: radius
    });
  };

  render() {
    const { width, height } = this.props;
    const { points, bigCircleX, bigCircleY, bigCircleR } = this.state;
    return (
      <div>
        <ClippedSVG width={width} height={height} id="isoperimetric-svg">
          <circle cx={bigCircleX} cy={bigCircleY} r={bigCircleR} fill="blue" />
          <InteractivePolygon points={points} handleDrag={this.handleDrag} />
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
  height: 600,
  initialSides: 3
};

export default IsoperimetricExplorer;
