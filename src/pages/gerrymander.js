import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { nest } from "d3-collection";
import {
  Button,
  ColumnLayout,
  HeatChart,
  Icon,
  InteractiveGrid,
  NarrowContainer,
  USMap
} from "story_components";
import voteData from "data/gerrymander";
import COLORS from "utils/styles";

const StyledDistrictData = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
  }

  h4 {
    margin: 0 0.5rem 0 0;
  }
`;

const StyledTable = styled.table`
  width: 75%;
  margin: 2rem auto;

  th,
  td {
    text-align: center;
  }

  td:first-child {
    font-weight: bold;
  }

  td:nth-child(2) {
    color: ${COLORS.ORANGE};
  }

  td:last-child {
    color: ${COLORS.PURPLE};
  }

  tr:last-child td {
    color: ${COLORS.BLACK};
  }
`;

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

  orangeCount = district => district.filter(d => d[0] % 2 === 0).length;

  purpleCount = district => district.filter(d => d[0] % 2 === 1).length;

  validDistricts = () => {
    const { districts } = this.state;
    const { rowCount, colCount } = this.props;
    return (
      districts.length === rowCount &&
      districts.every(d => d.length === colCount)
    );
  };

  calculateWastedVotes = (votes, party1Accessor, party2Accessor) => {
    return votes.map(district => {
      let party1Votes = party1Accessor(district);
      let party2Votes = party2Accessor(district);
      let votesNeededToWin = Math.ceil((party1Votes + party2Votes + 1) / 2);
      return party1Votes > party2Votes
        ? [party1Votes - votesNeededToWin, party2Votes]
        : [party1Votes, party2Votes - votesNeededToWin];
    });
  };

  calculateTotalVotes = (votes, party1Accessor, party2Accessor) => {
    return votes.reduce(
      (voteTotal, cur) => voteTotal + party1Accessor(cur) + party2Accessor(cur),
      0
    );
  };

  // calculateEfficiencyGap = (votes, party1Accessor, party2Accessor) => {
  //   // TODO - calculate wasted votes in separate helper
  //   // generate table for worked example
  //   let wastedAndTotalVotes = votes.reduce(
  //     (curVotes, district) => {
  //       let party1Votes = party1Accessor(district);
  //       let party2Votes = party2Accessor(district);
  //       let votesNeededToWin = Math.ceil((party1Votes + party2Votes + 1) / 2);
  //       curVotes[0] += party1Votes;
  //       curVotes[1] += party2Votes;
  //       curVotes[2] += party1Votes + party2Votes;
  //       let winningIdx = party1Votes > party2Votes ? 0 : 1;
  //       curVotes[winningIdx] -= votesNeededToWin;
  //       return curVotes;
  //     },
  //     [0, 0, 0]
  //   );
  //   return wastedAndTotalVotes;
  // };

  addGeometryProperties = (us, allData) => {
    let data = allData[114];
    const stateData = nest()
      .key(d => d.state)
      .entries(data);
    stateData.forEach(stateObj => {
      stateObj.values.forEach(distObj => {
        const districtGeometry = us.objects.districts114.geometries.find(
          geom => {
            const { STATENAME, DISTRICT } = geom.properties;
            return STATENAME === stateObj.key && +DISTRICT === distObj.district;
          }
        );
        if (districtGeometry) districtGeometry.properties.values = distObj;
      });
    });
  };

  handleSave = () => {
    const { segments } = this.state;
    localStorage.setItem("segments", JSON.stringify(segments));
    this.setState({ saveable: false });
  };

  handleReset = () => {
    localStorage.removeItem("segments");
    this.setState(
      {
        segments: Array.from({ length: this.props.rowCount * 2 - 1 }, (_, i) =>
          Array(this.props.colCount - 1 + (i % 2)).fill(false)
        ),
        districts: [[]],
        saveable: false
      },
      this.__countRegions
    );
  };

  handleSegmentUpdate = (row, col, segStatus, e) => {
    if (segStatus !== null) {
      this.setState(prevState => {
        const segments = [...prevState.segments];
        segments[row] = [...prevState.segments[row]];
        segments[row][col] = segStatus;
        return { segments, saveable: true };
      }, this.__countRegions);
    }
  };

  __countRegions = () => {
    const { rowCount, colCount } = this.props;
    const { districts } = this.state;
    const visitedYet = Array.from({ length: rowCount }, () =>
      Array.from({ length: colCount }).fill(false)
    );
    const newDistricts = [];
    visitedYet.forEach((row, rowIdx) => {
      row.forEach((isVisited, colIdx) => {
        if (!isVisited) {
          newDistricts.push(
            this.__calculateArea(visitedYet, [[rowIdx, colIdx]])
          );
        }
      });
    });
    if (
      districts.length !== newDistricts.length ||
      districts.some(
        (district, i) => district.length !== newDistricts[i].length
      )
    ) {
      this.setState({ districts: newDistricts });
    }
  };

  __calculateArea = (visitedYet, whereToLook) => {
    const { segments } = this.state;
    let district = [];
    while (whereToLook.length > 0) {
      let [row, col] = whereToLook.shift();
      if (visitedYet[row][col] === false) {
        visitedYet[row][col] = true;
        district.push([row, col]);
        let shouldMoveUp =
          visitedYet[row - 1] !== undefined &&
          visitedYet[row - 1][col] === false &&
          segments[2 * row - 1][col] === false;
        let shouldMoveRight =
          visitedYet[row][col + 1] !== undefined &&
          visitedYet[row][col + 1] === false &&
          segments[2 * row][col] === false;
        let shouldMoveDown =
          visitedYet[row + 1] !== undefined &&
          visitedYet[row + 1][col] === false &&
          segments[2 * row + 1][col] === false;
        let shouldMoveLeft =
          visitedYet[row][col - 1] !== undefined &&
          visitedYet[row][col - 1] === false &&
          segments[2 * row][col - 1] === false;
        if (shouldMoveUp) whereToLook.push([row - 1, col]);
        if (shouldMoveRight) whereToLook.push([row, col + 1]);
        if (shouldMoveDown) whereToLook.push([row + 1, col]);
        if (shouldMoveLeft) whereToLook.push([row, col - 1]);
      }
    }
    return district;
  };

  render() {
    const { rowCount, colCount, colors } = this.props;
    const { districts, segments, saveable } = this.state;
    const heatData = Array.from({ length: colCount }, () =>
      Array.from({ length: rowCount }, (_, i) => i % 2)
    );
    let gapExample = (
      <p>
        To see a sample calculation of the efficiency gap, please finish drawing
        your districts above.
      </p>
    );
    if (this.validDistricts()) {
      const wastedVotes = this.calculateWastedVotes(
        districts,
        this.orangeCount,
        this.purpleCount
      );
      const totalWastedVotes = wastedVotes.reduce(
        (totals, cur) => {
          totals[0] += cur[0];
          totals[1] += cur[1];
          return totals;
        },
        [0, 0]
      );
      const totalVotes = this.calculateTotalVotes(
        districts,
        this.orangeCount,
        this.purpleCount
      );
      let first = { idx: 0, color: COLORS.ORANGE, name: "orange" };
      let second = { idx: 1, color: COLORS.PURPLE, name: "purple" };
      if (totalWastedVotes[1] > totalWastedVotes[0])
        [first, second] = [second, first];
      let eg =
        (totalWastedVotes[first.idx] - totalWastedVotes[second.idx]) /
        totalVotes;
      let gapCopy = [
        "( ",
        <span style={{ color: first.color }}>
          {totalWastedVotes[first.idx]}
        </span>,
        " - ",
        <span style={{ color: second.color }}>
          {totalWastedVotes[second.idx]}
        </span>,
        ` ) / ${totalVotes} = ${(eg * 100).toFixed(2)}% in favor of ${
          second.name
        }.`
      ];
      if (eg === 0)
        gapCopy[gapCopy.length - 1] = ` ) / ${totalVotes} = ${(
          eg * 100
        ).toFixed(2)}%.`;
      gapExample = [
        <p>
          Here's a sample efficiency gap calculation based on the districts you
          created above.
        </p>,
        <StyledTable>
          <thead>
            <tr>
              <th>District</th>
              <th>Wasted Votes (Orange)</th>
              <th>Wasted Votes (Purple)</th>
            </tr>
          </thead>
          <tbody>
            {wastedVotes.map((overvotes, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{overvotes[0]}</td>
                <td>{overvotes[1]}</td>
              </tr>
            ))}
            <tr>
              <td>Total</td>
              <td>{totalWastedVotes[0]}</td>
              <td>{totalWastedVotes[1]}</td>
            </tr>
            <tr>
              <td>Efficiency Gap</td>
              <td colSpan="2">{gapCopy}</td>
            </tr>
          </tbody>
        </StyledTable>
      ];
    }
    return (
      <NarrowContainer width="80%" style={{ padding: "1rem" }}>
        <h1>Gerrymandering Interactives</h1>
        <h2>1. Create your own Gerrymander!</h2>
        <p>
          Imagine a region with 54 citizens, evenly divided among two parties
          (the orange party and the purple party). You are part of a committee
          tasked with dividing this region into six contiguous districts of the
          same size: 9 citizens each.
        </p>
        <p>
          Each district will have a representative in the government that is
          elected by members from that district.
        </p>
        <p>
          How would you draw congressional lines to divide this region into six
          districts?
        </p>
        <ColumnLayout break="small" sizes={[3, 2]}>
          <HeatChart
            data={heatData}
            axes={false}
            tooltip={false}
            colorRange={colors}
          >
            <InteractiveGrid
              strokeWidth={6}
              rowCount={rowCount}
              colCount={colCount}
              handleSegmentUpdate={this.handleSegmentUpdate}
              segments={segments}
            />
          </HeatChart>
          <StyledDistrictData>
            {districts.length > 6 ? (
              <h2>Too many districts!</h2>
            ) : (
              Array.from({ length: 6 }).map((_, idx) => {
                let size = (districts[idx] && districts[idx].length) || "--";
                let icon = (
                  <Icon name="times-circle" color={COLORS.RED} size={2} />
                );
                if (districts[idx] && districts[idx].length === colCount) {
                  icon = (
                    <Icon name="check-circle" color={COLORS.GREEN} size={2} />
                  );
                }
                let msgByColor = null;
                let color = COLORS.BLACK;
                if (districts[idx]) {
                  let orangeTotal = this.orangeCount(districts[idx]);
                  let purpleTotal = this.purpleCount(districts[idx]);
                  msgByColor = `(${orangeTotal} orange, ${purpleTotal} purple)`;
                  if (orangeTotal > purpleTotal) color = COLORS.ORANGE;
                  if (purpleTotal > orangeTotal) color = COLORS.PURPLE;
                }
                return (
                  <div key={idx}>
                    <h4 style={{ color }}>
                      D{idx + 1}: {size} {msgByColor}
                    </h4>
                    {icon}
                  </div>
                );
              })
            )}
            <div>
              <Button
                onClick={this.handleSave}
                disabled={!saveable}
                color={COLORS.GREEN}
              >
                {saveable ? "Save" : "Saved"}
              </Button>
              <Button onClick={this.handleReset} color={COLORS.RED}>
                Reset
              </Button>
            </div>
          </StyledDistrictData>
        </ColumnLayout>
        <h2>2. An Introduction to Gerrymandering</h2>
        <p>
          The problem of subdividing regions equal sizes based on population is
          one that the United States grapples with every 10 years, based on the
          latest census data.
        </p>
        <p>
          States with multiple representatives are required to draw
          congressional district lines every decade. Unfortunately, the process
          of drawing these lines is ripe for manipulation. When one party is in
          power, it's possible for them to draw congressional boundaries in a
          way that grant them even more power, by exploiting geography to
          bolster their representation in Congress. This process is called{" "}
          <b>gerrymandering</b>.
        </p>
        <p>
          Typically gerrymandering is achieved by combining two strategies:{" "}
          <b>packing</b> and <b>cracking</b>. Packing refers to consolidating
          large numbers of one party into a small number of districts. Cracking
          is the opposite: diluting the voting power of a large bloc of voters
          in one part by splitting them up so that they form minorities in
          multiple districts.
        </p>
        <p>
          Long considered an esoteric political topic, gerrymandering has
          received a great deal of attention recently. In part this is due to
          some high profile Supreme Court cases, along with the advent of
          technologies that make gerrymandering easier to do.
        </p>
        <p>
          But as gerrymandering has become more well-known, techniques for
          combating it have begun springing up as well. One of the most common
          new techniques is also relatively simple, and requires little more
          than basic arithmetic.
        </p>
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
        {gapExample}
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
          the gap in these scenarios.)
        </p>
        <USMap
          data={voteData}
          getTooltipTitle={() => {}}
          getTooltipBody={() => {}}
        />
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
  colors: [COLORS.ORANGE, COLORS.PURPLE]
};

export default GerrymanderSample;
