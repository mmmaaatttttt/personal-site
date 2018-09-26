import React, { Component } from "react";
import PropTypes from "prop-types";
import { csv } from "d3-fetch";
import { min, max } from "d3-array";
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

  handleSliderUpdate = (key, val) => {
    this.setState({ [key]: val });
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
    // const { value, accessor, colors } = this.state.selectedOption;
    // const { selectOptions, data, getTooltipTitle, getTooltipBody } = this.props;
    return data.length ? (
      <div>
        {/* <NarrowContainer width="50%"> */}
          <SliderGroup data={sliderData} />
        {/* </NarrowContainer> */}
        {/* <USMap
          data={data}
          fillAccessor={accessor}
          colors={colors}
          getTooltipTitle={getTooltipTitle}
          getTooltipBody={getTooltipBody}
        /> */}
      </div>
    ) : (
      <div>
        <h1>Loading, please wait...</h1>
      </div>
    );
  }
}

GerrymanderHistoricalMap.propTypes = {
  minElectors: PropTypes.number.isRequired,
  maxElectors: PropTypes.number.isRequired
  // getTooltipTitle: PropTypes.func.isRequired,
  // getTooltipBody: PropTypes.func.isRequired
};

GerrymanderHistoricalMap.defaultProps = {
  minElectors: 2,
  maxElectors: 10
};

export default withCaption(GerrymanderHistoricalMap);
