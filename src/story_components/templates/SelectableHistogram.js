import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { csv } from "d3-fetch";
import { histogram, max, range, extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { withPrefix } from "gatsby-link";
import withCaption from "../../hocs/withCaption";
import BarGraph from "../organisms/BarGraph";
import COLORS from "../../utils/styles";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import "react-select/dist/react-select.css";

class SelectableHistogram extends Component {
  state = {
    selectedOption: this.props.selectOptions[0],
    data: []
  };

  handleChange = selectedOption => this.setState({ selectedOption });

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
    const { data } = this.state;
    const { value, label, accessor, step, format } = this.state.selectedOption;
    const { selectOptions } = this.props;
    let barGraph = null;
    if (data.length) {
      const validData = data.filter(d => accessor(d) !== null);
      const vals = extent(validData, accessor);
      const thresholds = range(Math.min(vals[0], 0), vals[1] + 2 * step, step);
      const histogramData = histogram()
        .value(accessor)
        .thresholds(thresholds)(validData);
      const lastIdx = histogramData.length - 1;
      const barWidth = histogramData[1].x1 - histogramData[1].x0;
      histogramData[0].x0 = histogramData[0].x1 - barWidth;
      histogramData[lastIdx].x1 = histogramData[lastIdx].x0 + barWidth;
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
          tickFormat={format}
          color={COLORS.ORANGE}
          timing={{ duration: 500, delay: 25 }}
        />
      );
    }
    return (
      <StyledNarrowContainer width="50%">
        <Select
          name="bar-data"
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />
        {barGraph}
      </StyledNarrowContainer>
    );
  }
}

SelectableHistogram.defaultProps = {
  selectOptions: [
    {
      value: "cost",
      label: "Wedding Cost",
      accessor: d => d.cost,
      step: 10000,
      format: "$.2s"
    },
    {
      value: "guests",
      label: "Guest Count",
      accessor: d => d.guests,
      step: 50,
      format: ".0f"
    },
    {
      value: "costPerGuest",
      label: "Wedding Cost Per Guest",
      accessor: d => (d.guests ? d.cost / d.guests : null),
      step: 100,
      format: "$.0f"
    },
    {
      value: "age",
      label: "Bride Age",
      accessor: d => d.age,
      step: 2,
      format: ".0f"
    },
    {
      value: "ageGap",
      label: "Age Gap (Spouse Age - Bride Age)",
      accessor: d => (d.spouseAge ? d.spouseAge - d.age : null),
      step: 2,
      format: ".0f"
    }
  ]
};

export default withCaption(SelectableHistogram);
