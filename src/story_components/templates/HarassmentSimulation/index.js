import React, { Component } from "react";
import PropTypes from "prop-types";
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
  ButtonGroup
} from "story_components";

class HarassmentSimulation extends Component {
  state = {
    playing: false,
    paused: false,
    blueCount: 1,
    brownCount: 1,
    velocityMultiplier: 1
  };

  handleStart = () => {
    this.setState({ playing: true });
  };

  handleStop = () => {
    this.setState({
      playing: false,
      paused: false,
      velocityMultiplier: 1
    });
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
      velocityMultiplier
    } = this.state;
    const { width, height, padding, initialV, idx } = this.props;
    const headerData = [
      {
        sliders: [
          {
            handleValueChange: this.handleCountChange.bind(this, "brownCount"),
            title: "Number of Brown Eyed People",
            value: brownCount,
            min: 1,
            max: 50,
            step: 1,
            color: COLORS.MAROON,
            minIcon: "user",
            maxIcon: "users"
          },
          {
            handleValueChange: this.handleCountChange.bind(this, "blueCount"),
            title: "Number of Blue Eyed People",
            value: blueCount,
            min: 1,
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
          />
        </ClippedSVG>
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
  initialV: 10
};

export default withCaption(HarassmentSimulation);
