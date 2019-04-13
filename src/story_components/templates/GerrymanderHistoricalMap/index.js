import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { extent } from "d3-array";
import { nest } from "d3-collection";
import { scaleLinear } from "d3-scale";
import { lighten } from "polished";
import { withCaption } from "containers";
import COLORS from "utils/styles";
import { calculateWastedVotes } from "utils/mathHelpers";
import { BarGraph, ColumnLayout, SliderGroup, USMap } from "story_components";

class PureHistoricalMap extends Component {
  state = {
    allBarData: [],
    currentYear: this.props.maxYear,
    currentMinElectors: 2
  };

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
    const { allBarData, currentYear, currentMinElectors } = this.state;
    const { minElectors, maxElectors, minYear, maxYear, data } = this.props;
    const sliderData = [
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
        <ColumnLayout break="small">
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
              barData={currentBarData}
              barLabel={bar => bar.key}
              height={height}
              labelFontSize={`${(currentMinElectors - 1) / 10 + 1.2}rem`}
              padding={padding}
              svgId="eg-chart"
              tickStep={2}
              width={width}
              yScale={yScale}
            />
          </div>
        </ColumnLayout>
      </div>
    );
  }
}
class GerrymanderHistoricalMap extends Component {
  cleanQuery = data => {
    return data.allCongressionalElectionResults19962016Csv.edges
      .filter(({ node }) => !["Senate", "President"].includes(node["District"]))
      .map(({ node }) => {
        let rowObj = { demEst: false, repEst: false };
        if (/\*/.test(node.Democrat)) rowObj.demEst = true;
        if (/\*/.test(node.Republican)) rowObj.repEst = true;
        return {
          ...rowObj,
          year: +node.Year,
          state: node.State,
          district: +node.District,
          dem: +node.Democrat.replace("*", ""),
          rep: +node.Republican.replace("*", "")
        };
      });
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => {
          const cleanedData = this.cleanQuery(data);
          const yearExtent = extent(cleanedData, d => d.year);
          return (
            <PureHistoricalMap
              data={cleanedData}
              minYear={yearExtent[0]}
              maxYear={yearExtent[1]}
              {...this.props}
            />
          );
        }}
      />
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

PureHistoricalMap.propTypes = {
  data: PropTypes.array.isRequired,
  maxElectors: PropTypes.number.isRequired,
  maxYear: PropTypes.number.isRequired,
  minElectors: PropTypes.number.isRequired,
  minYear: PropTypes.number.isRequired
};

PureHistoricalMap.defaultProps = {
  data: [],
  maxElectors: 10,
  maxYear: 2016,
  minElectors: 2,
  minYear: 1996
};

const query = graphql`
  query GerrymanderQuery {
    allCongressionalElectionResults19962016Csv {
      edges {
        node {
          Year
          State
          District
          Republican
          Democrat
        }
      }
    }
  }
`;

export default withCaption(GerrymanderHistoricalMap);

export { PureHistoricalMap };
