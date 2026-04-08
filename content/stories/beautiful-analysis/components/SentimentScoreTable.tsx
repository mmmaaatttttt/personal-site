"use client";

import React, { useState } from "react";
import Select from "@/components/story/shared/Select";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import StyledTable from "@/components/story/shared/StyledTable";
import Caption from "@/components/story/shared/Caption";
import { defaultSentimentOptions } from "../data/beautiful-analysis";
import baSentimentData from "../data/ba-sentiment-examples.json";

interface SentimentScoreTableProps {
  sentimentRanges?: [number, number][];
  caption?: string;
}

const defaultSentimentRanges: [number, number][] = [
  [-1, -0.5],
  [-0.5, -0.05],
  [-0.05, 0.05],
  [0.05, 0.5],
  [0.5, 1],
];

const SentimentScoreTable: React.FC<SentimentScoreTableProps> = ({
  sentimentRanges = defaultSentimentRanges,
  caption,
}) => {
  const options = defaultSentimentOptions;
  const [selectedOption, setSelectedOption] = useState(
    options && options[0] ? options[0][Math.floor(options[0].length / 2)] : { value: "0", label: "Loading" }
  );
  if (!options || options.length === 0) return null;
  const { value, label } = selectedOption;
  const [min, max] = sentimentRanges[parseInt(value, 10)];

  return (
    <div className="w-full my-12">
      <NarrowContainer width="100%" className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sentiment Filter</span>
          <Select
            name="sentiment-filter"
            value={value}
            placeholder={label}
            onChange={setSelectedOption}
            options={options[0]}
            className="flex-1 max-w-md"
          />
        </div>
      </NarrowContainer>

      <NarrowContainer width="100%" className="w-full">
        <StyledTable padding="0.5rem">
          <thead>
            <tr className="border-b-[3px] border-black">
              <th className="font-bold text-left w-3/4">Chris Gethard Quote</th>
              <th className="font-bold text-center w-1/4">Sentiment Score</th>
            </tr>
          </thead>
          <tbody>
            {baSentimentData
              .filter((sent) => sent.score > min && sent.score < max)
              .map((sent) => (
                <tr key={sent.sentence} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="text-left leading-relaxed">
                    <em>"{sent.sentence}"</em>
                  </td>
                  <td className="text-center font-mono opacity-80">{sent.score.toFixed(4)}</td>
                </tr>
              ))}
          </tbody>
        </StyledTable>
      </NarrowContainer>
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
};

export default SentimentScoreTable;
