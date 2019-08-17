import React from "react";
import PropTypes from "prop-types";
import { SelectProvider, withCaption } from "providers";
import { selectType } from "utils/types";
import { NarrowContainer, StyledTable } from "story_components";

function SentimentScoreTable({ options, sentences, sentimentRanges }) {
  return (
    <SelectProvider
      options={options}
      initialIndex={Math.floor(options[0].length / 2)}
      margin="0.5rem 0"
      render={([{ value }]) => {
        const [min, max] = sentimentRanges[value];
        return (
          <NarrowContainer
            width="125%"
            margin="0 0 0 -12.5%"
            fullWidthAt="small"
          >
            <StyledTable padding="0.25rem">
              <thead>
                <tr>
                  <th>Chris Gethard Quote</th>
                  <th>Sentiment Score</th>
                </tr>
              </thead>
              <tbody>
                {sentences
                  .filter(sent => sent.score > min && sent.score < max)
                  .map(sent => (
                    <tr key={sent.sentence}>
                      <td>
                        <em>{sent.sentence}</em>
                      </td>
                      <td>{sent.score}</td>
                    </tr>
                  ))}
              </tbody>
            </StyledTable>
          </NarrowContainer>
        );
      }}
    />
  );
}

SentimentScoreTable.propTypes = {
  options: selectType,
  sentences: PropTypes.arrayOf(
    PropTypes.shape({
      sentence: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired
    })
  ).isRequired,
  sentimentRanges: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired
};

SentimentScoreTable.defaultProps = {
  options: [[{ value: 0, label: "label" }]],
  sentences: [],
  sentimentRanges: [
    [-1, -0.5],
    [-0.5, -0.05],
    [-0.05, 0.05],
    [0.05, 0.5],
    [0.5, 1]
  ]
};

export default withCaption(SentimentScoreTable);
