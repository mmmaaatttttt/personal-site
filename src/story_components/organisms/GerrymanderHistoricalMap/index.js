import React, { Component } from "react";
import PropTypes from "prop-types";
import { min, max } from "d3-array";
import { nest } from "d3-collection";
import { csv } from "d3-fetch";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import { NarrowContainer, SliderGroup, USMap } from "story_components";

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
      "https://gist.githubusercontent.com/mmmaaatttttt/667f43a79aa2f0b280e2a99a1b807a00/raw/61cf24bda2fd47cdbfd670267ff100b1af0d82a0/congressional_election_results_1996_2016.csv";
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
    nest()
      .key(d => d.state)
      .entries(data)
      .filter(state => state.values.length > 1)
      .forEach(stateObj => {
        const stateGeometry = us.objects.states.geometries.find(
          geometry => geometry.properties.name === stateObj.key
        );
        stateGeometry.properties.values = stateObj.values;
        stateGeometry.properties.efficiencyGap = this.__calculateNormalizedEg(
          stateObj.values
        );
      });
  };

  getTooltipBody = d => {
    if (!d.values) return "Not enough districts.";
    let favoredParty = d.efficiencyGap < 0 ? "Democrats" : "Republicans";
    let formattedGap = Math.abs(d.efficiencyGap * 100).toFixed(2);
    return [
      `${formattedGap}% efficiency gap in favor of ${favoredParty}.`,
      `${d.values.length} districts total.`
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
        title: "Year",
        min: minYear,
        max: maxYear,
        value: currentYear,
        step: 1,
        handleValueChange: this.handleSliderUpdate.bind(this, "currentYear"),
        color: COLORS.DARK_GRAY
      },
      {
        title: "Minimum Number of Electors",
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
        {/* <NarrowContainer width="50%"> */}
        <SliderGroup data={sliderData} />
        {/* </NarrowContainer> */}
        <USMap
          addGeometryProperties={this.addGeometryProperties}
          colors={[COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED]}
          data={data.filter(
            d =>
              d.year ===
              currentYear /* also check that number of districts is sufficient */
          )}
          domain={[-0.5, 0, 0.5]}
          fillAccessor={properties => properties.efficiencyGap}
          getTooltipTitle={d => d.state}
          getTooltipBody={this.getTooltipBody}
        />
      </div>
    );
  }

  __calculateNormalizedEg = values =>
    values.reduce((acc, value) => {
      let egForDistrict = (value.rep - value.dem) / (value.dem + value.rep);
      return acc + egForDistrict;
    }, 0) / values.length;
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
