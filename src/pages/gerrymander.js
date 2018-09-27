import React, { Component } from "react";
import PropTypes from "prop-types";
import { NarrowContainer, USMap } from "story_components";
import COLORS from "utils/styles";

class GerrymanderSample extends Component {
  state = {
    segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
      Array(this.props.colCount - 1 + (i % 2)).fill(false)
    ),
    districts: [[]],
    saveable: false
  };

  componentDidMount() {
    const segments = JSON.parse(localStorage.getItem("segments"));
    if (segments) {
      this.setState({ segments }, this.__countRegions);
    } else {
      this.__countRegions();
    }
  }

  blueCount = district => district.filter(d => d[0] % 2 === 0).length;

  redCount = district => district.filter(d => d[0] % 2 === 1).length;

  validDistricts = () => {
    const { districts } = this.state;
    const { rowCount, colCount } = this.props;
    return (
      districts.length === rowCount &&
      districts.every(d => d.length === colCount)
    );
  };

  __calculateEfficiencyGap = values => {
    let demAccessor = v => v.votes.dem;
    let repAccessor = v => v.votes.rep;
    let wastedVotes = calculateTotalWastedVotes(
      values,
      demAccessor,
      repAccessor
    );
    let totalVotes = calculateTotalVotes(values, demAccessor, repAccessor);
    return (wastedVotes[0] - wastedVotes[1]) / totalVotes;
  };

  getTooltipBody = d => {
    if (!d.values) return "Not enough districts.";
    let favoredParty = d.efficiencyGap < 0 ? "Democrats" : "Republicans";
    let formattedGap = Math.abs(d.efficiencyGap * 100).toFixed(2);
    return [
      `${formattedGap}% efficiency gap in favor of ${favoredParty}.`,
      `${d.values.length} districts contributed to this calculation.`
    ];
  };

  addGeometryProperties = (us, data) => {
    nest()
      .key(d => d.state)
      .entries(data[114])
      .map(state => {
        const values = state.values
          .map(val => ({
            ...val,
            votes: { rep: val.votes.rep, dem: val.votes.dem }
          }))
          .filter(val => val.votes.rep && val.votes.dem);
        return { ...state, values };
      })
      .filter(state => state.values.length > 1)
      .forEach(stateObj => {
        const stateGeometry = us.objects.states.geometries.find(
          geometry => geometry.properties.name === stateObj.key
        );
        stateGeometry.properties.values = stateObj.values;
        stateGeometry.properties.efficiencyGap = this.__calculateEfficiencyGap(
          stateObj.values
        );
      });
  };

  render() {
    const { rowCount, colCount, colors } = this.props;
    const { districts, segments, saveable } = this.state;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    return (
      <NarrowContainer width="80%" style={{ padding: "1rem" }}>
        <h1>Gerrymandering Interactives</h1>
        <h2>1. Create your own Gerrymander!</h2>
        <h2>2. An Introduction to Gerrymandering</h2>

        <h2>3. Quantifying Gerrymandering: The Efficiency Gap</h2>
        <p>
          Voting is inherently an inefficient mechanism for electing officials
          who represent the interests of a large group of people. This is
          because in most cases, the winner is determined by{" "}
          <b>winner take all</b>.
        </p>
        <p>
          In this system, if your candidate loses, it's easy to think of your
          vote as being wasted, in that the official who won and now represents
          you likely doesn't actually represent you. But people who vote for
          losing candidates aren't the only ones whose votes can be wasted. Even
          votes for winners can be considered wasted, if they're in excess of
          the simple majority needed to squeeze out a win. In other words, if
          your candidate won by 10,000 votes, one could consider 9,999 of those
          votes "wasted," since the candidate still would've one even if the
          margin had been that much smaller.
        </p>
        <p>
          The <b>efficiency gap</b> is a gerrymandering metric that takes these
          observations into account. Essentially it calculates the number of
          wasted votes for each party, and determines whether there's a{" "}
          <em>systemic bias</em> towards wasted votes in one party compared to
          another.
        </p>
        <p>
          This gap is calculated by calculating the difference between the
          number votes each party has wasted, and dividing that tally by the
          total number of votes cast.
        </p>
        <h2>4. The efficiency gap in the wild</h2>
        <p>
          How does the efficiency gap stack up in the real world? Let's take a
          look at historical data on congressional elections in the United
          States.
        </p>
        <p>
          States in this chart are colored according to the size of the
          efficiency gap. Darker red indicates an efficiency gap favoring
          Republicans; darker blue indicates an efficiency gap favoring
          Democrats.
        </p>
        <p>
          Note that it's impossible to gerrymander a state with only one
          representative, so those states are greyed out. Also, only vote
          tallies for Democrat and Republican candidates are considered. In the
          event that a district did not have both a Republican and a Democrat on
          the ballot, that district has been ignored. (TO DO: better estimate
          the gap in these scenarios, and include historical data so you can see
          how the efficiency gap changes across time in different states.)
        </p>
        <USMap
          addGeometryProperties={this.addGeometryProperties}
          colors={[COLORS.DARK_BLUE, COLORS.WHITE, COLORS.RED]}
          domain={[-0.5, 0, 0.5]}
          data={voteData}
          fillAccessor={this.fillAccessor}
          getTooltipTitle={d => d.name}
          getTooltipBody={this.getTooltipBody}
        />
        <p>Problems with this metric</p>
        <p>Other attempts to measure and fix gerrymandering</p>
        <ul>
          <li />
        </ul>
        <p>Questions</p>
        <ul>
          <li>Has gerrymandering gotten worse over time?</li>
        </ul>
      </NarrowContainer>
    );
  }
}

GerrymanderSample.propTypes = {
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

GerrymanderSample.defaultProps = {
  rowCount: 6,
  colCount: 9,
  colors: [COLORS.DARK_BLUE, COLORS.RED]
};

export default GerrymanderSample;
