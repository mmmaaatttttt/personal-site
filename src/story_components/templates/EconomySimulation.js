import React, { Component } from "react";
import PropTypes from "prop-types";
import SimulationStart from "../molecules/SimulationStart";
import SimulationStop from "../molecules/SimulationStop";
import ClippedSVG from "../atoms/ClippedSVG";
import EconomyNodeGroup from "../molecules/EconomyNodeGroup";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";

class EconomySimulation extends Component {
  constructor(props) {
    super(props);
    const money = Math.sqrt(props.totalWealth / 2);
    this.state = {
      playing: false,
      paused: false,
      people: [{ id: 0, money }, { id: 1, money }]
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePersonCount = this.handlePersonCount.bind(this);
    this.handleTrade = this.handleTrade.bind(this);
  }

  handleStart() {
    this.setState({ playing: true });
  }

  handleStop() {
    this.setState({ playing: false, paused: false });
  }

  handlePause() {
    this.setState({ paused: !this.state.paused });
  }

  handlePersonCount(newCount) {
    const money = Math.sqrt(this.props.totalWealth / newCount);
    this.setState({
      people: Array.from({ length: newCount }, (_, i) => ({
        id: i,
        money
      }))
    });
  }

  handleTrade(traders, amount) {
    const newPeople = [...this.state.people];
    const buyId = traders[0].id;
    const sellId = traders[1].id;
    newPeople[buyId] = {
      ...newPeople[buyId],
      money: newPeople[buyId].money - amount
    };
    newPeople[sellId] = {
      ...newPeople[sellId],
      money: newPeople[sellId].money + amount
    };
    console.log(
      "in handleTrade!",
      newPeople[buyId].money,
      newPeople[sellId].money
    );
    this.setState({ people: newPeople });
  }

  render() {
    const { playing, paused, people } = this.state;
    const { width, height, padding } = this.props;
    const header = playing ? (
      <SimulationStop
        handleStop={this.handleStop}
        handlePause={this.handlePause}
      />
    ) : (
      <SimulationStart
        handleStart={this.handleStart}
        handlePersonCount={this.handlePersonCount}
        personCount={people.length}
      />
    );
    return (
      <StyledNarrowContainer width="60%">
        {header}
        <div>
          <p>Playing: {playing.toString()}</p>
          <p>Paused: {paused.toString()}</p>
          <ClippedSVG
            width={width}
            height={height}
            padding={padding}
            id="simulation"
          >
            <EconomyNodeGroup
              people={people}
              cx={width / 2}
              cy={height / 2}
              playing={playing}
              paused={paused}
              handleTrade={this.handleTrade}
            />
          </ClippedSVG>
        </div>
      </StyledNarrowContainer>
    );
  }
}

EconomySimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  totalWealth: PropTypes.number.isRequired
};

EconomySimulation.defaultProps = {
  width: 600,
  height: 600,
  padding: 20,
  totalWealth: 5000
};

export default withCaption(EconomySimulation);
