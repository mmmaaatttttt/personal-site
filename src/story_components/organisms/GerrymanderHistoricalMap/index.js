import React, { Component } from "react";
import PropTypes from "prop-types";
import { min, max } from "d3-array";
import { nest } from "d3-collection";
import { csv } from "d3-fetch";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import { SliderGroup, USMap } from "story_components";

class GerrymanderHistoricalMap extends Component {
  state = {
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
  };

  calculateNormalizedEg = values =>
    values.reduce((acc, value) => {
      let egForDistrict = (value.rep - value.dem) / (value.dem + value.rep);
      return acc + egForDistrict;
    }, 0) / values.length;

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
    let formattedGap = Math.abs(gap * 100).toFixed(2);
    return [
      `${formattedGap}% efficiency gap in favor of ${favoredParty}.`,
      `${districtsForYear} districts total.`
    ];
  };

  handleSliderUpdate = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const {
      data,
      minYear,
      maxYear,
      currentYear,
      currentMinElectors
    } = this.state;
    const { minElectors, maxElectors } = this.props;
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
    if (data.length === 0)
      return (
        <div>
          <h1>Loading, please wait...</h1>
        </div>
      );
    return (
      <div>
        <SliderGroup data={sliderData} />
        <USMap
          addGeometryProperties={this.addGeometryProperties}
          colors={[COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED]}
          data={data}
          domain={[-0.5, 0, 0.5]}
          fillAccessor={this.fillAccessor}
          getTooltipTitle={d => d.state}
          getTooltipBody={this.getTooltipBody}
        />
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
