"use client";

import { type FC, useState } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import FlexContainer from "@/components/story/shared/FlexContainer";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import { Button } from "@/components/ui/Button";
import { total } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";
import {
  advanceToNext,
  generateAllPoints,
  getNameFromLabel,
  getTooltipBody,
  getTriangleColor,
  type PointData,
  shouldBeDisabled,
} from "./helpers";
import LabeledCircle from "./LabeledCircle";
import Polygon from "./Polygon";
import RadioButtonGroup from "./RadioButtonGroup";

const SVG_WIDTH = 600;
const SVG_HEIGHT = 600;
const RENT = 1600;
const INITIAL_R = 30;
const INITIAL_MESH_LEVELS = 4;

const triangleRad = SVG_HEIGHT / 2;
const xBase = SVG_WIDTH / 2;
const yBase = SVG_HEIGHT / 2 + 70;

const DEFAULT_CORNERS = [
  {
    x: xBase + triangleRad * Math.cos(Math.PI / 2),
    y: yBase - triangleRad * Math.sin(Math.PI / 2),
    prices: [0, 0, RENT],
  },
  {
    x: xBase + triangleRad * Math.cos(Math.PI / 2 + (2 * Math.PI) / 3),
    y: yBase - triangleRad * Math.sin(Math.PI / 2 + (2 * Math.PI) / 3),
    prices: [RENT, 0, 0],
  },
  {
    x: xBase + triangleRad * Math.cos(Math.PI / 2 + (4 * Math.PI) / 3),
    y: yBase - triangleRad * Math.sin(Math.PI / 2 + (4 * Math.PI) / 3),
    prices: [0, RENT, 0],
  },
];

const ROOM_COLORS = ["Orange", "Green", "Purple"];
const NAMES = ["Alex", "Brett", "Cameron"];

const RentDivision: FC = () => {
  const [meshLevels, setMeshLevels] = useState(INITIAL_MESH_LEVELS);
  const [points, setPoints] = useState<PointData[][]>(() =>
    generateAllPoints(INITIAL_MESH_LEVELS, DEFAULT_CORNERS, INITIAL_R, NAMES),
  );
  const [activePtLoc, setActivePtLoc] = useState<[number, number]>([0, 0]);
  const [currentColorIdx, setCurrentColorIdx] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [finalCorners, setFinalCorners] = useState<PointData[] | null>(null);
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const handleRoomChoice = (idx: number) => {
    const [y, x] = activePtLoc;
    const colorStr = ROOM_COLORS[idx].toUpperCase();
    const color = COLORS[colorStr as keyof typeof COLORS];

    const newPtData: PointData = {
      ...points[y][x],
      color,
      r: (2 * INITIAL_R) / meshLevels,
    };
    const newPoints = points.map((row, ry) =>
      ry === y ? row.map((pt, rx) => (rx === x ? newPtData : pt)) : row,
    );

    const { activePtLoc: nextLoc, finalCorners: fc } = advanceToNext(
      newPoints,
      [y, x],
    );
    setPoints(newPoints);
    setCurrentColorIdx(null);
    if (fc) {
      setFinalCorners(fc);
    } else {
      setActivePtLoc(nextLoc);
    }
  };

  const handleMeshSizeChange = (newSize: number) => {
    setMeshLevels(newSize);
    setPoints(generateAllPoints(newSize, DEFAULT_CORNERS, INITIAL_R, NAMES));
  };

  const handleReset = () => {
    setActivePtLoc([0, 0]);
    setCurrentColorIdx(null);
    setStarted(false);
    setFinalCorners(null);
    setPoints(generateAllPoints(meshLevels, DEFAULT_CORNERS, INITIAL_R, NAMES));
  };

  // --- Top area ---
  const renderTopArea = () => {
    if (!started) {
      return (
        <NarrowContainer width="75%" fullWidthAt="sm">
          <LabeledSlider
            handleValueChange={handleMeshSizeChange}
            min={2}
            max={5}
            step={1}
            tickCount={4}
            title="Mesh Size"
            value={meshLevels}
            color={COLORS.DARK_GRAY}
          />
          <FlexContainer main="center" margin="0.5rem 0">
            <Button size="sm" variant="white" onClick={() => setStarted(true)}>
              Start Demonstration
            </Button>
          </FlexContainer>
        </NarrowContainer>
      );
    }

    if (finalCorners !== null) {
      const pointData = finalCorners.map((p) => {
        const colorIdx = ROOM_COLORS.findIndex(
          (c) => COLORS[c.toUpperCase() as keyof typeof COLORS] === p.color,
        );
        return {
          name: getNameFromLabel(p, NAMES),
          color: ROOM_COLORS[colorIdx],
          price: p.prices[colorIdx],
        };
      });
      const totalPledged = total(pointData, (p) => p.price);
      const rentRemaining = RENT - totalPledged;
      return (
        <FlexContainer column main="center" cross="start" textAlign="center">
          <h3>
            You&apos;re within ${rentRemaining.toFixed(0)} of a fair division!
          </h3>
          <FlexContainer main="around" width="100%" shouldWrap>
            {pointData.map((d) => (
              <ColoredSpan
                key={d.color}
                color={COLORS[d.color.toUpperCase() as keyof typeof COLORS]}
              >
                {d.name} is paying ${d.price.toFixed(2)}
              </ColoredSpan>
            ))}
          </FlexContainer>
          <p>
            They can each chip in an additional $
            {(rentRemaining / 3).toFixed(2)} to make up the remaining cost.{" "}
            <br />
            If that doesn&apos;t seem fair, you can refine the mesh and try
            again.
          </p>
          <Button
            size="sm"
            variant="white"
            className="mt-4"
            onClick={handleReset}
          >
            Try again
          </Button>
        </FlexContainer>
      );
    }

    const [activeY, activeX] = activePtLoc;
    const activePoint = points[activeY][activeX];
    const currentRoommate = getNameFromLabel(activePoint, NAMES);
    const radioLabels = getTooltipBody(activePoint, ROOM_COLORS).map(
      (text, idx) => ({
        text,
        color: COLORS[ROOM_COLORS[idx].toUpperCase() as keyof typeof COLORS],
        disabled: shouldBeDisabled(activePoint.prices, idx),
      }),
    );
    const buttonText =
      currentColorIdx !== null
        ? `Confirm the ${ROOM_COLORS[currentColorIdx].toLowerCase()} room for ${currentRoommate}.`
        : "";

    return (
      <FlexContainer column main="stretch" textAlign="center">
        <h2>{currentRoommate}&apos;s Turn</h2>
        <RadioButtonGroup
          handleSelectConfirm={handleRoomChoice}
          handleRadioChange={setCurrentColorIdx}
          labels={radioLabels}
          buttonText={buttonText}
        />
      </FlexContainer>
    );
  };

  // --- SVG triangles ---
  const triangles = [];
  for (let y = 0; y < points.length - 1; y++) {
    const pointsRow = points[y];
    for (let x = 0; x < pointsRow.length; x++) {
      const top3 = [points[y][x], points[y + 1][x], points[y + 1][x + 1]];
      triangles.push(
        <Polygon
          key={top3.map((c) => `${c.x}|${c.y}`).join("|")}
          points={top3}
          fill={getTriangleColor(top3)}
        />,
      );
      if (x < pointsRow.length - 1) {
        const bot3 = [points[y][x], points[y][x + 1], points[y + 1][x + 1]];
        triangles.push(
          <Polygon
            key={bot3.map((c) => `${c.x}|${c.y}`).join("|")}
            points={bot3}
            fill={getTriangleColor(bot3)}
          />,
        );
      }
    }
  }

  // --- SVG circles ---
  const [activeY, activeX] = activePtLoc;
  const startedButNotFinished = started && finalCorners === null;
  const circles = points.flatMap((pointRow, y) =>
    pointRow.map((p, x) => (
      <LabeledCircle
        key={`${p.x}|${p.y}`}
        {...p}
        color={p.color}
        handleLeave={hideTooltip}
        handleUpdate={showTooltip(
          "Room Prices",
          getTooltipBody(p, ROOM_COLORS),
        )}
        isActive={x === activeX && y === activeY && startedButNotFinished}
      />
    )),
  );

  return (
    <>
      {renderTopArea()}
      <NarrowContainer width="55%" fullWidthAt="sm">
        <div className="relative">
          <ClippedSVG width={SVG_WIDTH} height={SVG_HEIGHT} id="rent">
            {triangles}
            {circles}
          </ClippedSVG>
          <Tooltip info={tooltip} />
        </div>
      </NarrowContainer>
    </>
  );
};

export default RentDivision;
