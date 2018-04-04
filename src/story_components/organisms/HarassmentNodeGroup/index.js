import React, { Component } from "react";
import PropTypes from "prop-types";
import { select, selectAll } from "d3-selection";
import { transition } from "d3-transition";
import { interval } from "d3-timer";
import { euclideanDistance } from "utils/mathHelpers";
import {
  initializeSimulation,
  generateSimulationNodes,
  updateSimulationNodes
} from "utils/forceSimulationHelpers";
import COLORS from "utils/styles";

class HarassmentNodeGroup extends Component {
  state = { shoutCount: 0 };

  componentWillMount() {
    const { width, height } = this.props;
    this.simulation = initializeSimulation(width, height, this.handleCollision);
    this.generateNodes(this.props);
    this.simulation.on("tick", () => this.updateNodes(this.props));
    // DELETE THIS
    this.shoutsHeard = {
      [COLORS.BLUE]: new Set(),
      [COLORS.MAROON]: new Set()
    };
  }

  generateNodes = props => {
    const { blueCount, brownCount, initialV } = props;
    const { BLUE, MAROON } = COLORS;
    const blueArr = Array.from({ length: blueCount }, (_, i) => ({
      key: `${BLUE}-${i}`,
      properties: {
        color: BLUE
      }
    }));
    const brownArr = Array.from({ length: brownCount }, (_, i) => ({
      key: `${MAROON}-${i}`,
      properties: {
        color: MAROON
      }
    }));
    generateSimulationNodes(
      this.simulation,
      blueArr.concat(brownArr),
      initialV
    );
  };

  updateNodes = props => {
    const { velocityMultiplier, initialV, blueCount } = props;
    const scaledInitialSpeed = initialV * velocityMultiplier;
    const colorFn = d => d.properties.color;
    updateSimulationNodes(this.simulation, this.g, colorFn, this.isMoving());
    let test = Math.random();
    this.__checkIntersections();
  };

  isMoving = () => {
    return this.props.playing && !this.props.paused;
  };

  handleCollision = (...nodes) => {
    const sameColor = nodes[0].properties.color === nodes[1].properties.color;
    if (sameColor && this.isMoving()) {
      nodes.forEach(node => {
        let test = Math.random();
        if (test < 0.1) {
          this.setState(
            { shoutCount: this.state.shoutCount + 1 },
            this.__generateWave(node)
          );
        }
      });
    }
  };

  __checkIntersections = () => {
    selectAll(".shout").each((d, i, hmm) => {
      const color = d.nodeKey.split("-")[0];
      const waveCircle = select(hmm[i]);
      const waveX = +waveCircle.attr("cx");
      const waveY = +waveCircle.attr("cy");
      const waveR = +waveCircle.attr("r");
      this.simulation.nodes().forEach(node => {
        const nodeColor = node.properties.color;
        const { x, y, r } = node;
        const waveDistance = euclideanDistance(x - waveX, y - waveY);
        if (nodeColor !== color && waveDistance < r + waveR) {
          // DELETE THIS
          const blueSize = this.shoutsHeard[COLORS.BLUE].size;
          const brownSize = this.shoutsHeard[COLORS.MAROON].size;
          // this.shoutsHeard[nodeColor].add(`${node.key}:${d.shoutCount}`);
          this.shoutsHeard[nodeColor].add(d.shoutCount);
          if (
            this.shoutsHeard[COLORS.BLUE].size > blueSize ||
            this.shoutsHeard[COLORS.MAROON].size > brownSize
          ) {
            // console.log("BLUE RECEIVED", this.shoutsHeard[COLORS.BLUE].size);
            // console.log("BROWN RECEIVED", this.shoutsHeard[COLORS.MAROON].size);
            console.log(
              // "RATIO",
              this.shoutsHeard[COLORS.BLUE].size /
                (this.shoutsHeard[COLORS.MAROON].size || 1)
            );
          }
        }
      }, this);
    });
  };

  __generateWave = node => {
    const { shoutCount } = this.state;
    const soundWave = interval(() => {
      soundWave.__calledCount++;
      if (soundWave.__calledCount <= 5) {
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
          .datum({ shoutCount, nodeKey: node.key })
        .transition()
          .duration(2000)
          .ease(Math.sqrt)
          .attr("r", node.r * 10)
          .style("stroke-opacity", 1e-6)
          .style("fill-opacity", 1e-6)
          .remove();
      } else {
        soundWave.stop();
      }
    }, 200);
    soundWave.__calledCount = 0;
  };

  componentWillUpdate(nextProps) {
    const samePopulation =
      this.props.blueCount === nextProps.blueCount &&
      this.props.brownCount === nextProps.brownCount;
    const sameMultiplier =
      this.props.velocityMultiplier === nextProps.velocityMultiplier;
    const resetting =
      (this.props.playing || this.props.paused) && !nextProps.playing;

    if (!samePopulation) {
      this.generateNodes(nextProps);
    }

    if (!sameMultiplier) {
      this.simulation.nodes().forEach(node => {
        ["vx", "vy", "lastVx", "lastVy"].forEach(key => {
          node[key] = node[key]
            ? node[key] *
              nextProps.velocityMultiplier /
              this.props.velocityMultiplier
            : node[key];
        });
      });
    }

    if (resetting) {
      this.clearNodes();
      this.generateNodes(nextProps);
      this.updateNodes(nextProps);
    }
  }

  clearNodes = () => {
    this.simulation.nodes([]);
    select(this.g)
      .selectAll("circle")
      .data([])
      .exit()
      .remove();
  };

  render() {
    const { borderWidth, borderStroke, width, height } = this.props;
    return (
      <g>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={borderStroke}
          strokeWidth={borderWidth}
          fill="none"
        />
        <g ref={g => (this.g = g)} />
      </g>
    );
  }
}

HarassmentNodeGroup.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  brownCount: PropTypes.number.isRequired,
  blueCount: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  velocityMultiplier: PropTypes.number.isRequired,
  initialV: PropTypes.number.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderStroke: PropTypes.string.isRequired
};

HarassmentNodeGroup.defaultProps = {
  borderWidth: 3,
  borderStroke: COLORS.GRAY
};

export default HarassmentNodeGroup;
