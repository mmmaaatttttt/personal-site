import React, { Component } from "react";
import PropTypes from "prop-types";
import { mix } from "polished";
import {
  Button,
  ClippedSVG,
  ColoredSpan,
  FlexContainer,
  LabeledCircle,
  LabeledSlider,
  NarrowContainer,
  Polygon,
  RadioButtonGroup,
  Tooltip
} from "story_components";
import { withCaption } from "containers";
import COLORS from "utils/styles";
import { total } from "utils/mathHelpers";
import { generateFreqMap } from "utils/arrayHelpers";
import { generateAllPoints } from "./helpers";

class RentDivision extends Component {
  constructor(props) {
    super(props);
    const initialMeshLevels = 4;
    const { corners, initialR, names } = props;
    this.state = {
      activePtLoc: [0, 0],
      currentColorIdx: null,
      started: false,
      finalCorners: null,
      meshLevels: initialMeshLevels,
      tooltipVisible: false,
      tooltipX: 0,
      tooltipY: 0,
      tooltipBody: "",
      points: generateAllPoints(initialMeshLevels, corners, initialR, names)
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
    return point.prices.map(
      (price, idx) => `${roomColors[idx]}: $${price.toFixed(2)}`
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

  /** Gets the fill name of a roommate.
   * @param {Object} pt - Point with a label
   */
  getNameFromLabel = pt => {
    const firstLetter = pt.label;
    const { names } = this.props;
    return names.find(name => name[0] === firstLetter);
  };

  /**
   * Start the demonstration after deciding on the mesh.
   */
  handleStart = () => {
    this.setState({ started: true });
  };

  /**
   * Changes the size of the mesh.
   * @param {Number} newSize - new mesh size
   */
  handleMeshSizeChange = newSize => {
    const { corners, initialR, names } = this.props;
    this.setState({
      meshLevels: newSize,
      points: generateAllPoints(newSize, corners, initialR, names)
    });
  };

  /**
   * Resets the demo after finding a successful triangle.
   */
  handleReset = () => {
    const { corners, initialR, names } = this.props;
    this.setState(prevState => ({
      activePtLoc: [0, 0],
      currentColorIdx: null,
      started: false,
      finalCorners: null,
      points: generateAllPoints(prevState.meshLevels, corners, initialR, names)
    }));
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
      const { activePtLoc, currentColorIdx, points, meshLevels } = prevState;
      const [y, x] = activePtLoc;
      const colorStr = roomColors[currentColorIdx].toUpperCase();
      const color = COLORS[colorStr];
      const newPtData = {
        ...points[y][x],
        color,
        r: (2 * initialR) / meshLevels
      };
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
    this.setState(prevState => {
      let { activePtLoc, points } = prevState;
      let [y, x] = activePtLoc;
      let point = points[y][x];
      // initial cases: need to establish first trap-door
      if (y === 0) return { activePtLoc: [1, 0] };
      if (y === 1 && x === 0) return { activePtLoc: [1, 1] };
      const neighbors = this.generateNeighbors(x, y);
      let nextActivePtLoc = null;
      for (var i = 0; i < neighbors.length; i++) {
        let curr = neighbors[i];
        let next = neighbors[(i + 1) % neighbors.length];
        let colors = [curr, next, point].map(d => d.color);
        let colorSet = new Set(colors);
        // Case 1: curr, next, and point all have different colors: we're done!
        if (
          colorSet.size === 3 &&
          !colorSet.has(null) &&
          !colorSet.has(COLORS.BLACK)
        ) {
          return {
            finalCorners: [
              points[curr.y][curr.x],
              points[next.y][next.x],
              point
            ]
          };
        }

        // Case 2: curr has a different color from point, next has no color:
        // move on to next
        if (
          curr.color !== null &&
          curr.color !== COLORS.BLACK &&
          curr.color !== point.color &&
          next.color === COLORS.BLACK &&
          !nextActivePtLoc
        ) {
          // can't return early because we could have a finished triangle
          nextActivePtLoc = [next.y, next.x];
        }

        // Case 3: next has a different color from point, curr has no color:
        // move on to curr
        if (
          next.color !== null &&
          next.color !== COLORS.BLACK &&
          next.color !== point.color &&
          curr.color === COLORS.BLACK
        ) {
          // can't return early because we could have a finished triangle
          nextActivePtLoc = [curr.y, curr.x];
        }
      }

      return { activePtLoc: nextActivePtLoc };
    });
  };

  /**
   * Generates all of the neighbors to a given point.
   * At most there will be 6 such neighbors.
   * Returns an array of six objects, consisting of array coordinates and a color.
   * The color value will be null if the point does not exist.
   * (Points at the boundary of the triangle will have fewer than 6 neighbors.)
   * The list starts from the neighbor to the northwest of the current point, and moves clockwise.
   *
   * @param {Number} x - the x-coordinate of the current point.
   * @param {Number} y - the y-coordinate of the current point.
   */
  generateNeighbors = (x, y) => {
    const { points } = this.state;
    const neighbors = [
      { x: x - 1, y: y - 1, color: null }, // top left
      { x, y: y - 1, color: null }, // top right
      { x: x + 1, y, color: null }, // right
      { x: x + 1, y: y + 1, color: null }, // bottom right
      { x, y: y + 1, color: null }, // bottom left
      { x: x - 1, y, color: null } // left
    ];
    neighbors.forEach(n => {
      if (points[n.y] && points[n.y][n.x]) {
        n.color = points[n.y][n.x].color;
      }
    });
    return neighbors;
  };

  /**
   * Converts the nested array of point data into an array of LabeledCircle components.
   */
  generateLabeledCircles = () => {
    const { points, activePtLoc, finalCorners, started } = this.state;
    const [activeY, activeX] = activePtLoc;
    const startedButNotFinished = started && finalCorners === null;
    return points.reduce((components, pointRow, y) => {
      let componentRow = pointRow.map((p, x) => (
        <LabeledCircle
          {...p}
          handleLeave={this.handleTooltipHide}
          handleUpdate={this.handleTooltipShow.bind(this, p)}
          key={`${p.x}|${p.y}`}
          label={p.label}
          isActive={x === activeX && y === activeY && startedButNotFinished}
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
            points[y + 1][x + 1] // bottom corner
          ];
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

  /**
   * Determines what should show above the triangular mesh.
   * Option 1: Haven't started yet, should display a slider to refine the mesh
   * Option 2: Ended, should show final prices and option to play again
   * Option 3: Started but not finished, should show buttons for room selection
   */
  getTopArea = () => {
    const {
      activePtLoc,
      currentColorIdx,
      finalCorners,
      meshLevels,
      points,
      started
    } = this.state;

    // haven't started yet
    if (!started) {
      return (
        <NarrowContainer width="70%" fullWidthAt="small">
          <LabeledSlider
            handleValueChange={this.handleMeshSizeChange}
            min={2}
            max={5}
            step={1}
            tickCount={4}
            title="Mesh Size"
            minIcon="compress-arrows-alt"
            maxIcon="expand-arrows-alt"
            value={meshLevels}
          />
          <FlexContainer main="center">
            <Button onClick={this.handleStart}>Start Demonstration</Button>
          </FlexContainer>
        </NarrowContainer>
      );
    }

    if (finalCorners !== null) {
      const { roomColors, rent } = this.props;
      const pointData = finalCorners.map(p => {
        const colorIdx = roomColors.findIndex(
          c => COLORS[c.toUpperCase()] === p.color
        );
        return {
          name: this.getNameFromLabel(p),
          color: roomColors[colorIdx],
          price: p.prices[colorIdx]
        };
      });
      const totalPledged = total(pointData, p => p.price);
      const rentRemaining = rent - totalPledged;
      return (
        <FlexContainer column main="center" cross="flex-start" textAlign="center">
          <h3>You're within ${rentRemaining.toFixed(0)} of a fair division!</h3>
          <FlexContainer main="space-around" width="100%" shouldWrap>
            {pointData.map(d => (
                <ColoredSpan key={d.color} color={COLORS[d.color.toUpperCase()]}>
                  {d.name} is paying ${d.price.toFixed(2)}
                </ColoredSpan>
            ))}
          </FlexContainer>
          <p>They can each chip in an additional ${(rentRemaining / 3).toFixed(2)} to make up the remaining cost. <br/>
          If that doesn't seem fair, you can refine the mesh and try again.</p>
          <Button onClick={this.handleReset}>Try again</Button>
        </FlexContainer>
      );
    }

    const { roomColors } = this.props;
    const [activeY, activeX] = activePtLoc;
    const activePoint = points[activeY][activeX];
    const currentRoommate = this.getNameFromLabel(activePoint);
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
      <FlexContainer column main="stretch" textAlign="center">
        <h2>{currentRoommate}'s Turn</h2>
        <RadioButtonGroup
          handleSelectConfirm={this.handleRoomChoice}
          handleRadioChange={this.handleRadioChange}
          labels={radioButtonLabels}
          buttonText={buttonText}
        />
      </FlexContainer>
    );
  };

  render() {
    const { width, height } = this.props;
    const { tooltipVisible, tooltipX, tooltipY, tooltipBody } = this.state;
    return (
      <div>
        {this.getTopArea()}
        <NarrowContainer width="55%" fullWidthAt="small">
          <ClippedSVG width={width} height={height} marginTop="-1.8rem" id="rent">
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
        </NarrowContainer>
      </div>
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
const traingleRad = height / 2;
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
  initialR: 30,
  names: ["Alex", "Brett", "Cameron"],
  rent,
  roomColors: ["Orange", "Green", "Purple"],
  width
};

export default withCaption(RentDivision);

export { RentDivision };
