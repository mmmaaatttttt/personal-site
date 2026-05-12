"use client";

import { type FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import StyledTable from "@/components/story/shared/StyledTable";
import {
  damerauLevenshteinDistance,
  hammingDistance,
  levenshteinDistance,
} from "./helpers";

interface StringDistanceExplorerProps {
  caption?: string;
}

const StringDistanceExplorer: FC<StringDistanceExplorerProps> = ({
  caption,
}) => {
  const [firstString, setFirstString] = useState("matehmatics");
  const [secondString, setSecondString] = useState("mathematics");

  let hammingDist: string;
  try {
    hammingDist = String(hammingDistance(firstString, secondString));
  } catch {
    hammingDist = "Strings must have the same length";
  }

  const tableData: string[][] = [
    ["Metric", "Distance"],
    ["Hamming distance", hammingDist],
    [
      "Levenshtein distance",
      String(levenshteinDistance(firstString, secondString)),
    ],
    [
      "Damerau-Levenshtein distance",
      String(damerauLevenshteinDistance(firstString, secondString)),
    ],
  ];

  return (
    <Caption caption={caption}>
      <NarrowContainer width="62%">
        <div className="flex flex-wrap items-start justify-around gap-6 text-center">
          <div className="flex flex-col items-center gap-1">
            <label htmlFor="first-string-input" className="text-sm font-medium">
              First Word
            </label>
            <input
              id="first-string-input"
              type="text"
              value={firstString}
              onChange={(e) => setFirstString(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <label
              htmlFor="second-string-input"
              className="text-sm font-medium"
            >
              Second Word
            </label>
            <input
              id="second-string-input"
              type="text"
              value={secondString}
              onChange={(e) => setSecondString(e.target.value)}
              className="rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-6">
          <StyledTable data={tableData} />
        </div>
      </NarrowContainer>
    </Caption>
  );
};

export default StringDistanceExplorer;
