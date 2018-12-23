import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ClippedSVG,
  ColumnLayout,
  FlexContainer,
  LabeledCircle,
  Polygon,
  RadioButtonGroup,
  Tooltip
} from "story_components";
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
      activePtIdx: 0,
      currentColorIndex: null,
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipBody: "",
      points: [
        {
          x: xBase + r * Math.cos(Math.PI / 2),
          y: yBase - r * Math.sin(Math.PI / 2),
          color: COLORS.BLACK
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
          color: COLORS.BLACK
        },
        {
          x: xBase + r * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
          y: yBase - r * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
          color: COLORS.BLACK
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

  /** Gets the active roommate, based on the active point in state */
  getActiveRoommate = () => {
    const { activePtIdx } = this.state;
    const { names } = this.props;
    return names[activePtIdx];
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

  /**
   * Callback that runs after a radio button in the
   * RadioButtonGroup is changed. Has access to the index
   * of the radio button.
   * @param {Number} idx - Index of the currently active ratio button
   */
  handleRadioChange = currentColorIndex => {
    this.setState({ currentColorIndex });
  };

  /**
   * Determines whether a room choice should be disabled
   * based on the rules of the game.
   * For example, everyone should prefer a free room to a not free room,
   * so if one of the rooms is free, the non-free rooms should not be selectable.
   * @param {Number} idx - index of the current price in the array of prices
   */
  shouldBeDisabled = (prices, idx) => {
    const anyFreeRooms = prices.some(p => p === 0);
    const currentPrice = prices[idx];
    return anyFreeRooms && currentPrice !== 0;
  }

  render() {
    const { width, height, roomColors } = this.props;
    const {
      activePtIdx,
      currentColorIndex,
      points,
      tooltipVisible,
      tooltipX,
      tooltipY,
      tooltipBody
    } = this.state;
    const currentRoommate = this.getActiveRoommate();
    const activePoint = points[activePtIdx];
    const prices = this.getPrices(activePoint);
    const radioButtonLabels = this.getTooltipBody(activePoint).map(
      (text, idx) => ({
        text,
        color: COLORS[roomColors[idx].toUpperCase()],
        disabled: this.shouldBeDisabled(prices, idx)
      })
    );
    const labeledCircles = points.map((p, i) => (
      <LabeledCircle
        {...p}
        handleLeave={this.handleTooltipHide}
        handleUpdate={this.handleTooltipShow.bind(this, p)}
        key={`${p.x}|${p.y}`}
        label={p.label}
        isActive={i === activePtIdx}
      />
    ));
    let buttonText = "";
    if (currentColorIndex !== null) {
      let currentColor = roomColors[currentColorIndex].toLowerCase();
      buttonText = `Confirm the ${currentColor} room for ${currentRoommate}.`;
    }
    return (
      <ColumnLayout break="extraSmall">
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
        <FlexContainer column main="center">
          <h2>{currentRoommate}'s Turn</h2>
          <RadioButtonGroup
            handleRadioChange={this.handleRadioChange}
            labels={radioButtonLabels}
            buttonText={buttonText}
          />
        </FlexContainer>
      </ColumnLayout>
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
