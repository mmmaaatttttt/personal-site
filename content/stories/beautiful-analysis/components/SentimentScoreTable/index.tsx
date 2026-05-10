"use client";

import type { FC } from "react";
import { useMemo, useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import StyledTable from "@/components/story/shared/StyledTable";
import baSentimentData from "../../data/ba-sentiment-examples";
import { defaultSentimentOptions } from "../../data/beautiful-analysis";

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

const SentimentScoreTable: FC<SentimentScoreTableProps> = ({
  sentimentRanges = defaultSentimentRanges,
  caption,
}) => {
  const options = defaultSentimentOptions;
  const [selectedOption, setSelectedOption] = useState(
    options?.[0]
      ? options[0][Math.floor(options[0].length / 2)]
      : { value: "0", label: "Loading" },
  );

  const { value, label } = selectedOption;

  const rangeIdx = parseInt(value, 10);
  const [min, max] = sentimentRanges[rangeIdx] || [-1, 1];

  const filteredData = useMemo(() => {
    return baSentimentData.filter(
      (sent) => sent.score > min && sent.score < max,
    );
  }, [min, max]);

  if (!options || options.length === 0) return null;

  const headers = [
    {
      key: "quote-header",
      content: <div className="text-left px-2">Chris Gethard Quote</div>,
    },
    { key: "score-header", content: <div className="text-center">Score</div> },
  ];

  const rows = filteredData.map((sent) => ({
    key: sent.sentence,
    cells: [
      {
        key: "quote-cell",
        content: (
          <div className="text-left italic leading-relaxed px-2">
            "{sent.sentence}"
          </div>
        ),
      },
      {
        key: "score-cell",
        content: (
          <div className="text-center font-mono opacity-80">
            {sent.score.toFixed(4)}
          </div>
        ),
      },
    ],
  }));

  return (
    <div className="w-full" data-testid="sentiment-score-table-container">
      <NarrowContainer width="100%" margin="0 auto 0.5rem">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Sentiment Filter
          </span>
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
        <StyledTable padding="0.75rem 0.5rem" headers={headers} rows={rows} />
      </NarrowContainer>
      {caption && (
        <p className="mt-4 text-center text-sm font-bold text-gray-600">
          {caption}
        </p>
      )}
    </div>
  );
};

export default SentimentScoreTable;
