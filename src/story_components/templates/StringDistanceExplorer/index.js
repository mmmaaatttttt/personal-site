import React, { useState } from "react";
import {
  FlexContainer,
  NarrowContainer,
  StyledInput,
  StyledTable
} from "story_components";
import { withCaption } from "providers";
import {
  hammingDistance,
  levenshteinDistance,
  damerauLevenshteinDistance
} from "./helpers";

function StringDistanceExplorer() {
  const [firstString, setFirstString] = useState("matehmatics");
  const [secondString, setSecondString] = useState("mathematics");
  let distances = {
    "Hamming distance": "Strings must have the same length",
    "Levenshtein Distance": levenshteinDistance(firstString, secondString),
    "Damerau-Levenshtein Distance": damerauLevenshteinDistance(
      firstString,
      secondString
    )
  };
  try {
    distances["Hamming distance"] = hammingDistance(firstString, secondString);
  } catch (e) {}
  return (
    <NarrowContainer width="80%">
      <FlexContainer main="space-around" textAlign="center">
        <div>
          <label htmlFor="first-input">First Word:</label>
          <StyledInput
            type="text"
            id="first-input"
            value={firstString}
            onChange={e => setFirstString(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="second-input">Second Word:</label>
          <StyledInput
            type="text"
            id="second-input"
            value={secondString}
            onChange={e => setSecondString(e.target.value)}
          />
        </div>
      </FlexContainer>
      <StyledTable>
        <tbody>
          {Object.keys(distances).map(metric => (
            <tr key={metric}>
              <td>{metric}</td>
              <td>{distances[metric]}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </NarrowContainer>
  );
}

export default withCaption(React.memo(StringDistanceExplorer));
