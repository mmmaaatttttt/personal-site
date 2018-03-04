import React, { Component } from "react";
import PropTypes from "prop-types";
import { csv } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import SelectableHistogram from "../organisms/SelectableHistogram";
import SelectableHeatMap from "../organisms/SelectableHeatMap";
import SelectablePieChart from "../organisms/SelectablePieChart";
import { selectOptions, tooltipHelpers } from "../../data/four-weddings.js";

class FourWeddingsVisualization extends Component {
  state = {
    weddingData: []
  };

  componentDidMount() {
    csv(withPrefix("data/four_weddings.csv"), (row, i, columns) => ({
      season: +row["Season"],
      episode: +row["Episode"],
      title: row["Title"],
      date: new Date(row["Date"]),
      name: row["Name"],
      age: +row["Age"],
      spouseName: row["Spouse Name"],
      spouseAge: +row["Spouse Age"] || null,
      guests: +row["Guest Count"] || null,
      budget: +row["Budget"] || null,
      state: row["State"],
      scoresGiven: columns
        .filter(colName => /Contestant \d Experience/.test(colName))
        .map(colName => +row[colName])
        .filter(Boolean),
      scoresReceived: {
        dress: +row["Dress"],
        venue: +row["Venue"],
        food: +row["Food"],
        experience: +row["Experience"]
      },
      ranking: +row["Ranking"],
      expGivenRanking: +row["Experience Given Ranking"],
      expDiffRanking: +row["Experience Diff Ranking"],
      expReceivedRanking: +row["Overall Experience Ranking"],
      budgetRanking: +row["Budget Ranking"],
      budgetPerGuestRanking: +row["Budget Per Guest Ranking"] || null
    })).then(weddingData => this.setState({ weddingData }));
  }

  render() {
    const { weddingData } = this.state;
    const { caption, visType } = this.props;
    const components = {
      map: SelectableHeatMap,
      histogram: SelectableHistogram,
      pie: SelectablePieChart
    };
    if (weddingData.length) {
      const Component = components[visType];
      const props = {
        data: weddingData,
        caption,
        selectOptions: selectOptions[visType]
      };
      const tooltip = tooltipHelpers[visType];
      if (tooltip) {
        props.getTooltipTitle = tooltip.title;
        props.getTooltipBody = tooltip.body;
      }
      return <Component {...props} />;
    }
    return null;
  }
}

FourWeddingsVisualization.propTypes = {
  caption: PropTypes.string.isRequired,
  visType: PropTypes.oneOf(Object.keys(selectOptions))
};

export default FourWeddingsVisualization;
