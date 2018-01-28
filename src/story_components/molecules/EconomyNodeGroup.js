import React, { Component } from "react";
import PropTypes from "prop-types";
import { forceSimulation } from "d3-force";
import { forceBounce } from "d3-force-bounce";
import { forceSurface } from "d3-force-surface";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { euclideanDistance } from "../../utils/mathHelpers";
import COLORS from "../../utils/styles";

class EconomyNodeGroup extends Component {
  componentWillMount() {
    const { width, height, handleCollision } = this.props;
    this.simulation = forceSimulation()
      .alphaDecay(0)
      .velocityDecay(0)
      .force(
        "bounce",
        forceBounce()
          .radius(node => node.r)
          .onImpact(handleCollision)
      )
      .force(
        "surface",
        forceSurface()
          .surfaces([
            {
              from: { x: 0, y: 0 },
              to: { x: 0, y: height }
            },
            {
              from: { x: 0, y: height },
              to: { x: width, y: height }
            },
            {
              from: { x: width, y: height },
              to: { x: width, y: 0 }
            },
            {
              from: { x: width, y: 0 },
              to: { x: 0, y: 0 }
            }
          ])
          .oneWay(true)
          .radius(node => node.r)
      );

    this.simulation
      .nodes(this.generateNodes(this.props))
      .on("tick", () => this.updateNodes(this.props));
  }

  componentWillUpdate(nextProps) {
    const samePopulation = this.props.speeds.length === nextProps.speeds.length;
    const sameMultiplier =
      this.props.velocityMultiplier === nextProps.velocityMultiplier;
    const resetting =
      (this.props.playing || this.props.paused) && !nextProps.playing;

    if (!samePopulation) {
      this.simulation.nodes(this.generateNodes(nextProps));
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
      this.simulation.nodes(this.generateNodes(nextProps));
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

  generateNodes = props => {
    const { width, height, speeds } = props;
    const { cos, sin, PI, random } = Math;
    const r = 15;
    const currentNodes = this.simulation.nodes();
    if (speeds.length < currentNodes.length)
      return currentNodes.slice(0, speeds.length);
    const newNodes = [...currentNodes];
    while (newNodes.length < speeds.length) {
      const i = newNodes.length;
      const theta = 2 * PI * random();
      const vx = speeds[i] * cos(theta);
      const vy = speeds[i] * sin(theta);
      let x, y;
      // ensure that nodes don't intersect
      // not optimal, but there aren't many nodes
      do {
        x = random() * (width - 2 * r) + r;
        y = random() * (height - 2 * r) + r;
      } while (
        newNodes.some(
          node => (node.x - x) ** 2 + (node.y - y) ** 2 < (3 * r) ** 2
        )
      );
      const node = { i, x, y, vx, vy, r };
      newNodes.push(node);
    }
    return newNodes;
  };

  updateNodes = props => {
    const { speeds, velocityMultiplier, initialV } = props;
    const isMoving = this.isMoving();
    this.simulation.nodes().forEach(node => {
      if (isMoving) {
        node.fx = null;
        node.fy = null;
        node.vx = node.vx || node.lastVx;
        node.vy = node.vy || node.lastVy;
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

    nodes
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => colorScale(euclideanDistance(d.vx, d.vy)))
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    if (isMoving) {
      nodes
        .attr("fill", d => colorScale(euclideanDistance(d.vx, d.vy)))
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
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
  borderWidth: PropTypes.number.isRequired,
  borderStroke: PropTypes.string.isRequired
};

EconomyNodeGroup.defaultProps = {
  borderWidth: 3,
  borderStroke: COLORS.NAV_BORDER
};

export default EconomyNodeGroup;
