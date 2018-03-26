import React, { Component } from "react";
import PropTypes from "prop-types";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { euclideanDistance } from "utils/mathHelpers";
import {
  initializeSimulation,
  generateSimulationNodes,
  updateSimulationNodes
} from "utils/forceSimulationHelpers";
import COLORS from "utils/styles";

class EconomyNodeGroup extends Component {
  componentWillMount() {
    const { width, height, handleCollision } = this.props;
    this.simulation = initializeSimulation(width, height, handleCollision);
    this.generateNodes(this.props);
    this.simulation.on("tick", () => this.updateNodes(this.props));
  }

  generateNodes = props => {
    const { speeds, initialV } = props;
    generateSimulationNodes(this.simulation, speeds.length, initialV);
  };

  updateNodes = props => {
    const { velocityMultiplier, initialV } = props;
    const isMoving = this.props.playing && !this.props.paused;
    const scaledInitialSpeed = initialV * velocityMultiplier;
    const colorScale = scaleLinear()
      .domain([0, scaledInitialSpeed, scaledInitialSpeed * 2])
      .range([COLORS.BLUE, COLORS.MAROON, COLORS.RED]);
    const colorFn = d => colorScale(euclideanDistance(d.vx, d.vy));
    updateSimulationNodes(this.simulation, this.g, colorFn, isMoving);
  };

  componentWillUpdate(nextProps) {
    const samePopulation = this.props.speeds.length === nextProps.speeds.length;
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

EconomyNodeGroup.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  speeds: PropTypes.arrayOf(PropTypes.number).isRequired,
  playing: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  velocityMultiplier: PropTypes.number.isRequired,
  handleCollision: PropTypes.func.isRequired,
  initialV: PropTypes.number.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderStroke: PropTypes.string.isRequired
};

EconomyNodeGroup.defaultProps = {
  borderWidth: 3,
  borderStroke: COLORS.GRAY
};

export default EconomyNodeGroup;
