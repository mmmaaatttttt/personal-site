import React, { Component } from "react";
import PropTypes from "prop-types";
import { select } from "d3-selection";
import { euclideanDistance } from "utils/mathHelpers";
import {
  initializeSimulation,
  generateSimulationNodes,
  updateSimulationNodes
} from "utils/forceSimulationHelpers";
import COLORS from "utils/styles";

class HarassmentNodeGroup extends Component {
  componentWillMount() {
    const { width, height } = this.props;
    this.simulation = initializeSimulation(width, height);
    this.generateNodes(this.props);
    this.simulation.on("tick", () => this.updateNodes(this.props));
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
    const isMoving = this.props.playing && !this.props.paused;
    const scaledInitialSpeed = initialV * velocityMultiplier;
    const colorFn = d => d.properties.color;
    updateSimulationNodes(this.simulation, this.g, colorFn, isMoving);
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
