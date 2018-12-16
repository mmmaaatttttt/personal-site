import React, { Component } from "react";
import PropTypes from "prop-types";
import { ClippedSVG, LabeledCircle, Polygon, Tooltip } from "story_components";
import COLORS from "utils/styles";

class RentDivision extends Component {
  constructor(props) {
    super(props);
    const { height, width } = props;
    const r = height / 2 - 20;
    let xBase = width / 2;
    let yBase = height / 2 + 70;
    this.state = {
      points: [
        {
          x: xBase + r * Math.cos(Math.PI / 2),
          y: yBase - r * Math.sin(Math.PI / 2),
          color: COLORS.ORANGE,
          label: "A"
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
          color: COLORS.ORANGE,
          label: "A"
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
          color: COLORS.ORANGE,
          label: "A"
        }
      ]
    };
  }

  render() {
    const { width, height } = this.props;
    const { points } = this.state
    const labeledCircles = this.state.points.map(p => (
      <LabeledCircle {...p} key={`${p.x}|${p.y}`} />
    ));
    return (
      <ClippedSVG width={width} height={height} id="rent">
        <Polygon points={points.slice(0,3)} fill="none" />
        {labeledCircles}
      </ClippedSVG>
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
  roomColors: [COLORS.ORANGE, COLORS.PURPLE, COLORS.GREEN],
  names: ["Alex", "Brett", "Cameron"],
  width: 600,
  height: 600
};

export default RentDivision;
