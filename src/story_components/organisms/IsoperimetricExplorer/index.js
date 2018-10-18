import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ClippedSVG,
  InteractivePolygon,
  LabeledSlider,
  StyledTable
} from "story_components";
import { average, mod, euclideanDistance } from "utils/mathHelpers";
import COLORS from "utils/styles";

class IsoperimetricExplorer extends Component {
  state = {
    points: [],
    baseArea: 1
  }

  componentDidMount() {
    this.generatePointsFromCount(this.props.initialSides);
  }

  crossingExists = (newPoint, idx) => {
    let { strokeWidth } = this.props;
    let { points } = this.state;
    let seg1 = {
      start: points[mod(idx - 1, points.length)],
      end: newPoint
    };
    let seg2 = {
      start: newPoint,
      end: points[mod(idx + 1, points.length)]
    };

    for (let i = 0; i < points.length; i++) {
      // two ways for there to be a problem:
      // 1. the newPoint intersects a non-adjacent line segment on the polygon
      // 2. an adjacent segment to newPoint intersects a point on the polygon

      if (i === idx) continue;
      let curPt = points[i];
      let nextIdx = mod(i + 1, points.length);
      let prevIdx = mod(i - 1, points.length);
      let nextPt = points[nextIdx];

      if (nextIdx !== idx) {
        let distanceFromNewPointToCurSeg = this.distanceBetween(curPt, nextPt, newPoint);
        if (distanceFromNewPointToCurSeg < strokeWidth) return true;

        let distanceFromSeg1ToCurPt = this.distanceBetween(seg1.start, seg1.end, curPt);
        if (distanceFromSeg1ToCurPt < strokeWidth) return true;
      }

      if (idx !== prevIdx) {
        let distanceFromSeg2ToCurPt = this.distanceBetween(seg2.start, seg2.end, curPt);
        if (distanceFromSeg2ToCurPt < strokeWidth) return true;
      }
    }

    return false;
  };

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
    if (!this.crossingExists(newPoint, idx)) {
      points[idx] = newPoint;
      this.setState({ points });
    }
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

  distanceBetween = (lineStart, lineEnd, point) => {
    // a fun calculus problem
    // to calculate the distance between a segment
    // and a point not on that segment
    let x0 = lineStart.x;
    let x1 = lineEnd.x;
    let y0 = lineStart.y;
    let y1 = lineEnd.y;
    let p = point.x;
    let q = point.y;

    // the segment is parametrized by
    // (x0 + t(x0 - x1), y0 + t(y0 - y1)), 0 <= t <=1
    // using calculus, here's the value of t which minimizes distance to (p, q)
    let numerator = (x1 - x0) * (p - x0) + (y1 - y0) * (q - y0);
    let denominator = (x1 - x0) ** 2 + (y1 - y0) ** 2;
    let t0 = numerator / denominator;

    // distance from the point to the line at t0 is minimal,
    // unless t0 is outside of [0, 1].
    if (t0 < 0 || t0 > 1) {
      let d0 = euclideanDistance(x0 - p, y0 - q);
      let d1 = euclideanDistance(x1 - p, y1 - q);
      return Math.min(d0, d1);
    }

    let minD =
      Math.abs((x0 - p) * (y1 - y0) - (y0 - q) * (x1 - x0)) /
      denominator ** (1 / 2);
    return minD;
  };

  setBaseArea = () => {
    let { r } = this.getCircleParams();
    this.setState({ baseArea: Math.PI * r ** 2});
  }

  render() {
    const { width, height, initialSides, strokeWidth } = this.props;
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
        <StyledTable>
          <tbody>
            <td>Circle Area: {circleArea}</td>
            <td>Polygon Area: {polygonArea}</td>
            <td>Ratio: {ratio}</td>
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

IsoperimetricExplorer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initialSides: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
};

IsoperimetricExplorer.defaultProps = {
  width: 600,
  height: 400,
  initialSides: 3,
  strokeWidth: 3
};

export default IsoperimetricExplorer;
