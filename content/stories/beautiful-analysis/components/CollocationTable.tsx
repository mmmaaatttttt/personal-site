"use client";

import React from "react";
import ColoredSpan from "@/components/story/shared/ColoredSpan";
import StyledTable from "@/components/story/shared/StyledTable";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import baCommonPhrases from "../data/ba-common-phrases.json";
import { colorMap } from "../data/beautiful-analysis";

const CollocationTable = () => {
  return (
    <NarrowContainer width="70%" fullWidthAt="sm">
      <StyledTable padding="0.1rem">
        <thead>
          <tr>
            {baCommonPhrases.collocation_lists.map(({ speaker }) => (
              <th key={speaker}>
                <ColoredSpan bold color={(colorMap as any)[speaker]}>
                  {speaker}
                </ColoredSpan>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {baCommonPhrases.collocation_lists[0].collocations.map(
            (phrase, idx) => (
              <tr key={idx}>
                <td>
                  <ColoredSpan color={(colorMap as any)["Chris"]}>{phrase}</ColoredSpan>
                </td>
                <td>
                  <ColoredSpan color={(colorMap as any)["Caller"]}>
                    {baCommonPhrases.collocation_lists[1].collocations[idx]}
                  </ColoredSpan>
                </td>
              </tr>
            )
          )}
        </tbody>
      </StyledTable>
    </NarrowContainer>
  );
};

export default CollocationTable;
