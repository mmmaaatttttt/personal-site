import React, { Component } from "react";
import PropTypes from "prop-types";
import { ClippedSVG, LabeledCircle, Polygon, Tooltip } from "story_components";
import { euclideanDistance, total } from "utils/mathHelpers";
import COLORS from "utils/styles";

class RentDivision extends Component {
  constructor(props) {
    super(props);
    const { height, width } = props;
    const r = height / 2 - 20;
    let xBase = width / 2;
    let yBase = height / 2 + 70;
    this.state = {
      activePt: 0,
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipBody: "",
      points: [
        {
          x: xBase + r * Math.cos(Math.PI / 2),
          y: yBase - r * Math.sin(Math.PI / 2),
          color: COLORS.BLACK,
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
          color: COLORS.BLACK,
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
          color: COLORS.BLACK,
        }
      ]
    };
  }

  /** Get coordinates of the three corners of the main triangle. */
  get corners() {
    return this.state.points.slice(0, 3).map(p => ({ x: p.x, y: p.y }));
  }

  /** Determines what data to put in the body of the tooltip.
   * @param {Object} point - Current point that activated the tooltip
   */
  getTooltipBody = point => {
    const { roomColors } = this.props;
    return this.getPrices(point).map(
      (price, idx) => `${roomColors[idx]} room: $${price.toFixed(2)}`
    );
  };

  /** Shows the tooltip in desired current position, with relevant data.
   * @param {Object} point - Current point that activated the tooltip
   * @param {Object} e - event object
   */
  handleTooltipShow = (point, e) => {
    this.setState({
      tooltipVisible: true,
      tooltipX: e.pageX,
      tooltipY: e.pageY,
      tooltipBody: this.getTooltipBody(point)
    });
  };

  /** Hides the tooltip. */
  handleTooltipHide = () => {
    this.setState({ tooltipVisible: false });
  };

  /**
   * Converts a point's x, y coordinates into a triplet
   * corresponding to rend prices at that point
   * @param {Object} point - Coordinates of the point
   * @param {number} point.x - x-coord of the point
   * @param {number} point.y - y-coord of the point
   */
  getPrices = point => {
    const { rent } = this.props;
    let distances = this.corners.map(c =>
      euclideanDistance(point.x - c.x, point.y - c.y)
    );
    let totalDistance = total(distances);
    return distances.map(d => (d * rent) / totalDistance);
  };

  render() {
    const { width, height } = this.props;
    const {
      activePt,
      points,
      tooltipVisible,
      tooltipX,
      tooltipY,
      tooltipBody
    } = this.state;
    const labeledCircles = points.map((p, i) => (
      <LabeledCircle
        {...p}
        handleLeave={this.handleTooltipHide}
        handleUpdate={this.handleTooltipShow.bind(this, p)}
        key={`${p.x}|${p.y}`}
        label={p.label}
        isActive={i === activePt}
      />
    ));
    return (
      <div>
        <ClippedSVG width={width} height={height} id="rent">
          <Polygon points={this.corners} fill="none" />
          {labeledCircles}
        </ClippedSVG>
        <Tooltip
          visible={tooltipVisible}
          x={tooltipX}
          y={tooltipY}
          body={tooltipBody}
          title="Room Prices"
        />
      </div>
    );
  }
}

RentDivision.propTypes = {
  rent: PropTypes.number.isRequired,
  roomColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};

RentDivision.defaultProps = {
  rent: 2400,
  roomColors: ["Orange", "Green", "Purple"],
  names: ["Alex", "Brett", "Cameron"],
  width: 600,
  height: 600
};

export default RentDivision;
