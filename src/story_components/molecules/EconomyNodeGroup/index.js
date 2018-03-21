import React, { Component } from "react";
import PropTypes from "prop-types";
import { darken } from "polished";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { euclideanDistance } from "utils/mathHelpers";
import {
  initializeSimulation,
  generateSimulationNodes
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

  isMoving() {
    return this.props.playing && !this.props.paused;
  }

  clearNodes = () => {
    this.simulation.nodes([]);
    select(this.g)
      .selectAll("circle")
      .data([])
      .exit()
      .remove();
  };

  updateNodes = props => {
    const { velocityMultiplier, initialV } = props;
    const isMoving = this.isMoving();
    this.simulation.nodes().forEach(node => {
      if (isMoving) {
        node.fx = null;
        node.fy = null;
        node.vx = node.vx || node.lastVx || 0;
        node.vy = node.vy || node.lastVy || 0;
        node.lastVx = null;
        node.lastVy = null;
      } else {
        node.lastVx = node.lastVx || node.vx;
        node.lastVy = node.lastVy || node.vy;
        node.fx = node.x;
        node.fy = node.y;
      }
    });

    const scaledInitialSpeed = initialV * velocityMultiplier;
    const colorScale = scaleLinear()
      .domain([0, scaledInitialSpeed, scaledInitialSpeed * 2])
      .range([COLORS.BLUE, COLORS.MAROON, COLORS.RED]);

    let nodes = select(this.g)
      .selectAll("circle")
      .data(this.simulation.nodes().map(this.forceInCanvas));

    nodes.exit().remove();

    const enterNodes = nodes
      .enter()
      .append("circle")
      .attr("r", d => d.r);

    const nodesToUpdate = isMoving ? enterNodes.merge(nodes) : enterNodes;

    nodesToUpdate
      .attr("fill", d => colorScale(euclideanDistance(d.vx, d.vy)))
      .attr("stroke", d =>
        darken(0.3, colorScale(euclideanDistance(d.vx, d.vy)))
      )
      .attr("stroke-width", 2)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  };

  forceInCanvas = node => {
    const { max, min } = Math;
    const { width, height } = this.props;
    node.x = max(node.r, min(width - node.r, node.x));
    node.y = max(node.r, min(height - node.r, node.y));
    return node;
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
  borderStroke: COLORS.NAV_BORDER
};

export default EconomyNodeGroup;
