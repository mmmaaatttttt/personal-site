import React, { Component } from "react";
import PropTypes from "prop-types";
import { selectAll } from "d3-selection";
import { scaleLinear } from "d3-scale";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import updateSpeeds from "data/income-inequality.js";
import {
  ClippedSVG,
  FlexContainer,
  HarassmentNodeGroup,
  NarrowContainer,
  SliderGroup,
  ButtonGroup,
  HorizontalBar
} from "story_components";

class HarassmentSimulation extends Component {
  state = {
    playing: false,
    paused: false,
    blueCount: 2,
    brownCount: 2,
    velocityMultiplier: 1,
    blueShoutsHeard: new Set(),
    brownShoutsHeard: new Set()
  };

  handleStart = () => {
    this.setState({ playing: true });
  };

  handleStop = () => {
    selectAll(".shout").remove();
    this.setState({
      playing: false,
      paused: false,
      velocityMultiplier: 1,
      blueCount: 2,
      brownCount: 2,
      blueShoutsHeard: new Set(),
      brownShoutsHeard: new Set()
    });
  };

  handleShout = (key, shoutId) => {
    const set = this.state[key];
    if (!set.has(shoutId)) {
      this.setState({ [key]: new Set(set).add(shoutId) });
    }
  };

  handlePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  handleVelocityChange = newMultiplier => {
    this.setState({ velocityMultiplier: newMultiplier });
  };

  handleCountChange = (color, newCount) => {
    this.setState({ [color]: newCount });
  };

  render() {
    const {
      playing,
      paused,
      blueCount,
      brownCount,
      velocityMultiplier,
      blueShoutsHeard,
      brownShoutsHeard
    } = this.state;
    const { width, height, padding, initialV, idx } = this.props;
    const headerData = [
      {
        sliders: [
          {
            handleValueChange: this.handleCountChange.bind(this, "brownCount"),
            title: `Number of Brown Eyed People: ${brownCount}`,
            value: brownCount,
            min: 2,
            max: 50,
            step: 1,
            color: COLORS.MAROON,
            minIcon: "user",
            maxIcon: "users"
          },
          {
            handleValueChange: this.handleCountChange.bind(this, "blueCount"),
            title: `Number of Blue Eyed People: ${blueCount}`,
            value: blueCount,
            min: 2,
            max: 50,
            step: 1,
            color: COLORS.BLUE,
            minIcon: "user",
            maxIcon: "users"
          }
        ],
        buttons: [
          {
            handleClick: this.handleStart,
            buttonText: "Start"
          }
        ]
      },
      {
        sliders: [
          {
            handleValueChange: this.handleVelocityChange,
            title: "Average Speed",
            value: velocityMultiplier,
            min: 0.1,
            max: 2,
            step: 0.1,
            color: COLORS.DARK_GRAY,
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
            color: COLORS.RED,
            handleClick: this.handleStop,
            buttonText: "Reset"
          }
        ]
      }
    ];
    const barData = [
      {
        size: blueShoutsHeard.size,
        color: COLORS.BLUE,
        tooltipText: `Insensitive comments heard by blue: ${
          blueShoutsHeard.size
        }`
      },
      {
        size: brownShoutsHeard.size,
        color: COLORS.MAROON,
        tooltipText: `Insensitive comments heard by brown: ${
          brownShoutsHeard.size
        }`
      }
    ];
    return (
      <NarrowContainer width="75%">
        <SliderGroup data={headerData[+playing].sliders} />
        <ButtonGroup data={headerData[+playing].buttons} />
        <ClippedSVG
          width={width}
          height={height}
          padding={padding}
          id={`simulation-${idx}`}
        >
          <HarassmentNodeGroup
            brownCount={brownCount}
            blueCount={blueCount}
            width={width}
            height={height}
            playing={playing}
            paused={paused}
            velocityMultiplier={velocityMultiplier}
            initialV={initialV}
            handleShout={this.handleShout}
          />
        </ClippedSVG>
        <HorizontalBar data={barData} />
      </NarrowContainer>
    );
  }
}

HarassmentSimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  initialV: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired
};

HarassmentSimulation.defaultProps = {
  width: 900,
  height: 600,
  padding: 0,
  initialV: 2
};

export default withCaption(HarassmentSimulation);
