"use client";

import { scaleLinear } from "d3-scale";
import { useCallback, useState } from "react";
import BarGraph from "@/components/story/shared/BarGraph";
import Caption from "@/components/story/shared/Caption";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import SliderGroup from "@/components/story/shared/Slider/SliderGroup";
import COLORS from "@/utils/styles";
import updateSpeeds from "../../data";
import EconomyNodeGroup from "./EconomyNodeGroup";

interface EconomySimulationProps {
  idx?: number;
  caption?: string;
  editSavings?: boolean;
  width?: number;
  height?: number;
  initialV?: number;
}

const EconomySimulation = ({
  idx = 0,
  caption,
  editSavings = false,
  width = 600,
  height = 600,
  initialV = 10,
}: EconomySimulationProps) => {
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [showingSimulation, setShowingSimulation] = useState(true);
  const [speeds, setSpeeds] = useState<number[]>(() => new Array(2).fill(initialV));
  const [velocityMultiplier, setVelocityMultiplier] = useState(1);
  const [savingsRate, setSavingsRate] = useState(0);

  const handleStart = () => setPlaying(true);

  const handleStop = () => {
    setPlaying(false);
    setPaused(false);
    setVelocityMultiplier(1);
    setShowingSimulation(true);
    setSpeeds(new Array(2).fill(initialV));
    setSavingsRate(0);
  };

  const handlePause = () => setPaused(p => !p);

  const handleSpeedCount = (newCount: number) => {
    setSpeeds(new Array(Math.round(newCount)).fill(initialV));
  };

  const handleSpeedsChange = useCallback(
    (newSpeeds: number[]) => setSpeeds(newSpeeds),
    []
  );

  const yScale = scaleLinear()
    .domain([0, Math.max(...speeds, 2.5 * initialV) ** 2 + 100])
    .range([height, 0]);

  const barData = speeds
    .map((speed, i) => ({ key: i, height: speed ** 2 }))
    .sort((a, b) => a.height - b.height);

  const preStartSliders = [
    {
      handleValueChange: handleSpeedCount,
      title: "Population Size",
      value: speeds.length,
      min: 2,
      max: 30,
      step: 1,
      color: COLORS.MAROON,
      minIcon: "user",
      maxIcon: "users",
    },
    ...(editSavings
      ? [
          {
            handleValueChange: setSavingsRate,
            title: "Savings Rate",
            value: savingsRate,
            min: 0,
            max: 1,
            step: 0.01,
            color: COLORS.MAROON,
            minIcon: "thermometer-empty",
            maxIcon: "thermometer-full",
          },
        ]
      : []),
  ];

  const postStartSliders = [
    {
      handleValueChange: setVelocityMultiplier,
      title: "Average Wealth (a.k.a. Average Speed)",
      value: velocityMultiplier,
      min: 0.1,
      max: 2,
      step: 0.1,
      color: COLORS.MAROON,
      minIcon: "step-forward",
      maxIcon: "fast-forward",
    },
  ];

  return (
    <Caption caption={caption}>
      <NarrowContainer width="50%">
        <SliderGroup data={playing ? postStartSliders : preStartSliders} />

        <div className="my-4 flex justify-center gap-3">
          {!playing ? (
            <button
              onClick={handleStart}
              style={{ backgroundColor: COLORS.MAROON }}
              className="rounded-lg px-6 py-2 font-bold tracking-wide text-white shadow-md transition-all hover:brightness-110 active:scale-95"
            >
              Start
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                style={{ backgroundColor: COLORS.ORANGE }}
                className="rounded-lg px-6 py-2 font-bold tracking-wide text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => setShowingSimulation(s => !s)}
                style={{ backgroundColor: COLORS.BLUE }}
                className="rounded-lg px-6 py-2 font-bold tracking-wide text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                {showingSimulation ? "Show Chart" : "Show Nodes"}
              </button>
              <button
                onClick={handleStop}
                style={{ backgroundColor: COLORS.RED }}
                className="rounded-lg px-6 py-2 font-bold tracking-wide text-white shadow-md transition-all hover:brightness-110 active:scale-95"
              >
                Reset
              </button>
            </>
          )}
        </div>

        {/* Both views are always mounted so collisions continue regardless of which is shown */}
        <div style={{ display: showingSimulation ? "block" : "none" }}>
          <ClippedSVG id={`simulation-${idx}`} width={width} height={height} padding={0}>
            <EconomyNodeGroup
              width={width}
              height={height}
              speeds={speeds}
              playing={playing}
              paused={paused}
              velocityMultiplier={velocityMultiplier}
              savingsRate={savingsRate}
              initialV={initialV}
              updateFn={updateSpeeds[idx]}
              onSpeedsChange={handleSpeedsChange}
            />
          </ClippedSVG>
        </div>
        <div style={{ display: showingSimulation ? "none" : "block" }}>
          <BarGraph
            animated={false}
            svgId={`bar-${idx}`}
            width={width}
            height={height}
            padding={0}
            barData={barData}
            yScale={yScale}
            color={COLORS.MAROON}
            tickStep={initialV ** 2}
            barLabel={bar => Number(bar.key) + 1}
          />
        </div>
      </NarrowContainer>
    </Caption>
  );
};

export default EconomySimulation;
