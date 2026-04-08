"use client";

import React from "react";
import SliderProvider from "@/components/story/shared/SliderProvider";
import StyledTable from "@/components/story/shared/StyledTable";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import { colorMap } from "../data/beautiful-analysis";
import baCommonPhrases from "../data/ba-common-phrases.json";

export default function CommonPhrasesInteractive() {
  const initialData = [
    {
      min: baCommonPhrases.common_phrases[0].phrase_count,
      max: baCommonPhrases.common_phrases[2].phrase_count,
      initialValue: baCommonPhrases.common_phrases[0].phrase_count,
      step: 1,
      tickCount: 3,
      title: (val: number) => `${val}-word phrases`,
      color: "#000000"
    }
  ];

  return (
    <SliderProvider
      initialData={initialData}
      render={([phraseCount]) => {
        const index = phraseCount - 2;
        if (index < 0 || index >= baCommonPhrases.common_phrases.length) return null;
        const { speakers } = baCommonPhrases.common_phrases[index];
        const numRows = Math.max(speakers["Chris"].length, speakers["Caller"].length);
        const rows = Array.from({ length: numRows }, (_, i) => [
          speakers["Chris"][i],
          speakers["Caller"][i],
        ]);
        
        return (
          <StyledTable padding="0.1rem">
            <thead>
              <tr>
                {Object.keys(speakers).map((speaker) => (
                  <th key={speaker}>
                    <ColoredSpan bold color={(colorMap as any)[speaker]}>
                      {speaker}
                    </ColoredSpan>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${phraseCount}-${i}`}>
                  {Object.keys(speakers).map((speaker, idx) => (
                    <td key={speaker}>
                      <ColoredSpan color={(colorMap as any)[speaker]}>
                        {row[idx] ? `${row[idx][0]} (said ${row[idx][1]} times)` : "--"}
                      </ColoredSpan>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        );
      }}
    />
  );
}
