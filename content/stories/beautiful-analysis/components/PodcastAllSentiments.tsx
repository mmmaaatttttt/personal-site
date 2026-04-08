"use client";

import React, { useState, useMemo } from "react";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import Caption from "@/components/story/shared/Caption";
import { colorMap } from "../data/beautiful-analysis";
import baAllSentiment from "../data/ba-all-sentiment.json";

interface PodcastAllSentimentsProps {
  height?: number;
  padding?: any;
  svgId?: string;
  width?: number;
  caption?: string;
}

const PodcastAllSentiments: React.FC<PodcastAllSentimentsProps> = ({
  height = 400,
  padding = { top: 10, left: 50, right: 20, bottom: 10 },
  svgId = "all-sentiments",
  width = 800,
  caption,
}) => {
  const options = baAllSentiment.map((ep, i) => ({
    value: i.toString(),
    label: `Episode ${ep.id}: ${ep.title}`,
  }));
  const [selectedOption, setSelectedOption] = useState(options[0] || { value: "0", label: "Loading" });
  if (!baAllSentiment || baAllSentiment.length === 0 || options.length === 0) return null;
  const { value, label } = selectedOption;

  const yScale = scaleLinear().domain([-1, 1]).range([height - padding.bottom, padding.top]);
  const xScale = scaleLinear().range([padding.left, width - padding.right]);

  const circData = useMemo(() => {
    const raw = (baAllSentiment[parseInt(value, 10)] as any).sentiment_counts
      .filter((d: any[]) => d[0] in colorMap) // remove lines from third parties
      .map(([speaker, sentiment, wc]: any[], i: number) => ({
        key: `circ-${i}-${speaker}`,
        x: i,
        y: sentiment,
        r: Math.pow(wc, 0.5),
        fill: (colorMap as Record<string, string>)[speaker],
      }));
    return raw;
  }, [value]);

  xScale.domain([0, circData.length]);

  return (
    <div className="w-full my-12">
      <NarrowContainer width="100%" className="mb-4">
        <Select
          name="episode-select"
          value={value}
          placeholder={label}
          onChange={setSelectedOption}
          options={options}
          className="w-full max-w-md mx-auto"
        />
      </NarrowContainer>

      <NarrowContainer width="100%" className="w-full">
        <Legend
          title="Sentiment Changes During Episode"
          labels={Object.keys(colorMap).map((text) => ({
            text,
            color: (colorMap as Record<string, string>)[text],
          }))}
        />
        <div className="w-full relative overflow-hidden -mx-6 sm:mx-0">
          <Graph
            graphPadding={padding}
            height={height}
            svgId={svgId}
            svgPadding={0}
            tickFormatY=".1f"
            width={width}
            xScale={xScale}
            xAxisPosition="center"
            yLabel="Sentiment"
            yScale={yScale}
          >
            <g>
              <AnimatePresence>
                {circData.map((d: any) => (
                  <motion.circle
                    key={d.key}
                    initial={{ r: 0, cx: xScale(d.x), cy: yScale(d.y) }}
                    animate={{ r: d.r, cx: xScale(d.x), cy: yScale(d.y) }}
                    exit={{ r: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                      delay: d.x * 0.003,
                      duration: 0.6
                    }}
                    fill={d.fill}
                    opacity={0.7}
                  />
                ))}
              </AnimatePresence>
              <line
                x1={xScale(0)}
                x2={xScale(circData.length)}
                y1={yScale(0)}
                y2={yScale(0)}
                strokeWidth={2}
                stroke="#1a1a1a"
                className="opacity-50"
              />
            </g>
          </Graph>
        </div>
      </NarrowContainer>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
};

export default PodcastAllSentiments;
