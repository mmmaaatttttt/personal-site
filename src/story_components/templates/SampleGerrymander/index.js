import React, { useContext, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  Button,
  ColumnLayout,
  HeatChart,
  Icon,
  InteractiveGrid
} from "story_components";
import COLORS from "utils/styles";
import { useLocalStorage } from "hooks";
import { countDistricts, redCount, blueCount } from "./helpers";
import { BlogPostContext } from "contexts";

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

function SampleGerrymander({
  rowCount = 6,
  colCount = 9,
  colors = [COLORS.DARK_BLUE, COLORS.RED]
}) {
  const { setPostState } = useContext(BlogPostContext);

  const heatData = useMemo(
    () =>
      Array.from({ length: colCount }, () =>
        Array.from({ length: rowCount }, (_, i) => i % 2)
      ),
    [colCount, rowCount]
  );

  const falseArray = useMemo(
    () =>
      Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
        Array(colCount - 1 + (i % 2)).fill(false)
      ),
    [colCount, rowCount]
  );

  const [segments, setSegments] = useLocalStorage(
    "mindTheGerrymanderedGap:segments",
    falseArray
  );

  const districts = useMemo(
    () => countDistricts(rowCount, colCount, segments),
    [rowCount, colCount, segments]
  );

  const handleReset = () => {
    setSegments(falseArray);
  };

  const handleSegmentUpdate = (row, col, segStatus) => {
    if (segStatus !== null) {
      setSegments(prevSegs => {
        const segments = [...prevSegs];
        segments[row] = [...prevSegs[row]];
        segments[row][col] = segStatus;
        return segments;
      });
    }
  };

  useEffect(() => {
    const districtsComplete =
      districts.length === rowCount &&
      districts.every(d => d.length === colCount);
    setPostState({
      "mind-the-gerrymandered-gap": {
        districtCounts: districtsComplete
          ? districts.map(d => [blueCount(d), redCount(d)])
          : null
      }
    });
  }, [districts, setPostState, rowCount, colCount]);

  return (
    <ColumnLayout break="small" sizes={[3, 2]}>
      <HeatChart
        data={heatData}
        axes={false}
        tooltip={false}
        colorRange={colors}
        width={450}
      >
        <InteractiveGrid
          strokeWidth={6}
          rowCount={rowCount}
          colCount={colCount}
          handleSegmentUpdate={handleSegmentUpdate}
          segments={segments}
        />
      </HeatChart>
      <StyledDistrictData>
        {districts.length > rowCount ? (
          <h2>Too many districts!</h2>
        ) : (
          Array.from({ length: rowCount }).map((_, idx) => {
            let size = (districts[idx] && districts[idx].length) || "--";
            let icon = <Icon name="times-circle" color={COLORS.RED} size={2} />;
            if (districts[idx] && districts[idx].length === colCount) {
              icon = <Icon name="check-circle" color={COLORS.GREEN} size={2} />;
            }
            let msgByColor = null;
            let color = COLORS.BLACK;
            if (districts[idx]) {
              let blueTotal = blueCount(districts[idx]);
              let redTotal = redCount(districts[idx]);
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
        <Button onClick={handleReset} color={COLORS.RED}>
          Reset
        </Button>
      </StyledDistrictData>
    </ColumnLayout>
  );
}

SampleGerrymander.propTypes = {
  colCount: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  rowCount: PropTypes.number
};

export default SampleGerrymander;
