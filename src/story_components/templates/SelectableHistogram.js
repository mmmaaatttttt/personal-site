import React, { Component } from "react";
import PropTypes from "prop-types";
import { csv } from "d3-fetch";
import { histogram, max, range, extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { withPrefix } from "gatsby-link";
import withCaption from "../../hocs/withCaption";
import BarGraph from "../organisms/BarGraph";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";

class SelectableHistogram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    csv(withPrefix("/data/four_weddings.csv"), (row, i, columns) => ({
      season: +row["Season"],
      episode: +row["Episode"],
      title: row["Title"],
      date: new Date(row["Date"]),
      name: row["Name"],
      age: +row["Age"],
      spouseName: row["Spouse Name"],
      spouseAge: +row["Spouse Age"] || null,
      guests: +row["Guest Count"] || null,
      cost: +row["Budget"] || null,
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
      }
    })).then(data => {
      this.setState({ data });
    });
  }

  render() {
    let barGraph = null;
    if (this.state.data.length) {
      const maxCost = max(this.state.data, d => d.cost);
      const thresholds = range(0, maxCost + 20000, 10000);
      const histogramData = histogram()
        .value(d => d.cost)
        .thresholds(thresholds)(this.state.data);
      histogramData[0].x0 = thresholds[0];
      histogramData[histogramData.length - 1].x1 =
        thresholds[thresholds.length - 1];
      const width = 600;
      const height = 600;
      const padding = 0;
      const tickStep = 10;
      const barData = histogramData.map((d, i) => ({
        key: i,
        height: d.length,
        x0: d.x0,
        x1: d.x1
      }));
      const yScale = scaleLinear()
        .domain([0, max(histogramData, d => d.length) * 1.1])
        .range([height - padding, padding]);
      barGraph = (
        <BarGraph
          svgId="histogram"
          width={width}
          height={height}
          padding={padding}
          yScale={yScale}
          barData={barData}
          tickStep={tickStep}
          barLabel={bar => bar.height}
          histogram
          thresholds={thresholds}
        />
      );
    }
    return (
      <StyledNarrowContainer width="50%">
        <h1>hi</h1>
        {barGraph}
      </StyledNarrowContainer>
    );
  }
}

SelectableHistogram.propTypes = {};

SelectableHistogram.defaultProps = {};

export default withCaption(SelectableHistogram);
