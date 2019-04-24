import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { scaleOrdinal } from "d3-scale";
import { withCaption, SelectProvider, SliderProvider } from "providers";
import { Legend, NarrowContainer, PieChart } from "story_components";
import COLORS from "utils/styles";
import { selectType, sliderType } from "utils/types";

class PureVotingPollWorkerAge extends Component {
  render() {
    const {
      data,
      selectOptions,
      sliderData,
      keyLabels,
      colorScale
    } = this.props;
    return (
      <SliderProvider
        initialData={sliderData}
        fullWidthAt="medium"
        width="60%"
        render={([curYear]) => (
          <SelectProvider
            width="100%"
            options={selectOptions}
            initialIndex={2}
            margin="0.75rem 0"
            render={([currentOption]) => {
              const { ages, year, state } = data.find(
                d => d.year === curYear && d.state === currentOption.label
              );
              return ages.some(age => age > 0) ? (
                <React.Fragment>
                  <Legend
                    title="Poll worker ages (years)"
                    labels={colorScale
                      .range()
                      .map((color, i) => ({ color, text: keyLabels[i] }))}
                  />
                  <NarrowContainer width="70%" fullWidthAt="medium">
                    <PieChart colorScale={colorScale} values={ages} textFill={COLORS.BLACK} />
                  </NarrowContainer>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h4>
                    No data available for {state} in {year}.
                  </h4>
                  <p>Please make another selection.</p>
                </React.Fragment>
              );
            }}
          />
        )}
      />
    );
  }
}

class VotingPollWorkerAge extends Component {
  cleanQuery = data => {
    return data.allVotingData20082016Csv.edges.map(({ node }) => ({
      year: +node.year,
      state: node.state,
      num_jurisdictions: +node.num_jurisdictions,
      jurisdictions_with_age_info: +node.jurisdictions_with_age_info,
      poll_workers: +node.poll_workers,
      ages: [
        +node.worker_age_group_1,
        +node.worker_age_group_2,
        +node.worker_age_group_3,
        +node.worker_age_group_4,
        +node.worker_age_group_5,
        +node.worker_age_group_6
      ]
    }));
  };

  getStateOptions = data => {
    const statesSet = new Set(
      data.allVotingData20082016Csv.edges.map(({ node }) => node.state)
    );
    const options = Array.from(statesSet, (s, idx) => ({
      label: s,
      value: idx
    }));
    return options;
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <PureVotingPollWorkerAge
            data={this.cleanQuery(data)}
            selectOptions={[this.getStateOptions(data)]}
          />
        )}
      />
    );
  }
}

PureVotingPollWorkerAge.propTypes = {
  colorScale: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  sliderData: sliderType,
  selectOptions: selectType
};

const MIN_YEAR = 2010;
const MAX_YEAR = 2016;
const STEP = 2;

PureVotingPollWorkerAge.defaultProps = {
  colorScale: scaleOrdinal().range([
    COLORS.RED,
    COLORS.ORANGE,
    COLORS.YELLOW,
    COLORS.GREEN,
    COLORS.BLUE,
    COLORS.PURPLE
  ]),
  data: [],
  keyLabels: ["<18", "18-25", "26-40", "41-60", "61-70", ">70"],
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
  ],
  selectOptions: []
};

const query = graphql`
  query {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          num_jurisdictions
          jurisdictions_with_age_info
          poll_workers
          worker_age_group_1
          worker_age_group_2
          worker_age_group_3
          worker_age_group_4
          worker_age_group_5
          worker_age_group_6
        }
      }
    }
  }
`;

export default withCaption(VotingPollWorkerAge);

export { PureVotingPollWorkerAge };
