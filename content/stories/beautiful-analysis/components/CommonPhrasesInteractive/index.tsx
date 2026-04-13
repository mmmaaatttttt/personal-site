"use client";

import SliderProvider from "@/components/story/shared/Slider";
import StyledTable from "@/components/story/shared/StyledTable";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import { colorMap } from "../../data/beautiful-analysis";
import baCommonPhrases from "../../data/ba-common-phrases.json";

type PhraseData = [string, number];

interface SpeakerData {
  Chris: PhraseData[];
  Caller: PhraseData[];
}

interface CommonPhraseEntry {
  phrase_count: number;
  speakers: SpeakerData;
}

export default function CommonPhrasesInteractive() {
  const dataset = baCommonPhrases.common_phrases as CommonPhraseEntry[];
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

          const headers = (Object.keys(speakers) as (keyof SpeakerData)[]).map(
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
            const rowKey = (Object.keys(speakers) as (keyof SpeakerData)[])
              .map((s) => speakers[s][i]?.[0] || "--")
              .join("-");

            return {
              key: rowKey,
              cells: (Object.keys(speakers) as (keyof SpeakerData)[]).map(
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
