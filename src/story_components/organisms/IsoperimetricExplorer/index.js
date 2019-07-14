import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ClippedSVG,
  InteractivePolygon,
  LabeledSlider,
  StyledTable,
  SVGBorder
} from "story_components";
import { average, mod } from "utils/mathHelpers";
import { crossingExists } from "./helpers";
import COLORS from "utils/styles";

class IsoperimetricExplorer extends Component {
  state = {
    points: [],
    baseArea: 1
  }

  componentDidMount() {
    this.generatePointsFromCount(this.props.initialSides);
  }

  generatePointsFromCount = newCount => {
    let points = Array.from({ length: newCount }, (_, i) => {
      const { width, height, initialSides } = this.props;
      const angle = (2 * Math.PI * i) / newCount - Math.PI / 2;

      // normalize the distance so that it's 100 when newCount is 3,
      // and otherwise is such that the area of the corresponding circle
      // is constant
      const distance = initialSides * 100 * Math.sin(Math.PI / initialSides) / 
        (newCount * Math.sin(Math.PI / newCount));
     
      return {
        x: width / 2 + distance * Math.cos(angle),
        y: height / 2 + distance * Math.sin(angle)
      };
    });
    
    this.setState({ points }, () => {
      // initialize base circle area
      // so numbers are easier to digest
      if (this.state.baseArea === 1) this.setBaseArea();
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
      let nextPoint = points[mod(i + 1, points.length)];
      let xSquare = (point.x - nextPoint.x) ** 2;
      let ySquare = (point.y - nextPoint.y) ** 2;
      let newDistance = (xSquare + ySquare) ** (1 / 2);
      return length + newDistance;
    }, 0);
  };

  handleDrag = (idx, coords) => {
    let points = [...this.state.points];
    let newPoint = { ...coords };
    points[idx] = newPoint;

    // cancel drag if intersection exists
    if (crossingExists(points, idx)) return false;
  
    this.setState({ points });
  };

  handleValueChange = newVal => {
    this.generatePointsFromCount(newVal);
  };

  getCircleParams = () => {
    let center = this.getCenter();
    let r = this.getLength() / (2 * Math.PI);
    return { ...center, r };
  };

  getAreaInfo = radius => {
    let { points, baseArea } = this.state;
    let circleArea = Math.PI * radius ** 2;
    let normalizedCircleArea = 100 * circleArea / baseArea;

    // area calculation for arbitrary polygon, see:
    // https://www.mathopenref.com/coordpolygonarea2.html
    let polygonArea =
      Math.abs(points.reduce((area, point, i) => {
        let nextPoint = points[mod(i + 1, points.length)];
        return area + (point.x + nextPoint.x) * (-point.y + nextPoint.y);
      }, 0) / 2);
    let normalizedPolygonArea = 100 * polygonArea / baseArea;
    return {
      circleArea: normalizedCircleArea.toFixed(2),
      polygonArea: normalizedPolygonArea.toFixed(2),
      ratio: (polygonArea / circleArea).toFixed(2)
    };
  };

  setBaseArea = () => {
    let { r } = this.getCircleParams();
    this.setState({ baseArea: Math.PI * r ** 2});
  }

  render() {
    const { width, height, initialSides, strokeWidth, circleRadius } = this.props;
    const { points } = this.state;
    let circleParams = this.getCircleParams();
    let { circleArea, polygonArea, ratio } = this.getAreaInfo(circleParams.r);
    let maxSides = 20;
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
        <ClippedSVG width={width} height={height} marginTop={"0.5rem"} id="isoperimetric-svg">
          <SVGBorder width={width} height={height} />
          <circle
            cx={circleParams.x}
            cy={circleParams.y}
            r={circleParams.r}
            fill={COLORS.GRAY}
            stroke={COLORS.DARK_GRAY}
            strokeWidth={strokeWidth}
          />
          <InteractivePolygon
            circleRadius={circleRadius}
            fill={COLORS.GREEN}
            handleDrag={this.handleDrag}
            points={points}
            stroke={COLORS.DARK_GREEN}
            strokeWidth={strokeWidth}
          />
        </ClippedSVG>
        <StyledTable>
          <tbody>
            <tr>
              <td>Circle Area: {circleArea}</td>
              <td>Polygon Area: {polygonArea}</td>
              <td>Ratio: {ratio}</td>
            </tr>
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

IsoperimetricExplorer.propTypes = {
  circleRadius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

IsoperimetricExplorer.defaultProps = {
  circleRadius: 8,
  height: 400,
  initialSides: 3,
  strokeWidth: 3,
  width: 600
};

export default IsoperimetricExplorer;
