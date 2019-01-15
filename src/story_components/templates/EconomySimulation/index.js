import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import updateSpeeds from "data/income-inequality.js";
import {
  BarGraph,
  ClippedSVG,
  EconomyNodeGroup,
  NarrowContainer,
  SliderGroup,
  ButtonGroup
} from "story_components";

class EconomySimulation extends Component {
  state = {
    playing: false,
    paused: false,
    showingSimulation: true,
    speeds: new Array(2).fill(this.props.initialV),
    velocityMultiplier: 1,
    savingsRate: 0
  };

  handleStart = () => {
    this.setState({ playing: true });
  };

  handleStop = () => {
    this.setState({
      playing: false,
      paused: false,
      velocityMultiplier: 1,
      showingSimulation: true,
      speeds: new Array(2).fill(this.props.initialV),
      savingsRate: 0
    });
  };

  handlePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  handleShowingSimulation = () => {
    this.setState({ showingSimulation: !this.state.showingSimulation });
  };

  handleSpeedCount = newCount => {
    this.setState({ speeds: new Array(newCount).fill(this.props.initialV) });
  };

  handleVelocityChange = newMultiplier => {
    this.setState({ velocityMultiplier: newMultiplier });
  };

  handleSavingsChange = newSavingsRate => {
    this.setState({ savingsRate: newSavingsRate });
  };

  handleCollision = (...nodes) => {
    // NOTE: velocity isn't conserved, energy is
    const { speeds, velocityMultiplier, savingsRate } = this.state;
    const updateFn = updateSpeeds[this.props.idx];
    this.setState({
      speeds: updateFn(speeds, velocityMultiplier, savingsRate, nodes)
    });
  };

  render() {
    const {
      playing,
      paused,
      speeds,
      velocityMultiplier,
      showingSimulation,
      savingsRate
    } = this.state;
    const { width, height, padding, initialV, idx, editSavings } = this.props;
    const yScale = scaleLinear()
      .domain([0, Math.max(...speeds, 2.5 * initialV) ** 2 + 100])
      .range([height - padding, padding]);
    const barData = speeds
      .map((speed, i) => ({ key: i, height: speed ** 2 }))
      .sort((s1, s2) => s1.height - s2.height);
    const headerData = [
      {
        sliders: [
          {
            handleValueChange: this.handleSpeedCount,
            title: "Population Size",
            value: speeds.length,
            min: 2,
            max: 30,
            step: 1,
            color: COLORS.MAROON,
            minIcon: "user",
            maxIcon: "users"
          }
        ].concat(
          editSavings
            ? {
                handleValueChange: this.handleSavingsChange,
                title: "Savings Rate",
                value: savingsRate,
                min: 0,
                max: 1,
                step: 0.01,
                color: COLORS.MAROON,
                minIcon: "thermometer-empty",
                maxIcon: "thermometer-full"
              }
            : []
        ),
        buttons: [
          {
            color: COLORS.MAROON,
            handleClick: this.handleStart,
            buttonText: "Start"
          }
        ]
      },
      {
        sliders: [
          {
            handleValueChange: this.handleVelocityChange,
            title: "Average Wealth (a.k.a. Average Speed)",
            value: velocityMultiplier,
            min: 0.1,
            max: 2,
            step: 0.1,
            color: COLORS.MAROON,
            minIcon: "step-forward",
            maxIcon: "fast-forward"
          }
        ],
        buttons: [
          {
            color: COLORS.ORANGE,
            handleClick: this.handlePause,
            buttonText: "Pause"
          },
          {
            color: COLORS.BLUE,
            handleClick: this.handleShowingSimulation,
            buttonText: showingSimulation ? "Show Chart" : "Show Nodes"
          },
          {
            color: COLORS.RED,
            handleClick: this.handleStop,
            buttonText: "Reset"
          }
        ]
      }
    ];
    const barGraphArea = showingSimulation ? null : (
      <BarGraph
        svgId={`bar-${idx}`}
        width={width}
        height={height}
        padding={padding}
        barData={barData}
        yScale={yScale}
        tickStep={initialV ** 2}
        barLabel={bar => bar.key + 1}
      />
    );
    return (
      <NarrowContainer width="50%">
        <SliderGroup data={headerData[+playing].sliders} />
        <ButtonGroup data={headerData[+playing].buttons} />
        <div style={{ display: showingSimulation ? "block" : "none" }}>
          <ClippedSVG
            width={width}
            height={height}
            padding={padding}
            id={`simulation-${idx}`}
          >
            <EconomyNodeGroup
              speeds={speeds}
              width={width}
              height={height}
              playing={playing}
              paused={paused}
              velocityMultiplier={velocityMultiplier}
              handleCollision={this.handleCollision}
              initialV={initialV}
            />
          </ClippedSVG>
        </div>
        {barGraphArea}
      </NarrowContainer>
    );
  }
}

EconomySimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  initialV: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  editSavings: PropTypes.bool.isRequired
};

EconomySimulation.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  initialV: 10,
  editSavings: false
};

export default withCaption(EconomySimulation);
