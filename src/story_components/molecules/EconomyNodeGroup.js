import React, { Component } from "react";
import PropTypes from "prop-types";
import { forceSimulation } from "d3-force";
import { forceBounce } from "d3-force-bounce";
import { forceSurface } from "d3-force-surface";
import { select } from "d3-selection";
import COLORS from "../../utils/styles";

class EconomyNodeGroup extends Component {
  componentWillMount() {
    const { width, height, people } = this.props;
    this.simulation = forceSimulation()
      .alphaDecay(0)
      .velocityDecay(0)
      .force("bounce", forceBounce().radius(node => node.r))
      .force(
        "surface",
        forceSurface()
          .surfaces([
            { from: { x: 0, y: 0 }, to: { x: 0, y: height } },
            { from: { x: 0, y: height }, to: { x: width, y: height } },
            { from: { x: width, y: height }, to: { x: width, y: 0 } },
            { from: { x: width, y: 0 }, to: { x: 0, y: 0 } }
          ])
          .oneWay(true)
          .radius(node => node.r)
      );

    this.simulation
      .nodes(this.generateNodes(this.props))
      .on("tick", this.updateNodes);
  }

  componentWillUpdate(nextProps) {
    this.simulation.nodes(this.generateNodes(nextProps));
  }

  generateNodes(props) {
    const { width, height, people, playing, paused } = props;
    const { cos, sin, PI, random } = Math;
    const velocity = 10;
    const r = 10;
    const currentNodes = this.simulation.nodes();
    if (people < currentNodes.length) return currentNodes.slice(0, people);
    const newNodes = [...currentNodes];
    while (newNodes.length < people) {
      const theta = 2 * PI * random();
      const vx = velocity * cos(theta);
      const vy = velocity * sin(theta);
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
      const node = { x, y, vx, vy, r };
      newNodes.push(node);
    }
    return newNodes;
  }

  updateNodes = () => {
    const { playing, paused } = this.props;
    const shouldMove = playing && !paused;
    this.simulation.nodes().forEach(node => {
      if (shouldMove) {
        node.fx = null;
        node.fy = null;
        node.vx = node.vx || node.lastVx;
        node.vy = node.vy || node.lastVy;
        node.lastVx = null;
        node.lastVy = null;
        this.simulation.restart();
      } else {
        node.lastVx = node.lastVx || node.vx;
        node.lastVy = node.lastVy || node.vy;
        node.fx = node.x;
        node.fy = node.y;
      }
    });
    console.log(this.simulation.nodes()[0]);

    let nodes = select(this.g)
      .selectAll("circle")
      .data(this.simulation.nodes().map(this.forceInCanvas));

    nodes.exit().remove();

    nodes
      .enter()
      .append("circle")
      .attr("r", d => d.r)
      .attr("fill", COLORS.MAROON)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    if (shouldMove) {
      nodes.attr("cx", d => d.x).attr("cy", d => d.y);
    }

    this.forceUpdate();
  };

  forceInCanvas = node => {
    const { max, min } = Math;
    const { width, height } = this.props;
    node.x = max(node.r, min(width - node.r, node.x));
    node.y = max(node.r, min(height - node.r, node.y));
    return node;
  };

  render() {
    const { people, playing, paused } = this.props;

    const nodes = select(this.g)
      .selectAll("circle")
      .data();

    // look back at this: https://bl.ocks.org/vasturiano/2992bcb530bc2d64519c5b25201492fd
    return <g ref={g => (this.g = g)} />;
  }
}

EconomyNodeGroup.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  people: PropTypes.number.isRequired,
  playing: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired
};

export default EconomyNodeGroup;
