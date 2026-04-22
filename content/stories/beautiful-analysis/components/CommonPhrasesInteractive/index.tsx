"use client";

import SliderProvider from "@/components/story/shared/Slider";
import StyledTable from "@/components/story/shared/StyledTable";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import { colorMap } from "../../data/beautiful-analysis";
import baCommonPhrases, { type CommonPhraseEntry, type SpeakerPhrases } from "../../data/ba-common-phrases";

export default function CommonPhrasesInteractive() {
  const dataset: CommonPhraseEntry[] = baCommonPhrases.common_phrases;
  const initialData = [
    {
      min: dataset[0].phrase_count,
      max: dataset[dataset.length - 1].phrase_count,
      initialValue: dataset[0].phrase_count,
      step: 1,
      tickCount: 3,
      title: (val: number) => `${val}-word phrases`,
      color: colorMap.Caller,
    },
  ];

  return (
    <div
      className="my-12 w-full"
      data-testid="common-phrases-interactive-container"
    >
      <SliderProvider
        initialData={initialData}
        render={([phraseCount]) => {
          const entry = dataset.find((d) => d.phrase_count === phraseCount);
          if (!entry) return null;

          const { speakers } = entry;
          const numRows = Math.max(
            speakers.Chris.length,
            speakers.Caller.length,
          );

          const headers = (Object.keys(speakers) as (keyof SpeakerPhrases)[]).map(
            (speaker) => ({
              key: `header-${speaker}`,
              content: (
                <ColoredSpan
                  bold
                  color={colorMap[speaker as keyof typeof colorMap]}
                >
                  {speaker}
                </ColoredSpan>
              ),
            }),
          );

          const rows = Array.from({ length: numRows }, (_, i) => {
            const rowKey = (Object.keys(speakers) as (keyof SpeakerPhrases)[])
              .map((s) => speakers[s][i]?.[0] || "--")
              .join("-");

            return {
              key: rowKey,
              cells: (Object.keys(speakers) as (keyof SpeakerPhrases)[]).map(
                (speaker) => {
                  const speakerPhrases = speakers[speaker][i];
                  return {
                    key: `cell-${speaker}`,
                    content: (
                      <ColoredSpan
                        color={colorMap[speaker as keyof typeof colorMap]}
                      >
                        {speakerPhrases
                          ? `${speakerPhrases[0]} (said ${speakerPhrases[1]} times)`
                          : "--"}
                      </ColoredSpan>
                    ),
                  };
                },
              ),
            };
          });

          return (
            <StyledTable
              padding="0.5rem 0.1rem"
              headers={headers}
              rows={rows}
            />
          );
        }}
      />
    </div>
  );
}
