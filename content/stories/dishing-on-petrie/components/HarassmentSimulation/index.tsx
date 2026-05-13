"use client";

import type { FC } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import FlexContainer from "@/components/story/shared/FlexContainer";
import HorizontalBar from "@/components/story/shared/HorizontalBar";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import SliderGroup from "@/components/story/shared/Slider/SliderGroup";
import { Button } from "@/components/ui/Button";
import HarassmentNodeGroup from "./HarassmentNodeGroup";
import { useHarassmentSimulation } from "./useHarassmentSimulation";

export interface HarassmentSimulationProps {
  idx?: number;
  initialV?: number;
  width?: number;
  height?: number;
  padding?: number;
}

const HarassmentSimulation: FC<HarassmentSimulationProps> = ({
  idx = 0,
  initialV = 2,
  width = 900,
  height = 500,
  padding = 0,
}) => {
  const {
    playing,
    paused,
    blueCount,
    greenCount,
    blueOnBlueProb,
    greenOnGreenProb,
    blueOnGreenProb,
    greenOnBlueProb,
    handleShout,
    buttonData,
    greenSliders,
    blueSliders,
    barInfo,
  } = useHarassmentSimulation(idx);

  return (
    <NarrowContainer width="82%" className="font-sans">
      <div className="mb-4">
        {playing ? (
          <div>
            {barInfo.map((bar) => (
              <HorizontalBar
                data={bar.data}
                title={bar.title}
                key={bar.title}
              />
            ))}
          </div>
        ) : (
          <FlexContainer shouldWrap className="gap-8">
            <NarrowContainer width="45%" fullWidthAt="sm">
              <SliderGroup data={greenSliders} column />
            </NarrowContainer>
            <NarrowContainer width="45%" fullWidthAt="sm">
              <SliderGroup data={blueSliders} column />
            </NarrowContainer>
          </FlexContainer>
        )}
      </div>

      <div className="my-4 flex justify-center gap-4">
        {buttonData.map((b) => (
          <Button
            key={b.buttonText}
            size="sm"
            variant={b.variant}
            onClick={b.handleClick}
            style={b.color ? { backgroundColor: b.color } : undefined}
            className={b.color ? "text-white hover:brightness-110" : undefined}
          >
            {b.buttonText}
          </Button>
        ))}
      </div>

      <ClippedSVG
        width={width}
        height={height}
        padding={padding}
        id={`simulation-${idx}`}
      >
        <HarassmentNodeGroup
          greenCount={greenCount}
          blueCount={blueCount}
          width={width}
          height={height}
          playing={playing}
          paused={paused}
          initialV={initialV}
          handleShout={handleShout}
          blueOnBlueProb={blueOnBlueProb}
          greenOnGreenProb={greenOnGreenProb}
          blueOnGreenProb={blueOnGreenProb}
          greenOnBlueProb={greenOnBlueProb}
        />
      </ClippedSVG>
    </NarrowContainer>
  );
};

export default HarassmentSimulation;
