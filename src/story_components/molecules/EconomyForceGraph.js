import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter
} from "d3-force";
import { select } from "d3-selection";
import COLORS from "../../utils/styles";

class EconomyForceGraph extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.playing && !this.props.playing) {
      const { cx, cy, people } = this.props;
      this.simulation = forceSimulation()
        .force("charge", forceManyBody())
        .force("center", forceCenter(cx, cy));

      this.simulation
        .nodes(this.generateNodes(cx, cy, people))
        .on("tick", this.forceUpdate.bind(this));
    }
  }

  generateNodes(cx, cy, people) {
    return Array.from({ length: people }, (_, i) => ({
      id: i,
      money: 10,
      cx: cx + Math.cos(i * 2 * Math.PI / people) * cx / 2,
      cy: cy + Math.sin(i * 2 * Math.PI / people) * cy / 2
    }));
  }

  render() {
    const { cx, cy, people, playing, paused } = this.props;

    // check if there's a simulation first, base coordinates off simulation if it exists
    const nodes = this.simulation
      ? this.simulation.nodes()
      : this.generateNodes(cx, cy, people);

    const circles = nodes.map((node, i) => (
      <circle
        key={i}
        cx={node.x || node.cx}
        cy={node.y || node.cy}
        r={node.money}
        fill={COLORS.MAROON}
      />
    ));
    return <g>{circles}</g>;
  }
}

EconomyForceGraph.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  people: PropTypes.number.isRequired
};

export default EconomyForceGraph;
