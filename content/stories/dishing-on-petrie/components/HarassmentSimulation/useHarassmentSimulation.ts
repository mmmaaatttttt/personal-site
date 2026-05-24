import { useCallback, useMemo, useReducer, useState } from "react";
import { COLORS } from "./constants";
import { initialShoutState, shoutReducer } from "./shoutReducer";
import { capitalize } from "./stringHelpers";

export function useHarassmentSimulation(idx: number) {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [blueCount, setBlueCount] = useState(10);
  const [greenCount, setGreenCount] = useState(20);
  const [shouts, dispatchShout] = useReducer(shoutReducer, initialShoutState);
  const [blueOnBlueProb, setBlueOnBlueProb] = useState(0.05);
  const [greenOnGreenProb, setGreenOnGreenProb] = useState(0.05);
  const [blueOnGreenProb, setBlueOnGreenProb] = useState(0.05);
  const [greenOnBlueProb, setGreenOnBlueProb] = useState(0.05);

  const handleStart = useCallback(() => {
    setPlaying(true);
    dispatchShout({ type: "reset" });
  }, []);

  const handleStop = useCallback(() => {
    setPlaying(false);
    setPaused(false);
    setBlueCount(10);
    setGreenCount(20);
    setBlueOnBlueProb(0.05);
    setGreenOnGreenProb(0.05);
    setBlueOnGreenProb(0.05);
    setGreenOnBlueProb(0.05);
  }, []);

  const handleShout = useCallback((key: string, shoutId: number) => {
    dispatchShout({ type: "shout", key, shoutId });
  }, []);

  const handlePause = useCallback(() => setPaused((prev) => !prev), []);

  const buttonData = useMemo(() => {
    if (!playing) {
      return [
        {
          handleClick: handleStart,
          buttonText: "Start",
          variant: "white" as const,
          color: undefined,
        },
      ];
    }
    return [
      {
        handleClick: handlePause,
        buttonText: paused ? "Resume" : "Pause",
        variant: "default" as const,
        color: COLORS.ORANGE,
      },
      {
        handleClick: handleStop,
        buttonText: "Reset",
        variant: "default" as const,
        color: COLORS.RED,
      },
    ];
  }, [playing, paused, handleStart, handlePause, handleStop]);

  const greenSliders = useMemo(
    () => [
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
    ],
    [idx, greenCount, greenOnGreenProb, greenOnBlueProb],
  );

  const blueSliders = useMemo(
    () => [
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
    ],
    [idx, blueCount, blueOnBlueProb, blueOnGreenProb],
  );

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
            size: shouts.blueShoutsHeardFromGreen.size,
            color: COLORS.BLUE,
            tooltipText: `Harassment heard by blue, coming from green: ${shouts.blueShoutsHeardFromGreen.size}`,
            key: "blueHeardGreen",
          },
          {
            size: shouts.greenShoutsHeardFromBlue.size,
            color: COLORS.GREEN,
            tooltipText: `Harassment heard by green, coming from blue: ${shouts.greenShoutsHeardFromBlue.size}`,
            key: "greenHeardBlue",
          },
        ],
      },
    ];

    if (idx === 2) {
      info[1].title = "All Comments Heard";
      info[1].data = [
        {
          size: shouts.blueShoutsHeardFromBlueOnly.size,
          color: "#1E40AF",
          tooltipText: `Harassment heard only by blue, coming from blue: ${shouts.blueShoutsHeardFromBlueOnly.size}`,
          key: "blueHeardBlue",
        },
        ...info[1].data,
        {
          size: shouts.greenShoutsHeardFromGreenOnly.size,
          color: "#166534",
          tooltipText: `Harassment heard only by green, coming from green: ${shouts.greenShoutsHeardFromGreenOnly.size}`,
          key: "greenHeardGreen",
        },
      ];
    }
    return info;
  }, [blueCount, greenCount, shouts, idx]);

  return {
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
  };
}
