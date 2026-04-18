"use client";

import { FC, useState, useCallback, useMemo } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import FlexContainer from "@/components/story/shared/FlexContainer";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import SliderGroup from "@/components/story/shared/Slider/SliderGroup";
import HorizontalBar from "@/components/story/shared/HorizontalBar";
import HarassmentNodeGroup from "./HarassmentNodeGroup";

const COLORS = {
  BLUE: "#1E3A8A",
  GREEN: "#22C55E",
  RED: "#EF4444",
  ORANGE: "#F97316",
};

export interface HarassmentSimulationProps {
  idx?: number;
  initialV?: number;
  width?: number;
  height?: number;
  padding?: number;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const HarassmentSimulationClient: FC<HarassmentSimulationProps> = ({
  idx = 0,
  initialV = 2,
  width = 900,
  height = 500,
  padding = 0,
}) => {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [blueCount, setBlueCount] = useState(10);
  const [greenCount, setGreenCount] = useState(20);

  const [blueShoutsHeardFromBlueOnly, setBlueShoutsHeardFromBlueOnly] =
    useState<Set<number>>(new Set());
  const [blueShoutsHeardFromGreen, setBlueShoutsHeardFromGreen] = useState<
    Set<number>
  >(new Set());
  const [greenShoutsHeardFromBlue, setGreenShoutsHeardFromBlue] = useState<
    Set<number>
  >(new Set());
  const [greenShoutsHeardFromGreenOnly, setGreenShoutsHeardFromGreenOnly] =
    useState<Set<number>>(new Set());

  const [blueOnBlueProb, setBlueOnBlueProb] = useState(0.05);
  const [greenOnGreenProb, setGreenOnGreenProb] = useState(0.05);
  const [blueOnGreenProb, setBlueOnGreenProb] = useState(0.05);
  const [greenOnBlueProb, setGreenOnBlueProb] = useState(0.05);

  const handleStart = () => {
    setPlaying(true);
    setBlueShoutsHeardFromBlueOnly(new Set());
    setBlueShoutsHeardFromGreen(new Set());
    setGreenShoutsHeardFromBlue(new Set());
    setGreenShoutsHeardFromGreenOnly(new Set());
  };

  const handleStop = () => {
    setPlaying(false);
    setPaused(false);
    setBlueCount(10);
    setGreenCount(20);
    setBlueOnBlueProb(0.05);
    setGreenOnGreenProb(0.05);
    setBlueOnGreenProb(0.05);
    setGreenOnBlueProb(0.05);
  };

  const handleShout = useCallback(
    (key: string, shoutId: number) => {
      setBlueShoutsHeardFromBlueOnly((prevBlueOnly) => {
        const newBlueOnly = new Set(prevBlueOnly);
        if (
          key === "blueShoutsHeardFromBlueOnly" &&
          !greenShoutsHeardFromBlue.has(shoutId)
        ) {
          newBlueOnly.add(shoutId);
          return newBlueOnly;
        }
        return prevBlueOnly;
      });

      setGreenShoutsHeardFromGreenOnly((prevGreenOnly) => {
        const newGreenOnly = new Set(prevGreenOnly);
        if (
          key === "greenShoutsHeardFromGreenOnly" &&
          !blueShoutsHeardFromGreen.has(shoutId)
        ) {
          newGreenOnly.add(shoutId);
          return newGreenOnly;
        }
        return prevGreenOnly;
      });

      if (key === "blueShoutsHeardFromGreen") {
        setBlueShoutsHeardFromGreen((prev) => new Set(prev).add(shoutId));
      }
      if (key === "greenShoutsHeardFromBlue") {
        setGreenShoutsHeardFromBlue((prev) => new Set(prev).add(shoutId));
      }
    },
    [greenShoutsHeardFromBlue, blueShoutsHeardFromGreen],
  );

  const handlePause = () => setPaused((prev) => !prev);

  const buttonData = useMemo(() => {
    if (!playing) {
      return [
        { handleClick: handleStart, buttonText: "Start", color: COLORS.BLUE },
      ];
    }
    return [
      {
        handleClick: handlePause,
        buttonText: paused ? "Resume" : "Pause",
        color: COLORS.ORANGE,
      },
      { handleClick: handleStop, buttonText: "Reset", color: COLORS.RED },
    ];
  }, [playing, paused]);

  const greenSliders = [
    {
      key: "greenCount",
      handleValueChange: setGreenCount,
      title: `Number of Green-eyed People: ${greenCount}`,
      value: greenCount,
      min: 1,
      max: 20,
      step: 1,
      color: COLORS.GREEN,
    },
    ...(idx > 0
      ? [
          {
            key: "greenOnGreenProb",
            value: greenOnGreenProb,
            handleValueChange: setGreenOnGreenProb,
            title: `${(greenOnGreenProb * 100).toFixed(0)}% chance of harassment with ${capitalize("green")}`,
            min: 0,
            max: 0.25,
            step: 0.01,
            color: COLORS.GREEN,
          },
          {
            key: "greenOnBlueProb",
            value: greenOnBlueProb,
            handleValueChange: setGreenOnBlueProb,
            title: `${(greenOnBlueProb * 100).toFixed(0)}% chance of harassment with ${capitalize("blue")}`,
            min: 0,
            max: 0.25,
            step: 0.01,
            color: COLORS.GREEN,
          },
        ]
      : []),
  ];

  const blueSliders = [
    {
      key: "blueCount",
      handleValueChange: setBlueCount,
      title: `Number of Blue-eyed People: ${blueCount}`,
      value: blueCount,
      min: 1,
      max: 20,
      step: 1,
      color: COLORS.BLUE,
    },
    ...(idx > 0
      ? [
          {
            key: "blueOnBlueProb",
            value: blueOnBlueProb,
            handleValueChange: setBlueOnBlueProb,
            title: `${(blueOnBlueProb * 100).toFixed(0)}% chance of harassment with ${capitalize("blue")}`,
            min: 0,
            max: 0.25,
            step: 0.01,
            color: COLORS.BLUE,
          },
          {
            key: "blueOnGreenProb",
            value: blueOnGreenProb,
            handleValueChange: setBlueOnGreenProb,
            title: `${(blueOnGreenProb * 100).toFixed(0)}% chance of harassment with ${capitalize("green")}`,
            min: 0,
            max: 0.25,
            step: 0.01,
            color: COLORS.BLUE,
          },
        ]
      : []),
  ];

  const barInfo = useMemo(() => {
    const info = [
      {
        title: "Group sizes",
        data: [
          {
            size: blueCount,
            color: COLORS.BLUE,
            tooltipText: `Blue count: ${blueCount}`,
            key: "blueSize",
          },
          {
            size: greenCount,
            color: COLORS.GREEN,
            tooltipText: `Green count: ${greenCount}`,
            key: "greenSize",
          },
        ],
      },
      {
        title: "Comments Overheard by Opposite Group",
        data: [
          {
            size: blueShoutsHeardFromGreen.size,
            color: COLORS.BLUE,
            tooltipText: `Harassment heard by blue, coming from green: ${blueShoutsHeardFromGreen.size}`,
            key: "blueHeardGreen",
          },
          {
            size: greenShoutsHeardFromBlue.size,
            color: COLORS.GREEN,
            tooltipText: `Harassment heard by green, coming from blue: ${greenShoutsHeardFromBlue.size}`,
            key: "greenHeardBlue",
          },
        ],
      },
    ];

    if (idx === 2) {
      info[1].title = "All Comments Heard";
      info[1].data = [
        {
          size: blueShoutsHeardFromBlueOnly.size,
          color: "#1E40AF",
          tooltipText: `Harassment heard only by blue, coming from blue: ${blueShoutsHeardFromBlueOnly.size}`,
          key: "blueHeardBlue",
        },
        ...info[1].data,
        {
          size: greenShoutsHeardFromGreenOnly.size,
          color: "#166534",
          tooltipText: `Harassment heard only by green, coming from green: ${greenShoutsHeardFromGreenOnly.size}`,
          key: "greenHeardGreen",
        },
      ];
    }
    return info;
  }, [
    blueCount,
    greenCount,
    blueShoutsHeardFromGreen,
    greenShoutsHeardFromBlue,
    blueShoutsHeardFromBlueOnly,
    greenShoutsHeardFromGreenOnly,
    idx,
  ]);

  return (
    <NarrowContainer width="75%" className="mb-8 font-sans">
      <div className="mb-4">
        {playing ? (
          <div>
            {barInfo.map((bar, i) => (
              <HorizontalBar data={bar.data} title={bar.title} key={i} />
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

      <div className="my-8 flex justify-center gap-4">
        {buttonData.map((b, i) => (
          <button
            key={i}
            onClick={b.handleClick}
            style={{ backgroundColor: b.color }}
            className="rounded-lg px-6 py-2 font-bold tracking-wide text-white shadow-md transition-all hover:brightness-110 focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95"
          >
            {b.buttonText}
          </button>
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

export default HarassmentSimulationClient;
