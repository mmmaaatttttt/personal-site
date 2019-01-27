import React, { Component } from "react";
import PropTypes from "prop-types";
import { select } from "d3-selection";
import { darken } from "polished";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import { capitalize } from "utils/stringHelpers";
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
    blueCount: 10,
    greenCount: 20,
    blueShoutsHeardFromBlueOnly: new Set(),
    blueShoutsHeardFromGreen: new Set(),
    greenShoutsHeardFromBlue: new Set(),
    greenShoutsHeardFromGreenOnly: new Set(),
    blueOnBlueProb: 0.05,
    greenOnGreenProb: 0.05,
    blueOnGreenProb: 0.05,
    greenOnBlueProb: 0.05
  };

  handleStart = () => {
    this.setState({
      playing: true,
      blueShoutsHeardFromBlueOnly: new Set(),
      blueShoutsHeardFromGreen: new Set(),
      greenShoutsHeardFromBlue: new Set(),
      greenShoutsHeardFromGreenOnly: new Set()
    });
  };

  handleStop = () => {
    select(`#simulation-${this.props.idx}`)
      .selectAll(".shout")
      .remove();
    this.setState({
      playing: false,
      paused: false,
      blueCount: 10,
      greenCount: 20,
      blueOnBlueProb: 0.05,
      greenOnGreenProb: 0.05,
      blueOnGreenProb: 0.05,
      greenOnBlueProb: 0.05
    });
  };

  handleShout = (key, shoutId) => {
    // shouting has ended, see if the shout was heard by the other group
    const setStateCond1 =
      key === "blueShoutsHeardFromBlueOnly" &&
      !this.state.greenShoutsHeardFromBlue.has(shoutId);
    const setStateCond2 =
      key === "greenShoutsHeardFromGreenOnly" &&
      !this.state.blueShoutsHeardFromGreen.has(shoutId);
    // shouting is in progress, see if the shout is being heard by the other group
    const setStateCond3 = !/only/gi.test(key) && !this.state[key].has(shoutId);
    if (setStateCond1 || setStateCond2 || setStateCond3) {
      this.setState(prevState => ({
        [key]: new Set(prevState[key]).add(shoutId)
      }));
    }
  };

  handlePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  handleSliderChange = (stateKey, newVal) => {
    this.setState({ [stateKey]: newVal });
  };

  render() {
    const {
      playing,
      paused,
      blueCount,
      greenCount,
      blueShoutsHeardFromGreen,
      greenShoutsHeardFromBlue,
      blueShoutsHeardFromBlueOnly,
      greenShoutsHeardFromGreenOnly,
      blueOnBlueProb,
      greenOnGreenProb,
      blueOnGreenProb,
      greenOnBlueProb
    } = this.state;
    const { width, height, padding, initialV, idx } = this.props;
    const headerData = [
      {
        sliders: [
          {
            handleValueChange: this.handleSliderChange.bind(this, "greenCount"),
            title: `Number of Green-eyed People: ${greenCount}`,
            value: greenCount,
            min: 1,
            max: 20,
            step: 1,
            color: COLORS.GREEN,
            minIcon: "user",
            maxIcon: "users"
          },
          {
            handleValueChange: this.handleSliderChange.bind(this, "blueCount"),
            title: `Number of Blue-eyed People: ${blueCount}`,
            value: blueCount,
            min: 1,
            max: 20,
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
        sliders: [],
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
    if (idx > 0) {
      let newSliders = [
        "greenOnGreenProb",
        "blueOnBlueProb",
        "greenOnBlueProb",
        "blueOnGreenProb"
      ]
        .map(key => ({
          key,
          nodes: key.match(/green|blue/gi).map(capitalize)
        }))
        .map(obj => {
          const title = `${(this.state[obj.key] * 100).toFixed(
            0
          )}% chance of harassment with ${obj.nodes[1]}`;
          return {
            title,
            handleValueChange: this.handleSliderChange.bind(this, obj.key),
            value: this.state[obj.key],
            min: 0,
            max: 0.25,
            step: 0.01,
            color: COLORS[obj.nodes[0].toUpperCase()],
            minIcon: "smile",
            maxIcon: "frown"
          };
        });
      headerData[0].sliders = [...headerData[0].sliders, ...newSliders];
    }
    const barInfo = [
      {
        title: "Group sizes",
        data: [
          {
            size: blueCount,
            color: COLORS.BLUE,
            tooltipText: `Blue count ${blueCount}`
          },
          {
            size: greenCount,
            color: COLORS.GREEN,
            tooltipText: `Green count ${greenCount}`
          }
        ]
      },
      {
        title: "Comments Overheard by Group",
        data: [
          {
            size: blueShoutsHeardFromGreen.size,
            color: COLORS.BLUE,
            tooltipText: `Harassment heard by blue, coming from green: ${
              blueShoutsHeardFromGreen.size
            }`
          },
          {
            size: greenShoutsHeardFromBlue.size,
            color: COLORS.GREEN,
            tooltipText: `Harassment heard by green, coming from blue: ${
              greenShoutsHeardFromBlue.size
            }`
          }
        ]
      }
    ];
    if (idx === 2) {
      barInfo[1].data = [
        {
          size: blueShoutsHeardFromBlueOnly.size,
          color: darken(0.2, COLORS.BLUE),
          tooltipText: `Harassment heard only by blue, coming from blue: ${
            blueShoutsHeardFromBlueOnly.size
          }`
        },
        ...barInfo[1].data,
        {
          size: greenShoutsHeardFromGreenOnly.size,
          color: darken(0.2, COLORS.GREEN),
          tooltipText: `Harassment heard only by green, coming from green: ${
            greenShoutsHeardFromGreenOnly.size
          }`
        }
      ];
    }
    const bars = playing
      ? barInfo.map((bar, i) => (
          <HorizontalBar data={bar.data} title={bar.title} key={i} />
        ))
      : null;
    const slidersByColor = color =>
      headerData[+playing].sliders.filter(s => s.color === COLORS[color]);
    return (
      <NarrowContainer width="75%">
        {bars}
        <FlexContainer shouldWrap>
          <NarrowContainer width="50%" fullWidthAt="small">
            <SliderGroup data={slidersByColor("GREEN")} />
          </NarrowContainer>
          <NarrowContainer width="50%" fullWidthAt="small">
            <SliderGroup data={slidersByColor("BLUE")} />
          </NarrowContainer>
        </FlexContainer>
        <ButtonGroup data={headerData[+playing].buttons} />
        <ClippedSVG
          width={width}
          height={height}
          padding={padding}
          id={`simulation-${idx}`}
        >
          <HarassmentNodeGroup
            greenCount={greenCount}
            blueCount={blueCount}
            width={width}
            height={height}
            playing={playing}
            paused={paused}
            initialV={initialV}
            handleShout={this.handleShout}
            blueOnBlueProb={blueOnBlueProb}
            greenOnGreenProb={greenOnGreenProb}
            blueOnGreenProb={blueOnGreenProb}
            greenOnBlueProb={greenOnBlueProb}
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
  height: 500,
  padding: 0,
  initialV: 2
};

export default withCaption(HarassmentSimulation);
