"use client";

import { FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import FlexContainer from "@/components/story/shared/FlexContainer";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";
import { total } from "@/utils/mathHelpers";
import {
  generateAllPoints,
  generateFreqMap,
  mixColors,
  type PointData,
} from "./helpers";
import Polygon from "./Polygon";
import LabeledCircle from "./LabeledCircle";
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

interface RentDivisionProps {
  caption?: string;
  captionMarginTop?: string;
}

const RentDivision: FC<RentDivisionProps> = ({ caption }) => {
  const [meshLevels, setMeshLevels] = useState(INITIAL_MESH_LEVELS);
  const [points, setPoints] = useState<PointData[][]>(() =>
    generateAllPoints(INITIAL_MESH_LEVELS, DEFAULT_CORNERS, INITIAL_R, NAMES),
  );
  const [activePtLoc, setActivePtLoc] = useState<[number, number]>([0, 0]);
  const [currentColorIdx, setCurrentColorIdx] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [finalCorners, setFinalCorners] = useState<PointData[] | null>(null);
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const getNameFromLabel = (pt: PointData) =>
    NAMES.find((name) => name[0] === pt.label)!;

  const getTooltipBody = (point: PointData) =>
    point.prices.map(
      (price, idx) => `${ROOM_COLORS[idx]}: $${price.toFixed(2)}`,
    );

  const shouldBeDisabled = (prices: number[], idx: number) => {
    const anyFree = prices.some((p) => p === 0);
    return anyFree && prices[idx] !== 0;
  };

  const getTriangleColor = (corners: PointData[]) => {
    const colors = corners.map((c) => c.color);
    const colorMap = generateFreqMap(colors);
    if (colorMap.has(COLORS.BLACK)) return COLORS.LIGHT_GRAY;
    if (colorMap.size === 1) return colorMap.keys().next().value as string;
    if (colorMap.size === 3) return COLORS.WHITE;
    const colorHexes = Array.from(colorMap.keys()) as string[];
    const counts = Array.from(colorMap.values());
    return mixColors(counts[0] / (counts[0] + counts[1]), colorHexes[0], colorHexes[1]);
  };


  const advanceToNext = (updatedPoints: PointData[][], loc: [number, number]) => {
    const [y, x] = loc;
    const point = updatedPoints[y][x];

    if (y === 0) return { activePtLoc: [1, 0] as [number, number], finalCorners: null };
    if (y === 1 && x === 0) return { activePtLoc: [1, 1] as [number, number], finalCorners: null };

    const candidates = [
      { x: x - 1, y: y - 1 },
      { x, y: y - 1 },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      { x, y: y + 1 },
      { x: x - 1, y },
    ].map((n) => ({ ...n, color: updatedPoints[n.y]?.[n.x]?.color ?? null }));

    let nextLoc: [number, number] | null = null;

    for (let i = 0; i < candidates.length; i++) {
      const curr = candidates[i];
      const next = candidates[(i + 1) % candidates.length];
      const colors = [curr.color, next.color, point.color];
      const colorSet = new Set(colors);

      if (
        colorSet.size === 3 &&
        !colorSet.has(null) &&
        !colorSet.has(COLORS.BLACK)
      ) {
        return {
          activePtLoc: loc,
          finalCorners: [
            updatedPoints[curr.y][curr.x],
            updatedPoints[next.y][next.x],
            point,
          ],
        };
      }

      if (
        curr.color !== null &&
        curr.color !== COLORS.BLACK &&
        curr.color !== point.color &&
        next.color === COLORS.BLACK &&
        !nextLoc
      ) {
        nextLoc = [next.y, next.x];
      }

      if (
        next.color !== null &&
        next.color !== COLORS.BLACK &&
        next.color !== point.color &&
        curr.color === COLORS.BLACK
      ) {
        nextLoc = [curr.y, curr.x];
      }
    }

    return { activePtLoc: nextLoc ?? loc, finalCorners: null };
  };

  const handleRoomChoice = () => {
    if (currentColorIdx === null) return;
    const [y, x] = activePtLoc;
    const colorStr = ROOM_COLORS[currentColorIdx].toUpperCase();
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
        <NarrowContainer width="70%" fullWidthAt="sm">
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
          <FlexContainer main="center">
            <Button onClick={() => setStarted(true)}>Start Demonstration</Button>
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
          name: getNameFromLabel(p),
          color: ROOM_COLORS[colorIdx],
          price: p.prices[colorIdx],
        };
      });
      const totalPledged = total(pointData, (p) => p.price);
      const rentRemaining = RENT - totalPledged;
      return (
        <FlexContainer column main="center" cross="start" textAlign="center">
          <h3>You&apos;re within ${rentRemaining.toFixed(0)} of a fair division!</h3>
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
            They can each chip in an additional ${(rentRemaining / 3).toFixed(2)}{" "}
            to make up the remaining cost.{" "}
            <br />
            If that doesn&apos;t seem fair, you can refine the mesh and try again.
          </p>
          <Button onClick={handleReset}>Try again</Button>
        </FlexContainer>
      );
    }

    const [activeY, activeX] = activePtLoc;
    const activePoint = points[activeY][activeX];
    const currentRoommate = getNameFromLabel(activePoint);
    const radioLabels = getTooltipBody(activePoint).map((text, idx) => ({
      text,
      color: COLORS[ROOM_COLORS[idx].toUpperCase() as keyof typeof COLORS],
      disabled: shouldBeDisabled(activePoint.prices, idx),
    }));
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
        color={p.color ?? COLORS.BLACK}
        handleLeave={hideTooltip}
        handleUpdate={showTooltip("Room Prices", getTooltipBody(p))}
        isActive={x === activeX && y === activeY && startedButNotFinished}
      />
    )),
  );

  return (
    <Caption caption={caption}>
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
    </Caption>
  );
};

export default RentDivision;
