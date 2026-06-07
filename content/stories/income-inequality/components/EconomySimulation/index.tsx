"use client";

import { scaleLinear } from "d3-scale";
import { useCallback, useMemo, useState } from "react";
import BarGraph from "@/components/story/shared/BarGraph";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import Figure from "@/components/story/shared/Figure";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import SliderGroup from "@/components/story/shared/Slider/SliderGroup";
import { Button } from "@/components/ui/Button";
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
  const [speeds, setSpeeds] = useState<number[]>(() =>
    new Array(2).fill(initialV),
  );
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

  const handlePause = () => setPaused((p) => !p);

  const handleSpeedCount = (newCount: number) => {
    setSpeeds(new Array(Math.round(newCount)).fill(initialV));
  };

  const handleSpeedsChange = useCallback(
    (newSpeeds: number[]) => setSpeeds(newSpeeds),
    [],
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, Math.max(...speeds, 2.5 * initialV) ** 2 + 100])
        .range([height, 0]),
    [speeds, initialV, height],
  );

  const barData = useMemo(
    () =>
      speeds
        .map((speed, i) => ({ key: i, height: speed ** 2 }))
        .sort((a, b) => a.height - b.height),
    [speeds],
  );

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
    <Figure caption={caption}>
      <NarrowContainer width="55%">
        <SliderGroup data={playing ? postStartSliders : preStartSliders} />

        <div className="my-4 flex justify-center gap-3">
          {!playing ? (
            <Button
              size="sm"
              onClick={handleStart}
              className="bg-maroon hover:bg-maroon/90"
            >
              Start
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                onClick={handlePause}
                className="bg-orange hover:bg-orange/90"
              >
                {paused ? "Resume" : "Pause"}
              </Button>
              <Button
                size="sm"
                onClick={() => setShowingSimulation((s) => !s)}
                className="bg-blue hover:bg-blue/90"
              >
                {showingSimulation ? "Show Chart" : "Show Nodes"}
              </Button>
              <Button
                size="sm"
                onClick={handleStop}
                className="bg-red hover:bg-red/90"
              >
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Both views are always mounted so collisions continue regardless of which is shown */}
        <div className={showingSimulation ? "block" : "hidden"}>
          <ClippedSVG
            id={`simulation-${idx}`}
            width={width}
            height={height}
            padding={0}
          >
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
        <div className={showingSimulation ? "hidden" : "block"}>
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
            barLabel={(bar) => Number(bar.key) + 1}
          />
        </div>
      </NarrowContainer>
    </Figure>
  );
};

export default EconomySimulation;
