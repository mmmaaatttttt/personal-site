import React from "react";
import PropTypes from "prop-types";
import { stack } from "d3";
import { withCaption } from "providers";
import { Legend, MultiBarGraph, NarrowContainer } from "story_components";
import COLORS from "utils/styles";
import { generateTooltipData } from "./helpers";


function PodcastWordCounts({ data, speakers }) {
  const speakerColors = [COLORS.DARK_BLUE, COLORS.ORANGE];
  const barData = stack().keys(speakers)(data.map(d => d.wordCounts));
  return (
    <NarrowContainer width="60%">
      <Legend
        title="Word counts per episode"
        labels={speakers.map((sp, i) => ({
          text: sp,
          color: speakerColors[i]
        }))}
      />
      <MultiBarGraph
        barData={barData}
        colors={speakerColors}
        padding={{ top: 0, left: 70, right: 0, bottom: 10 }}
        tooltipData={data.map(generateTooltipData)}
      />
    </NarrowContainer>
  );
}

PodcastWordCounts.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      wordCounts: PropTypes.shape({
        Chris: PropTypes.number.isRequired,
        Caller: PropTypes.number.isRequired
      })
    })
  ).isRequired,
  speakers: PropTypes.arrayOf(PropTypes.string).isRequired
};

PodcastWordCounts.defaultProps = {
  data: [
    {
      id: 1,
      title: "Episode",
      date: "8/10/2019",
      wordCounts: [
        {
          Chris: 0,
          Caller: 0
        }
      ]
    }
  ],
  speakers: ["Chris", "Caller"]
};

export default withCaption(PodcastWordCounts);
