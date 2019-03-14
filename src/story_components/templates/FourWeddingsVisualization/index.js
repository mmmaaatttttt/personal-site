import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import {
  selectOptions,
  tooltipHelpers,
  graphOptions
} from "data/four-weddings.js";
import {
  SelectableHeatMap,
  SelectableHistogram,
  SelectablePieChart,
  SelectableScatterplot
} from "story_components";

const PureFourWeddingsVis = ({ data, caption, visType }) => {
  const components = {
    map: SelectableHeatMap,
    histogram: SelectableHistogram,
    pie: SelectablePieChart,
    scatter: SelectableScatterplot
  };
  const Component = components[visType];
  const props = {
    data,
    caption,
    selectOptions: selectOptions[visType],
    graphOptions: graphOptions[visType]
  };
  const tooltip = tooltipHelpers[visType];
  if (tooltip) {
    props.getTooltipTitle = tooltip.title;
    props.getTooltipBody = tooltip.body;
  }
  return <Component {...props} />;
};

class FourWeddingsVisualization extends Component {
  cleanQuery = data => {
    return data.allFourWeddingsCsv.edges.map(({ node }) => ({
      season: +node["Season"],
      episode: +node["Episode"],
      title: node["Title"],
      date: new Date(node["Date"]),
      name: node["Name"],
      age: +node["Age"],
      spouseName: node["Spouse_Name"],
      spouseAge: +node["Spouse_Age"] || null,
      guests: +node["Guest_Count"] || null,
      budget: +node["Budget"] || null,
      description: node["Description"],
      state: node["State"],
      scoresGiven: [1, 2, 3, 4]
        .map(num => `Contestant_${num}_Experience`)
        .map(colName => +node[colName])
        .filter(Boolean),
      scoresReceived: {
        dress: +node["Dress"],
        venue: +node["Venue"],
        food: +node["Food"],
        experience: +node["Experience"]
      },
      ranking: +node["Ranking"],
      expGivenRanking: +node["Experience_Given_Ranking"],
      expDiffRanking: +node["Experience_Diff_Ranking"],
      expReceivedRanking: +node["Overall_Experience_Ranking"],
      budgetRanking: +node["Budget_Ranking"],
      budgetPerGuestRanking: +node["Budget_Per_Guest_Ranking"] || null
    }));
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <PureFourWeddingsVis data={this.cleanQuery(data)} {...this.props} />
        )}
      />
    );
  }
}

FourWeddingsVisualization.propTypes = {
  caption: PropTypes.string.isRequired,
  visType: PropTypes.oneOf(Object.keys(selectOptions))
};

FourWeddingsVisualization.defaultProps = {
  caption: "Sample Caption"
};

const query = graphql`
  query FourWeddingsQuery {
    allFourWeddingsCsv {
      edges {
        node {
          Season
          Episode
          Title
          Date
          Name
          Age
          Spouse_Name
          Spouse_Age
          Guest_Count
          Budget
          Description
          State
          Contestant_1_Experience
          Contestant_2_Experience
          Contestant_3_Experience
          Contestant_4_Experience
          Dress
          Venue
          Food
          Experience
          Ranking
          Experience_Given_Ranking
          Experience_Diff_Ranking
          Overall_Experience_Ranking
          Budget_Ranking
          Budget_Per_Guest_Ranking
        }
      }
    }
  }
`;

export default FourWeddingsVisualization;

export { PureFourWeddingsVis };
