import React, { Component } from "react";
import PropTypes from "prop-types";
import { min, max } from "d3-array";
import { nest } from "d3-collection";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { lighten } from "polished";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import { calculateWastedVotes } from "utils/mathHelpers";
import { BarGraph, ColumnLayout, SliderGroup, USMap } from "story_components";

class GerrymanderHistoricalMap extends Component {
  state = {
    allBarData: [],
    data: [],
    minYear: null,
    maxYear: null,
    currentYear: null,
    currentMinElectors: 2
  };

  componentDidMount() {
    let dataUrl =
      "https://gist.githubusercontent.com/mmmaaatttttt/667f43a79aa2f0b280e2a99a1b807a00/raw/5aa105890d32afe83517bbd2dc46303b00e9bc4b/congressional_election_results_1996_2016.csv";
    csv(dataUrl, (row, i, columns) => {
      if (row.District === "Senate" || row.District === "President") return;
      let rowObj = { demEst: false, repEst: false };
      if (/\*/.test(row.Democrat)) rowObj.demEst = true;
      if (/\*/.test(row.Republican)) rowObj.repEst = true;
      return {
        ...rowObj,
        year: +row.Year,
        state: row.State,
        district: +row.District,
        dem: +row.Democrat.replace("*", ""),
        rep: +row.Republican.replace("*", "")
      };
    }).then(data => {
      let minYear = min(data, d => d.year);
      let maxYear = max(data, d => d.year);
      this.setState({
        data,
        minYear,
        maxYear,
        currentYear: maxYear
      });
    });
  }

  addGeometryProperties = (us, data) => {
    let years = new Set(data.map(d => d.year));
    nest()
      .key(d => d.state)
      .entries(data)
      .forEach(stateObj => {
        const stateGeometry = us.objects.states.geometries.find(
          geometry => geometry.properties.name === stateObj.key
        );
        stateGeometry.properties.values = stateObj.values;
        stateGeometry.properties.efficiencyGaps = {};
        for (let year of years) {
          let eg = this.calculateNormalizedEg(
            stateObj.values.filter(val => val.year === year)
          );
          stateGeometry.properties.efficiencyGaps[year] = eg;
        }
      });
    let allBarData = us.objects.states.geometries
      .filter(g => g.properties.values)
      .map(g => {
        let { efficiencyGaps, name, code: label, values } = g.properties;
        let seatGaps = {};
        for (let year in efficiencyGaps) {
          let districtCount = values.filter(d => d.year === +year).length;
          seatGaps[year] = efficiencyGaps[year] * districtCount;
        }
        return { seatGaps, label, name };
      });
    this.setState({ allBarData });
  };

  calculateNormalizedEg = values => {
    let repAccessor = d => d.rep;
    let demAccessor = d => d.dem;
    let wastedVotes = calculateWastedVotes(values, repAccessor, demAccessor);
    return (
      wastedVotes.reduce((acc, wv, i) => {
        let totalVotes = repAccessor(values[i]) + demAccessor(values[i]);
        let egPercentForDistrict = (wv[1] - wv[0]) / totalVotes;
        return acc + egPercentForDistrict;
      }, 0) / wastedVotes.length
    );
  };

  fillAccessor = d => {
    let { currentYear, currentMinElectors } = this.state;
    let relevantData = d.values.filter(val => val.year === currentYear);
    if (relevantData.length < currentMinElectors) return null;
    return d.efficiencyGaps[currentYear];
  };

  getTooltipBody = d => {
    let { currentYear, currentMinElectors } = this.state;
    let districtsForYear = d.values
      ? d.values.filter(val => val.year === currentYear).length
      : 1;
    if (districtsForYear < currentMinElectors) return "Not enough districts.";
    let gap = d.efficiencyGaps[currentYear];
    let favoredParty = gap < 0 ? "Democrats" : "Republicans";
    let formattedGap = Math.abs(gap * 100);
    return [
      `${formattedGap.toFixed(2)}% efficiency gap in favor of ${favoredParty}.`,
      `${districtsForYear} districts total.`,
      `${((formattedGap * districtsForYear) / 100).toFixed(2)} seat gap.`
    ];
  };

  handleSliderUpdate = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const {
      allBarData,
      data,
      minYear,
      maxYear,
      currentYear,
      currentMinElectors
    } = this.state;
    const { minElectors, maxElectors } = this.props;
    if (data.length === 0)
      return (
        <div>
          <h1>Loading, please wait...</h1>
        </div>
      );
    let sliderData = [
      {
        title: `Year: ${currentYear}`,
        min: minYear,
        max: maxYear,
        value: currentYear,
        step: 2,
        handleValueChange: this.handleSliderUpdate.bind(this, "currentYear"),
        color: COLORS.DARK_GRAY
      },
      {
        title: `Minimum Number of Electors: ${currentMinElectors}`,
        min: minElectors,
        max: maxElectors,
        value: currentMinElectors,
        step: 1,
        handleValueChange: this.handleSliderUpdate.bind(
          this,
          "currentMinElectors"
        ),
        color: COLORS.DARK_GRAY
      }
    ];
    // pararemters for bar graph
    let width = 1600;
    let height = 900;
    let padding = 20;
    let egMax = 0.5;
    let yScale = scaleLinear()
      .domain([0, 6])
      .range([height - padding, padding]);
    let currentBarData = allBarData
      .filter(
        // throw out bars coming from states with
        // a small number of electors for the current year
        barD =>
          data.filter(d => d.year === currentYear && d.state === barD.name)
            .length >= currentMinElectors
      )
      .map(d => {
        let seatGap = d.seatGaps[currentYear];
        let height = Math.abs(seatGap);
        let color = COLORS.DARK_BLUE;
        if (seatGap > 0) color = COLORS.RED;
        if (height < 2) color = lighten(0.4, color);
        return {
          key: d.label,
          height,
          color
        };
      })
      .sort((a, b) => a.height - b.height);
    return (
      <div>
        <SliderGroup data={sliderData} />
        <ColumnLayout>
          <USMap
            addGeometryProperties={this.addGeometryProperties}
            colors={[COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED]}
            data={data}
            domain={[-egMax, 0, egMax]}
            fillAccessor={this.fillAccessor}
            getTooltipTitle={d => d.name}
            getTooltipBody={this.getTooltipBody}
          />
          <div>
            <BarGraph
              svgId="eg-chart"
              width={width}
              height={height}
              padding={padding}
              yScale={yScale}
              tickStep={2}
              barData={currentBarData}
              barLabel={bar => bar.key}
            />
          </div>
        </ColumnLayout>
      </div>
    );
  }
}

GerrymanderHistoricalMap.propTypes = {
  minElectors: PropTypes.number.isRequired,
  maxElectors: PropTypes.number.isRequired
};

GerrymanderHistoricalMap.defaultProps = {
  minElectors: 2,
  maxElectors: 10
};

export default withCaption(GerrymanderHistoricalMap);
