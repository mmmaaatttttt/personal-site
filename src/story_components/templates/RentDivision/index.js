import React, { Component } from "react";
import PropTypes from "prop-types";
import { mix } from "polished";
import {
  ClippedSVG,
  ColumnLayout,
  FlexContainer,
  LabeledCircle,
  Polygon,
  RadioButtonGroup,
  Tooltip
} from "story_components";
import COLORS from "utils/styles";
import { interpolate } from "utils/mathHelpers";
import { generateFreqMap } from "utils/arrayHelpers";

class RentDivision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePtLoc: [0, 0],
      currentColorIdx: null,
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipBody: "",
      points: this.generateAllPoints()
    };
  }

  /**
   * Generates data on every row of points
   * in the triangulation. For example, given the following diagram:
   *
   *         1
   *       /   \
   *      2 --- 3
   *    /   \ /   \
   *   4 --- 5 --- 6
   *
   * it should generate an array of the form
   * [
   *   [ { 1 data } ],
   *   [ { 2 data }, { 3 data } ],
   *   [ { 4 data }, { 5 data }, { 6 data } ]
   * ]
   *
   * Note that this function doesn't add labels. This is done after the data
   * has been generated.
   */
  generateAllPoints = () => {
    const { corners, initialR, meshLevels } = this.props;
    const rowCount = 2 ** (meshLevels - 1) + 1;
    let pointsWithoutLabels = Array.from({ length: rowCount }, (_, rowIdx) => {
      if (rowIdx === 0) {
        return [{ ...corners[0], color: COLORS.BLACK, r: initialR }];
      }
      let fraction = rowIdx / (rowCount - 1);
      let [top, left, right] = corners;
      let firstPoint = this.generatePoint(left, top, fraction);
      let lastPoint = this.generatePoint(right, top, fraction);
      if (rowIdx === 1) {
        return [firstPoint, lastPoint];
      }
      let points = [firstPoint];
      for (var i = 1; i < rowIdx; i++) {
        let rowFraction = i / rowIdx;
        let newPoint = this.generatePoint(lastPoint, firstPoint, rowFraction);
        points.push(newPoint);
      }
      points.push(lastPoint);
      return points;
    });
    return this.generateLabels(pointsWithoutLabels);
  };

  /**
   * Given an array of arrays of points objects without labels,
   * this adds labels. Labels are specified uniquely subject to the initial condition
   * that the top corner is "A", and the two points in the next row are "B" and "C".
   *
   * @param {Array} points - points object data without labels
   */
  generateLabels = points => {
    const { names } = this.props;
    points[0][0].label = names[0][0];
    points[1][0].label = names[1][0];
    points[1][1].label = names[2][0];
    for (let rowIdx = 2; rowIdx < points.length; rowIdx++) {
      for (let cellIdx = 1; cellIdx < rowIdx; cellIdx++) {
        // generate labels for interior points in the row
        let leftParent = points[rowIdx - 1][cellIdx - 1];
        let rightParent = points[rowIdx - 1][cellIdx];
        points[rowIdx][cellIdx].label = this.deduceLabel(
          leftParent,
          rightParent
        );
      }
      // generate labels for first and last points in the row
      points[rowIdx][0].label = this.deduceLabel(
        points[rowIdx - 1][0],
        points[rowIdx][1]
      );
      points[rowIdx][rowIdx].label = this.deduceLabel(
        points[rowIdx - 1][rowIdx - 1],
        points[rowIdx][rowIdx - 1]
      );
    }
    return points;
  };

  /**
   * Given two point objects pt1 and pt2, and an interpolation value frac1 between
   * 0 and 1, this creates a new initial point.
   *
   * Used in the constructor.
   *
   * @param {Object} pt1 - First point
   * @param {Object} pt2 - Second point
   * @param {Number} frac - Number between 0 and 1
   */
  generatePoint = (pt1, pt2, frac) => {
    const { initialR } = this.props;
    return {
      x: interpolate(pt1.x, pt2.x, frac),
      y: interpolate(pt1.y, pt2.y, frac),
      color: COLORS.BLACK,
      prices: pt1.prices.map((price, i) =>
        interpolate(price, pt2.prices[i], frac)
      ),
      r: initialR
    };
  };

  /**
   * Determines the label of a point given two labeled neighbors
   * In our example, this uniquely determines the label of a point, since every trinagle should
   * have distinct labels.
   * For example, if neighbor1.label is "A" and neighbor2.label is "B",
   * the only label remaining is "C".
   *
   * @param {Object} neighbor1 - the first neighbor object
   * @param {Object} neighbor2 - the second neighbor object
   */
  deduceLabel = (neighbor1, neighbor2) => {
    const label1 = neighbor1.label;
    const label2 = neighbor2.label;
    const { names } = this.props;
    return names
      .map(name => name[0])
      .find(ltr => ltr !== label1 && ltr !== label2);
  };

  /** Get coordinates of the three corners of the main triangle. */
  get corners() {
    return this.state.points.slice(0, 3).map(p => ({ x: p.x, y: p.y }));
  }

  /** Determines what data to put in the body of the tooltip.
   * @param {Object} point - Current point that activated the tooltip
   */
  getTooltipBody = point => {
    const { roomColors } = this.props;
    return point.prices.map(
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
    const { activePtLoc, points } = this.state;
    let [y, x] = activePtLoc;
    const firstLetter = points[y][x].label;
    const { names } = this.props;
    return names.find(name => name[0] === firstLetter);
  };

  /**
   * Callback that runs after a radio button in the
   * RadioButtonGroup is changed. Has access to the index
   * of the radio button.
   * @param {Number} currentColorIdx - Index of the currently active ratio button
   */
  handleRadioChange = currentColorIdx => {
    this.setState({ currentColorIdx });
  };

  /**
   * Callback that runs after confirmation of a room. Should update
   * the active point, and change the current roommate. Also needs to
   * update the mesh if necessary, and determine when this process
   * can terminate.
   */
  handleRoomChoice = () => {
    const { roomColors, initialR } = this.props;
    this.setState(prevState => {
      const { activePtLoc, currentColorIdx, points } = prevState;
      const [y, x] = activePtLoc;
      const colorStr = roomColors[currentColorIdx].toUpperCase();
      const color = COLORS[colorStr];
      const newPtData = { ...points[y][x], color, r: 2 * initialR };
      const pointsCopy = [...points];
      const pointsRowCopy = [...pointsCopy[y]];
      pointsCopy[y] = pointsRowCopy;
      pointsCopy[y][x] = newPtData;
      return {
        currentColorIdx: null,
        points: pointsCopy
      };
    }, this.advanceToNext);
  };

  /**
   * Move on to the next point in the mesh.
   * Called after updating the mesh, if necessary.
   * @param {Array} points - Array of updated point objects
   */
  advanceToNext = () => {
    // TODO - this isn't the actual traversal order we want
    this.setState(prevState => {
      let { activePtLoc } = prevState;
      let [y, x] = activePtLoc;
      let newLoc = [y, x + 1];
      if (y === x) newLoc = [y + 1, 0];
      return { activePtLoc: newLoc };
    });
  };

  /**
   * Converts the nested array of point data into an array of LabeledCircle components.
   */
  generateLabeledCircles = () => {
    const { points, activePtLoc } = this.state;
    const [activeY, activeX] = activePtLoc;
    return points.reduce((components, pointRow, y) => {
      let componentRow = pointRow.map((p, x) => (
        <LabeledCircle
          {...p}
          handleLeave={this.handleTooltipHide}
          handleUpdate={this.handleTooltipShow.bind(this, p)}
          key={`${p.x}|${p.y}`}
          label={p.label}
          isActive={x === activeX && y === activeY}
        />
      ));
      return [...components, componentRow];
    }, []);
  };

  /**
   * Generates colored triangles based off of the point data.
   */
  generateTriangles = () => {
    const { points } = this.state;
    const components = [];
    for (let y = 0; y < points.length - 1; y++) {
      let pointsRow = points[y];
      for (let x = 0; x < pointsRow.length; x++) {
        // make a triangle with unique top point
        let topTrianglePts = [
          points[y][x], // top corner
          points[y + 1][x], // bottom left corner
          points[y + 1][x + 1] // bottom right corner
        ];
        let key = topTrianglePts.map(c => `${c.x}|${c.y}`).join("|");
        components.push(
          <Polygon
            points={topTrianglePts}
            key={key}
            fill={this.getTriangleColor(topTrianglePts)}
          />
        );
        if (x < pointsRow.length - 1) {
          // if possible, make a triangle with a unique bottom point
          let bottomTrianglePts = [
            points[y][x], // top left corner
            points[y][x + 1], // top right corner
            points[y + 1][x + 1], // bottom corner
          ]
          let key = bottomTrianglePts.map(c => `${c.x}|${c.y}`).join("|");
          components.push(
            <Polygon
              points={bottomTrianglePts}
              key={key}
              fill={this.getTriangleColor(bottomTrianglePts)}
            />
          );
        } 
      }
    }
    return components;
  };

  /**
   * Determines the fill of a triangle based on the colors at the corners.
   * @param {Object} corners - data (including colors) for the three corner points.
   */
  getTriangleColor = corners => {
    const colors = corners.map(c => c.color);
    const colorMap = generateFreqMap(colors);
    // Case 1: If any of the colors is black, use the default color
    if (colorMap.has(COLORS.BLACK)) return COLORS.LIGHT_GRAY;

    // Case 2: If all of the colors are the same, use that color for the fill.
    if (colorMap.size === 1) return colorMap.keys().next().value;

    // Case 3: If all of the colors are different, use white for the fill.
    if (colorMap.size === 3) return COLORS.WHITE;

    // Case 4: Otherwise, exactly two corners have the same color.
    // Fill the triangle in proportion to the colors at the corners.
    const colorHexes = Array.from(colorMap.keys());
    const counts = Array.from(colorMap.values());
    const fraction = counts[0] / (counts[0] + counts[1]);
    return mix(fraction, ...colorHexes);
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
  };

  render() {
    const { width, height, roomColors } = this.props;
    const {
      activePtLoc,
      currentColorIdx,
      points,
      tooltipVisible,
      tooltipX,
      tooltipY,
      tooltipBody
    } = this.state;
    const currentRoommate = this.getActiveRoommate();
    const [activeY, activeX] = activePtLoc;
    const activePoint = points[activeY][activeX];
    const { prices } = activePoint;
    const radioButtonLabels = this.getTooltipBody(activePoint).map(
      (text, idx) => ({
        text,
        color: COLORS[roomColors[idx].toUpperCase()],
        disabled: this.shouldBeDisabled(prices, idx)
      })
    );
    let buttonText = "";
    if (currentColorIdx !== null) {
      let currentColor = roomColors[currentColorIdx].toLowerCase();
      buttonText = `Confirm the ${currentColor} room for ${currentRoommate}.`;
    }
    return (
      <ColumnLayout break="extraSmall" sizes={[3, 2]}>
        <div>
          <ClippedSVG width={width} height={height} id="rent">
            {this.generateTriangles()}
            {this.generateLabeledCircles()}
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
            handleSelectConfirm={this.handleRoomChoice}
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
  corners: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  height: PropTypes.number.isRequired,
  initialR: PropTypes.number.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  rent: PropTypes.number.isRequired,
  roomColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  width: PropTypes.number.isRequired
};

const width = 600;
const height = 600;
const rent = 1600;
const traingleRad = height / 2 - 20;
const xBase = width / 2;
const yBase = height / 2 + 70;

RentDivision.defaultProps = {
  corners: [
    {
      x: xBase + traingleRad * Math.cos(Math.PI / 2),
      y: yBase - traingleRad * Math.sin(Math.PI / 2),
      prices: [0, 0, rent]
    },
    {
      x: xBase + traingleRad * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
      y: yBase - traingleRad * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
      prices: [rent, 0, 0]
    },
    {
      x: xBase + traingleRad * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
      y: yBase - traingleRad * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
      prices: [0, rent, 0]
    }
  ],
  height,
  initialR: 5,
  meshLevels: 5,
  names: ["Alex", "Brett", "Cameron"],
  rent,
  roomColors: ["Orange", "Green", "Purple"],
  width
};

export default RentDivision;
