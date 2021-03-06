import React, { Component } from "react";
import PropTypes from "prop-types";
import { select } from "d3-selection";
import { easeCubicOut } from "d3-ease";
import { interval } from "d3-timer";
import "d3-transition"; // needed in order to call .transition on a selection
import { euclideanDistance } from "utils/mathHelpers";
import {
  initializeSimulation,
  generateSimulationNodes,
  updateSimulationNodes,
  colorNodes
} from "utils/forceSimulationHelpers";
import COLORS from "utils/styles";
import { SVGBorder } from "story_components";

class HarassmentNodeGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { shoutCount: 0 };
    const { width, height } = props;
    this.simulation = initializeSimulation(width, height, this.handleCollision);
    this.generateNodes(props);
    this.simulation.on("tick", this.updateNodes);
  }

  componentWillUpdate(nextProps) {
    const samePopulation =
      this.props.blueCount === nextProps.blueCount &&
      this.props.greenCount === nextProps.greenCount;
    const resetting =
      (this.props.playing || this.props.paused) && !nextProps.playing;

    if (!samePopulation) {
      this.generateNodes(nextProps);
    }

    if (resetting) {
      this.clearNodes();
      this.generateNodes(nextProps);
      this.updateNodes();
    }
  }

  componentWillUnmount() {
    this.clearNodes();
    this.simulation.on("tick", null);
    this.simulation.stop();
  }

  generateNodes = props => {
    const { blueCount, greenCount, initialV } = props;
    const { BLUE, GREEN } = COLORS;
    const blueArr = Array.from({ length: blueCount }, (_, i) => ({
      key: `${BLUE}-${i}`,
      properties: {
        color: BLUE
      }
    }));
    const greenArr = Array.from({ length: greenCount }, (_, i) => ({
      key: `${GREEN}-${i}`,
      properties: {
        color: GREEN
      }
    }));
    generateSimulationNodes(
      this.simulation,
      blueArr.concat(greenArr),
      initialV
    );
  };

  updateNodes = () => {
    const colorFn = d => d.properties.color;
    const isMoving = this.isMoving();
    updateSimulationNodes(this.simulation, this.g, colorFn, isMoving);
    if (isMoving) this.__checkIntersections();
  };

  isMoving = () => {
    return this.props.playing && !this.props.paused;
  };

  handleCollision = (...nodes) => {
    if (this.isMoving()) {
      const {
        blueOnBlueProb: bb,
        greenOnGreenProb: gg,
        blueOnGreenProb: bg,
        greenOnBlueProb: gb
      } = this.props;
      const { BLUE, GREEN } = COLORS;
      const probabilities = {
        [`${BLUE}:${BLUE}`]: [bb, bb],
        [`${BLUE}:${GREEN}`]: [bg, gb],
        [`${GREEN}:${BLUE}`]: [gb, bg],
        [`${GREEN}:${GREEN}`]: [gg, gg]
      };
      const nodeColors = nodes.map(node => node.properties.color).join(":");
      const probability = probabilities[nodeColors];
      nodes.forEach((node, i) => {
        if (Math.random() < probability[i]) {
          this.setState(
            prevState => ({ shoutCount: prevState.shoutCount + 1 }),
            this.__generateWave(node)
          );
        }
      });
    }
  };

  __checkIntersections = () => {
    const { handleShout } = this.props;
    const nodeSelection = select(this.g).selectAll(".node");
    select(this.g)
      .selectAll(".shout")
      .each((d, i, shouts) => {
        const color = d.nodeKey.split("-")[0];
        const waveCircle = select(shouts[i]);
        const waveX = +waveCircle.attr("cx");
        const waveY = +waveCircle.attr("cy");
        const waveR = +waveCircle.attr("r");
        nodeSelection.each(function(nodeData) {
          const nodeColor = nodeData.properties.color;
          const { x, y, r } = nodeData;
          const waveDistance = euclideanDistance(x - waveX, y - waveY);
          if (nodeColor !== color && waveDistance < r + waveR) {
            const node = select(this);
            colorNodes(
              colorNodes(node.transition(), COLORS.RED)
                .duration(0)
                .transition()
                .duration(500)
                .ease(easeCubicOut),
              nodeData.properties.color
            );
            const key =
              nodeColor === COLORS.BLUE
                ? "blueShoutsHeardFromGreen"
                : "greenShoutsHeardFromBlue";
            handleShout(key, d.shoutCount);
          }
        }, this);
      });
  };

  __generateWave = node => {
    const { shoutCount } = this.state;
    const { handleShout } = this.props;
    const soundWave = interval(() => {
      const waveCount = 5;
      soundWave.__calledCount++;
      if (soundWave.__calledCount <= waveCount && this.isMoving()) {
        // prettier-ignore
        select(this.g)
          .insert("circle", "circle")
          .attr("cx", node.x)
          .attr("cy", node.y)
          .attr("r", node.r * 2)
          .attr("fill", COLORS.RED)
          .attr("fill-opacity", 0.75)
          .attr("stroke", COLORS.RED)
          .classed("shout", true)
          .datum({ shoutCount, nodeKey: node.key, idx: soundWave.__calledCount })
        .transition()
          .duration(2000)
          .ease(Math.sqrt)
        .attr("r", node.r * 8)
          .style("stroke-opacity", 1e-6)
          .style("fill-opacity", 1e-6)
          .on("end", d => {
              const color = d.nodeKey.split("-")[0];
              const key = 
                color === COLORS.BLUE 
                  ? "blueShoutsHeardFromBlueOnly"
                  : "greenShoutsHeardFromGreenOnly";
              handleShout(key, d.shoutCount);
          })
          .remove();
      } else {
        soundWave.stop();
      }
    }, 200);
    soundWave.__calledCount = 0;
  };

  clearNodes = () => {
    this.simulation.nodes([]);
    select(this.g)
      .selectAll("circle")
      .data([])
      .exit()
      .remove();
  };

  render() {
    const { width, height } = this.props;
    return (
      <g>
        <SVGBorder width={width} height={height} />
        <g ref={g => (this.g = g)} />
      </g>
    );
  }
}

HarassmentNodeGroup.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  greenCount: PropTypes.number.isRequired,
  blueCount: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  initialV: PropTypes.number.isRequired,
  handleShout: PropTypes.func.isRequired,
  blueOnBlueProb: PropTypes.number.isRequired,
  greenOnGreenProb: PropTypes.number.isRequired,
  blueOnGreenProb: PropTypes.number.isRequired,
  greenOnBlueProb: PropTypes.number.isRequired
};

HarassmentNodeGroup.defaultProps = {};

export default HarassmentNodeGroup;
