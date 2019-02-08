import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  Button,
  ColumnLayout,
  HeatChart,
  Icon,
  InteractiveGrid
} from "story_components";
import {
  setDistrictCounts,
  unsetDistrictCounts
} from "store/actions/mind-the-gerrymandered-gap";
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

const getInitialState = (rowCount, colCount) => ({
  segments: Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
    Array(colCount - 1 + (i % 2)).fill(false)
  ),
  districts: [[]],
  saveable: false
});

class SampleGerrymander extends Component {
  state = getInitialState(this.props.rowCount, this.props.colCount);

  componentDidMount() {
    const segments = JSON.parse(localStorage.getItem("segments"));
    if (segments) {
      this.setState({ segments }, this.__countRegions);
    } else {
      this.__countRegions();
      this.updateStore();
    }
  }

  blueCount = district => district.filter(d => d[0] % 2 === 0).length;

  redCount = district => district.filter(d => d[0] % 2 === 1).length;

  validDistricts = () => {
    const { districts } = this.state;
    const { rowCount, colCount } = this.props;
    return (
      districts.length === rowCount &&
      districts.every(d => d.length === colCount)
    );
  };

  handleSave = () => {
    const { segments } = this.state;
    localStorage.setItem("segments", JSON.stringify(segments));
    this.setState({ saveable: false });
  };

  handleReset = () => {
    localStorage.removeItem("segments");
    const { rowCount, colCount } = this.props;
    this.setState(getInitialState(rowCount, colCount), this.__countRegions);
  };

  handleSegmentUpdate = (row, col, segStatus, e) => {
    if (segStatus !== null) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        segments[row][col] = segStatus;
        return { segments, saveable: true };
      }, this.__countRegions);
    }
  };

  updateStore = () => {
    const { districts } = this.state;
    const { unsetDistrictCounts, setDistrictCounts } = this.props;
    if (this.validDistricts()) {
      setDistrictCounts(
        districts.map(d => [this.blueCount(d), this.redCount(d)])
      );
    } else {
      unsetDistrictCounts();
    }
  };

  __countRegions = () => {
    const { rowCount, colCount } = this.props;
    const { districts } = this.state;
    const visitedYet = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }).fill(false)
    );
    const newDistricts = [];
    visitedYet.forEach((row, rowIdx) => {
      row.forEach((isVisited, colIdx) => {
        if (!isVisited) {
          newDistricts.push(
            this.__calculateArea(visitedYet, [[rowIdx, colIdx]])
          );
        }
      });
    });
    const newDistrict = districts.length !== newDistricts.length;
    const updatedDistrict = districts.some(
      (district, i) => district.length !== newDistricts[i].length
    );
    if (newDistrict || updatedDistrict) {
      this.setState({ districts: newDistricts }, this.updateStore);
    }
  };

  __calculateArea = (visitedYet, whereToLook) => {
    const { segments } = this.state;
    let district = [];
    while (whereToLook.length > 0) {
      let [row, col] = whereToLook.shift();
      if (visitedYet[row][col] === false) {
        visitedYet[row][col] = true;
        district.push([row, col]);
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
    return district;
  };

  render() {
    const { rowCount, colCount, colors } = this.props;
    const { districts, segments, saveable } = this.state;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    return (
      <ColumnLayout break="small" sizes={[3, 2]}>
        <HeatChart
          data={heatData}
          axes={false}
          tooltip={false}
          colorRange={colors}
        >
          <InteractiveGrid
            strokeWidth={6}
            rowCount={rowCount}
            colCount={colCount}
            handleSegmentUpdate={this.handleSegmentUpdate}
            segments={segments}
          />
        </HeatChart>
        <StyledDistrictData>
          {districts.length > rowCount ? (
            <h2>Too many districts!</h2>
          ) : (
            Array.from({ length: rowCount }).map((_, idx) => {
              let size = (districts[idx] && districts[idx].length) || "--";
              let icon = (
                <Icon name="times-circle" color={COLORS.RED} size={2} />
              );
              if (districts[idx] && districts[idx].length === colCount) {
                icon = (
                  <Icon name="check-circle" color={COLORS.GREEN} size={2} />
                );
              }
              let msgByColor = null;
              let color = COLORS.BLACK;
              if (districts[idx]) {
                let blueTotal = this.blueCount(districts[idx]);
                let redTotal = this.redCount(districts[idx]);
                msgByColor = `(${blueTotal} blue, ${redTotal} red)`;
                if (blueTotal > redTotal) color = COLORS.DARK_BLUE;
                if (redTotal > blueTotal) color = COLORS.RED;
              }
              return (
                <div key={idx}>
                  <h4 style={{ color }}>
                    D{idx + 1}: {size} {msgByColor}
                  </h4>
                  {icon}
                </div>
              );
            })
          )}
          <div>
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
          </div>
        </StyledDistrictData>
      </ColumnLayout>
    );
  }
}

SampleGerrymander.propTypes = {
  colCount: PropTypes.number.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  rowCount: PropTypes.number.isRequired,
  setDistrictCounts: PropTypes.func.isRequired,
  unsetDistrictCounts: PropTypes.func.isRequired
};

SampleGerrymander.defaultProps = {
  colCount: 9,
  colors: [COLORS.DARK_BLUE, COLORS.RED],
  rowCount: 6,
  setDistrictCounts: () => {},
  unsetDistrictCounts: () => {}
};

export default connect(
  null,
  { setDistrictCounts, unsetDistrictCounts }
)(SampleGerrymander);

export { SampleGerrymander };
