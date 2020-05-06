import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo
} from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { scaleLinear } from "d3-scale";
import COLORS, { hexToRgba } from "utils/styles";
import { SVGContext } from "contexts";

// TODO: fix UI for segments, which are currently busted.

const StyledLine = styled.line`
  stroke: ${props => (props.isOn ? COLORS.DARK_GRAY : COLORS.WHITE)};

  ${props =>
    props.isHovered &&
    css`
      &:hover {
        cursor: pointer;
        stroke: ${props =>
          props.isOn
            ? hexToRgba(COLORS.RED, 0.9)
            : hexToRgba(COLORS.DARK_GRAY, 0.6)};
      }
    `};
`;

function InteractiveGrid({
  paddingX = 45,
  paddingY = 45,
  strokeWidth = 5,
  rowCount = 12,
  colCount = 12,
  handleSegmentUpdate = () => {},
  segments = [[]]
}) {
  const [activeSegmentStatus, setSegmentStatus] = useState(null);
  const [hovered, setHovered] = useState(null);
  const { width, height } = useContext(SVGContext);

  const handleMouseEnter = useCallback(
    (row, col) => {
      handleSegmentUpdate(row, col, activeSegmentStatus);
    },
    [handleSegmentUpdate, activeSegmentStatus]
  );

  const handleMouseMove = useCallback(
    (row, col) => {
      if (
        activeSegmentStatus === null &&
        (!hovered || hovered[0] !== row || hovered[1] !== col)
      ) {
        setHovered([row, col]);
      }
    },
    [hovered, activeSegmentStatus]
  );

  const handleMouseDown = useCallback(
    (row, col) => {
      setSegmentStatus(!segments[row][col]);
      handleSegmentUpdate(row, col, !segments[row][col]);
    },
    [segments, handleSegmentUpdate]
  );

  const handleMouseUp = useCallback(() => {
    setSegmentStatus(null);
    setHovered(null);
  }, []);

  const handleMouseOut = useCallback(() => {
    setHovered(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseUp]);

  const xScale = useCallback(
    scaleLinear()
      .domain([0, colCount])
      .range([paddingX, width - paddingX]),
    [colCount, paddingX, width]
  );

  const yScale = useCallback(
    scaleLinear()
      .domain([0, rowCount])
      .range([height - paddingY, paddingY]),
    [rowCount, paddingY, height]
  );

  const rowLines = useMemo(
    () =>
      Array.from({ length: rowCount - 1 }, (_, i) => {
        const y = yScale(i + 1);
        return (
          <line
            key={`x:${i}`}
            x1={xScale(0)}
            x2={xScale(colCount)}
            y1={y}
            y2={y}
          />
        );
      }),
    [rowCount, colCount, xScale, yScale]
  );

  const colLines = useMemo(
    () =>
      Array.from({ length: colCount - 1 }, (_, i) => {
        const x = xScale(i + 1);
        return (
          <line
            key={`y:${i}`}
            x1={x}
            x2={x}
            y1={yScale(rowCount)}
            y2={yScale(0)}
          />
        );
      }),
    [rowCount, colCount, xScale, yScale]
  );

  const styledLineData = useMemo(
    () =>
      segments
        .reduce((data, row, rowIdx) => {
          let lines = row.map((isOn, colIdx) => {
            // even rows are vertical
            // odd rows are horizontal
            let parity = rowIdx % 2; // 0 if even (vertical), 1 if odd (horizontal)
            let xOffset = (strokeWidth / 2) * parity;
            let yOffset = (strokeWidth / 2) * (1 - parity);
            return {
              x1: xScale(colIdx + 1 - parity) - xOffset,
              x2: xScale(colIdx + 1) + xOffset,
              y1: yScale((rowIdx + parity) / 2) + yOffset,
              y2: yScale((rowIdx + parity) / 2 + (1 - parity)) - yOffset,
              isOn,
              rowIdx,
              colIdx
            };
          });
          return [...data, ...lines];
        }, [])
        .sort((d1, d2) => {
          if (hovered) {
            if (d1.rowIdx === hovered[0] && d1.colIdx === hovered[1]) return 1;
            if (d2.rowIdx === hovered[0] && d2.colIdx === hovered[1]) return -1;
          }
          return d1.isOn - d2.isOn;
        }),
    [segments, strokeWidth, xScale, yScale, hovered]
  );

  const styledLines = styledLineData.map(d => (
    <StyledLine
      x1={d.x1}
      x2={d.x2}
      y1={d.y1}
      y2={d.y2}
      isOn={d.isOn}
      onMouseDown={() => handleMouseDown(d.rowIdx, d.colIdx)}
      onMouseEnter={() => handleMouseEnter(d.rowIdx, d.colIdx)}
      onMouseMove={() => handleMouseMove(d.rowIdx, d.colIdx)}
      onMouseOut={handleMouseOut}
      onBlur={handleMouseOut}
      isHovered={
        activeSegmentStatus === null &&
        hovered &&
        hovered[0] === d.rowIdx &&
        hovered[1] === d.colIdx
      }
      key={`${d.rowIdx}:${d.colIdx}`}
    />
  ));

  return (
    <g strokeWidth={strokeWidth} stroke="white">
      {rowLines}
      {colLines}
      {styledLines}
      <rect
        x={paddingX}
        y={paddingY}
        width={width - 2 * paddingX}
        height={height - 2 * paddingY}
        fill="none"
        stroke={COLORS.DARK_GRAY}
        rx={10}
        ry={10}
      />
    </g>
  );
}

InteractiveGrid.propTypes = {
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  strokeWidth: PropTypes.number,
  rowCount: PropTypes.number,
  colCount: PropTypes.number,
  handleSegmentUpdate: PropTypes.func,
  segments: PropTypes.array
};

export default React.memo(InteractiveGrid);
