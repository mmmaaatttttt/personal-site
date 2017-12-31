import React, { Component } from "react";
import PropTypes from "prop-types";
import COLORS from "../../utils/styles";
import NodeGroup from "react-move/NodeGroup";

class EconomyForceGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traders: null
    };
  }

  render() {
    const { cx, cy, people, playing, paused } = this.props;
    const radius = cx * 0.7;
    return (
      <NodeGroup
        data={Array.from({ length: people }, (_, i) => ({ id: i }))}
        keyAccessor={(_, i) => i}
        start={() => ({
          theta: 0,
          color: COLORS.MAROON,
          money: 10
        })}
        enter={(_, i) => ({
          theta: [(people - i) * 2 * Math.PI / people],
          timing: { duration: 300 }
        })}
        update={(_, i) => ({
          theta: [(people - i) * 2 * Math.PI / people],
          timing: { duration: 300 }
        })}
        leave={(_, i) => ({
          theta: [0],
          timing: { duration: 300 }
        })}
      >
        {nodes => (
          <g>
            {nodes.map(({ key, state: { theta, money, color } }) => (
              <circle
                key={key}
                cx={cx + Math.cos(theta) * radius}
                cy={cy + Math.sin(theta) * radius}
                fill={color}
                r={money}
              />
            ))}
          </g>
        )}
      </NodeGroup>
    );
  }
}

EconomyForceGraph.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  people: PropTypes.number.isRequired
};

export default EconomyForceGraph;
