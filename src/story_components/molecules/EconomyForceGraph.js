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
  constructor(props) {
    super(props);
    this.state = {
      nodes: Array.from({ length: this.props.people }, (_, i) => ({
        id: i,
        money: 10,
        cx: this.props.cx,
        cy: this.props.cy
      }))
    };
    this.handleTick = this.handleTick.bind(this);
  }

  componentDidMount() {
    const { cx, cy } = this.props;
    this.simulation = forceSimulation()
      .force("charge", forceManyBody())
      .force("center", forceCenter(cx, cy));

    this.simulation
      .nodes(this.state.nodes.map(node => ({ ...node })))
      .on("tick", this.handleTick);
  }

  handleTick() {
    const nodes = this.state.nodes.map((node, i) => ({
      ...node,
      cx: this.simulation.nodes()[i].x,
      cy: this.simulation.nodes()[i].y
    }));
    this.setState({ nodes });
  }

  render() {
    const circles = this.state.nodes.map((node, i) => (
      <circle
        key={i}
        cx={node.cx}
        cy={node.cy}
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
