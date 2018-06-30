import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Button,
  ColumnLayout,
  FlexContainer,
  HeatChart,
  Icon,
  InteractiveGrid,
  NarrowContainer
} from "story_components";
import COLORS from "utils/styles";

const StyledDistrictData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
  }

  h4 {
    margin: 0 0.5rem 0 0;
  }
`;

class GerrymanderSample extends Component {
  state = {
    segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
      Array(this.props.colCount - 1 + (i % 2)).fill(false)
    ),
    counts: [this.props.rowCount * this.props.colCount],
    saveable: false
  };

  componentDidMount() {
    const segments = JSON.parse(localStorage.getItem("segments"));
    if (segments) {
      this.setState({ segments }, this.__countRegions);
    }
  }

  handleSave = () => {
    const { segments } = this.state;
    localStorage.setItem("segments", JSON.stringify(segments));
    this.setState({ saveable: false });
  };

  handleReset = () => {
    localStorage.removeItem("segments");
    this.setState({
      segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
        Array(this.props.colCount - 1 + (i % 2)).fill(false)
      ),
      counts: [this.props.rowCount * this.props.colCount],
      saveable: false
    });
  };

  handleSegmentUpdate = (row, col, e) => {
    // find the number of lines under the mouse
    // this count will be greater than 2 if at an intersection
    const lineCount = document
      .elementsFromPoint(e.clientX, e.clientY)
      .filter(el => el.tagName === "line").length;
    if (lineCount === 2) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        const activeSegmentStatus = !segments[row][col];
        segments[row][col] = activeSegmentStatus;
        return { segments, saveable: true };
      }, this.__countRegions);
    }
  };

  __countRegions = () => {
    const { rowCount, colCount } = this.props;
    const { counts } = this.state;
    const visitedYet = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }).fill(false)
    );
    const newCounts = [];
    visitedYet.forEach((row, rowIdx) => {
      row.forEach((isVisited, colIdx) => {
        if (!isVisited) {
          newCounts.push(this.__calculateArea(visitedYet, [[rowIdx, colIdx]]));
        }
      });
    });
    if (
      counts.length !== newCounts.length ||
      counts.some((num, i) => num !== newCounts[i])
    ) {
      this.setState({ counts: newCounts });
    }
  };

  __calculateArea = (visitedYet, whereToLook) => {
    const { segments } = this.state;
    let count = 0;
    while (whereToLook.length > 0) {
      let [row, col] = whereToLook.shift();
      if (visitedYet[row][col] === false) {
        visitedYet[row][col] = true;
        count++;
        let shouldMoveUp =
          visitedYet[row - 1] !== undefined &&
          visitedYet[row - 1][col] === false &&
          segments[2 * row - 1][col] === false;
        let shouldMoveRight =
          visitedYet[row][col + 1] !== undefined &&
          visitedYet[row][col + 1] === false &&
          segments[2 * row][col] === false;
        let shouldMoveDown =
          visitedYet[row + 1] !== undefined &&
          visitedYet[row + 1][col] === false &&
          segments[2 * row + 1][col] === false;
        let shouldMoveLeft =
          visitedYet[row][col - 1] !== undefined &&
          visitedYet[row][col - 1] === false &&
          segments[2 * row][col - 1] === false;
        if (shouldMoveUp) whereToLook.push([row - 1, col]);
        if (shouldMoveRight) whereToLook.push([row, col + 1]);
        if (shouldMoveDown) whereToLook.push([row + 1, col]);
        if (shouldMoveLeft) whereToLook.push([row, col - 1]);
      }
    }
    return count;
  };

  render() {
    const { rowCount, colCount, colors } = this.props;
    const { counts, segments, saveable } = this.state;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    return (
      <NarrowContainer width="80%">
        <h1>Gerrymandering Interactives</h1>
        <h4>1. Create your own Gerrymander!</h4>
        <p>
          Imagine a region with 54 citizens, evenly divided among two parties
          (the orange party and the purple party). You are part of a committee
          tasked with dividing this region into six districts of the same size:
          9 citizens each.
        </p>
        <p>
          Each district will have a representative in the government that is
          elected by members from that district.
        </p>
        <p>
          Can you create the districts so that one party will receive a majority
          of the representation, even though the districts are evenly split in
          terms of population?
        </p>
        <ColumnLayout break="small" sizes={[3, 2]}>
          <HeatChart
            data={heatData}
            axes={false}
            tooltip={false}
            colorRange={colors}
          >
            <InteractiveGrid
              strokeWidth={5}
              rowCount={rowCount}
              colCount={colCount}
              handleSegmentUpdate={this.handleSegmentUpdate}
              segments={segments}
            />
          </HeatChart>
          <StyledDistrictData>
            {counts.length > 6 ? (
              <h2>Too many districts!</h2>
            ) : (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx}>
                  <h4>
                    District {idx + 1} Size: {counts[idx] || "--"}
                  </h4>
                  {counts[idx] === colCount ? (
                    <Icon name="check-circle" color={COLORS.GREEN} size={2} />
                  ) : (
                    <Icon name="times-circle" color={COLORS.RED} size={2} />
                  )}
                </div>
              ))
            )}
            <FlexContainer>
              <Button
                onClick={this.handleSave}
                disabled={!saveable}
                color={COLORS.GREEN}
              >
                {saveable ? "Save" : "Saved"}
              </Button>
              <Button onClick={this.handleReset} color={COLORS.RED}>
                Reset
              </Button>
            </FlexContainer>
          </StyledDistrictData>
        </ColumnLayout>
      </NarrowContainer>
    );
  }
}

GerrymanderSample.propTypes = {
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

GerrymanderSample.defaultProps = {
  rowCount: 6,
  colCount: 9,
  colors: [COLORS.ORANGE, COLORS.PURPLE]
};

export default GerrymanderSample;
