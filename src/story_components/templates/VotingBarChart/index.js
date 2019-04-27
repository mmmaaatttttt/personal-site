import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import { BarGraph, NarrowContainer } from "story_components";
import { SliderProvider, SelectProvider, withCaption } from "providers";
import { sliderType, selectType } from "utils/types";
import COLORS from "utils/styles";

class PureVotingBarChart extends Component {
  render() {
    const { sliderData, selectData, data } = this.props;
    return (
      <SliderProvider
        initialData={sliderData}
        fullWidthAt="medium"
        render={([curYear]) => (
          <SelectProvider
            width="100%"
            options={selectData}
            render={([currentOption]) => {
              const { colorAccessor, colorRange, colorDomain } = this.props;
              const { accessor, colors, format } = currentOption;
              const width = 900;
              const height = 400;
              const padding = { top: 0, right: 0, bottom: 6, left: 40 };
              let colorScale = null;
              if (colorRange) {
                colorScale = scaleLinear()
                  .domain(colorDomain || extent(data, colorAccessor))
                  .range(colorRange);
              }
              const allYearData = data.map(d => ({
                color: colorScale ? colorScale(colorAccessor(d)) : colors[0], // wtf not working.
                height: accessor(d),
                key: d.abbreviation,
                year: d.year
              }));
              const yScale = scaleLinear()
                .domain([0, 1.1 * max(allYearData, d => d.height)])
                .range([height - padding.bottom, padding.top]);
              const barData = allYearData
                .filter(d => d.year === curYear && d.height)
                .sort((d1, d2) => d1.height - d2.height);
              return (
                <NarrowContainer
                  width="130%"
                  fullWidthAt="medium"
                  margin="0 0 0 -15%"
                >
                  <BarGraph
                    barData={barData}
                    barLabel={d => d.key}
                    height={height}
                    padding={padding}
                    // tickStep={0.1}
                    svgId={"bar-graph"}
                    width={width}
                    yScale={yScale}
                    yTickLabelPosition="left"
                    yTickFormat={format}
                  />
                </NarrowContainer>
              );
            }}
          />
        )}
      />
    );
  }
}

class VotingBarChart extends Component {
  render() {
    const {
      dataCleaner,
      selectData,
      colorRange,
      colorAccessor,
      colorDomain
    } = this.props;
    return (
      <StaticQuery
        query={query}
        render={data => {
          return (
            <PureVotingBarChart
              data={dataCleaner(data)}
              selectData={selectData}
              colorAccessor={colorAccessor}
              colorRange={colorRange}
              colorDomain={colorDomain}
            />
          );
        }}
      />
    );
  }
}

const query = graphql`
  query {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          abbreviation
          num_jurisdictions
          active_registration
          election_participants
          eligible_voters_estimated
          jurisdictions_with_polling_place_info
          jurisdictions_with_poll_worker_count
          jurisdictions_with_age_info
          jurisdictions_with_difficulty_info
          registrants_in_jurisdictions_with_polling_place_info
          registrants_in_jurisdictions_with_poll_worker_info
          registrants_in_jurisdictions_with_poll_worker_age_info
          registrants_in_jurisdictions_with_difficulty_info
          participants_in_jurisdictions_with_polling_place_info
          participants_in_jurisdictions_with_poll_worker_info
          participants_in_jurisdictions_with_poll_worker_age_info
          participants_in_jurisdictions_with_difficulty_info
          polling_places
          poll_workers
          worker_age_group_1
          worker_age_group_2
          worker_age_group_3
          worker_age_group_4
          worker_age_group_5
          worker_age_group_6
          difficulty_very_difficult
          difficulty_somewhat_difficult
          difficulty_somewhat_easy
          difficulty_neither_difficult_nor_easy
          difficulty_not_enough_information_to_answer
          difficulty_very_easy
          dem_percent
          rep_percent
        }
      }
    }
  }
`;

PureVotingBarChart.propTypes = {
  colorAccessor: PropTypes.func,
  colorRange: PropTypes.arrayOf(PropTypes.string),
  colorRange: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectData: selectType,
  sliderData: sliderType
};

const MIN_YEAR = 2008;
const MAX_YEAR = 2016;
const STEP = 2;

PureVotingBarChart.defaultProps = {
  data: [],
  selectData: [],
  sliderData: [
    {
      min: MIN_YEAR,
      max: MAX_YEAR,
      step: STEP,
      initialValue: MIN_YEAR,
      color: COLORS.DARK_GRAY,
      tickCount: Math.round((MAX_YEAR - MIN_YEAR) / STEP) + 1,
      title: year => `Year: ${year}`
    }
  ]
};

export default withCaption(VotingBarChart);
