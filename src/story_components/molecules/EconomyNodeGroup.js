import React, { Component } from "react";
import PropTypes from "prop-types";
import COLORS from "../../utils/styles";
import { choices } from "../../utils/mathHelpers";
import NodeGroup from "react-move/NodeGroup";
import { easeBounceOut } from "d3-ease";

class EconomyNodeGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      traders: null,
      tradeAmount: null,
      tradeComplete: false
    };
    this.getRootOfUnity = this.getRootOfUnity.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  getRootOfUnity(idx) {
    const { cx, cy, people } = this.props;
    const pplCount = people.length;
    const radius = cx * 0.7;
    return {
      x: cx + radius * Math.cos((pplCount - idx) * 2 * Math.PI / pplCount),
      y: cy + radius * Math.sin((pplCount - idx) * 2 * Math.PI / pplCount)
    };
  }

  handleUpdate(person, i) {
    console.log("in handleUpdate");
    const { playing, paused, cx, cy, people, totalWealth } = this.props;
    const { traders, tradeAmount, tradeComplete } = this.state;
    const timing = { duration: 300 };
    let { x, y } = this.getRootOfUnity(i);
    let radius = person.money;

    if (traders && traders[0].id === i) {
      timing.duration = 500;
      timing.delay = 500;

      if (!tradeComplete) {
        x = cx - cx / 4;
        y = cy;
      }

      if (tradeAmount && !tradeComplete) {
        radius += tradeAmount;
        console.log("FIRST RADIUS", radius, 0, tradeAmount);
        timing.delay = 200;
        timing.ease = easeBounceOut;
      }

      if (tradeComplete) {
        console.log("SECOND RADIUS", radius, 1);
        timing.delay = 800;
      }
    }

    if (traders && traders[1].id === i) {
      // console.log("STATE", this.state);
      timing.duration = 500;
      timing.delay = 500;

      if (!tradeComplete) {
        // console.log("center!");
        x = cx + cx / 4;
        y = cy;
      }

      if (tradeAmount && !tradeComplete) {
        console.log("RADIUS PRE TRANSFER", radius, 1);
        radius -= tradeAmount;
        console.log("FIRST RADIUS", radius, 1);
        timing.delay = 200;
        timing.ease = easeBounceOut;
      }

      if (tradeComplete) {
        console.log("SECOND RADIUS", radius, 1);
        timing.delay = 800;
      }
    }
    // if (traders && (traders[1].id === i || traders[0].id === i))
    //   console.log(timing);
    return {
      x: [x],
      y: [y],
      timing,
      radius,
      events: {
        end: () => {
          const { traders, tradeAmount, tradeComplete } = this.state;
          const lastIdx = traders ? traders[1].id : people.length - 1;
          const activeVis = playing && !paused && i === lastIdx;
          const shouldMakeTraders = !traders && activeVis;
          const shouldStartTrade = traders && !tradeAmount && activeVis;
          const shouldEndTrade =
            traders && tradeAmount && !tradeComplete && activeVis;
          const shouldRestart =
            traders && tradeAmount && tradeComplete && activeVis;
          if (shouldMakeTraders) {
            console.log("should make traders");
            this.setState({
              traders: choices(people, 2)
            });
          } else if (shouldStartTrade) {
            console.log("should start trade");
            const maxTrade = Math.min(traders[0].money, traders[1].money);
            this.setState({ tradeAmount: Math.random() * maxTrade }, () =>
              this.props.handleTrade(traders, this.state.tradeAmount)
            );
          } else if (shouldEndTrade) {
            console.log("should end trade");
            this.setState({ tradeComplete: true });
          } else if (shouldRestart) {
            console.log("should restart");
            this.setState({
              traders: null,
              tradeAmount: null,
              tradeComplete: false
            });
          }
        }
      }
    };
  }

  render() {
    const { cx, cy, people, totalWealth } = this.props;
    const timing = { duration: 300 };
    return (
      <NodeGroup
        data={[...people]}
        keyAccessor={person => person.id}
        start={person => ({
          ...this.getRootOfUnity(0),
          color: COLORS.MAROON,
          radius: person.money
        })}
        enter={(person, i) => {
          const pplCount = people.length;
          return {
            x: [this.getRootOfUnity(i).x],
            y: [this.getRootOfUnity(i).y],
            radius: person.money,
            timing
          };
        }}
        update={this.handleUpdate}
        leave={person => ({
          x: [this.getRootOfUnity(0).x],
          y: [this.getRootOfUnity(0).y],
          radius: person.money,
          timing
        })}
      >
        {nodes => (
          <g>
            {nodes.map(({ key, state: { x, y, radius, color } }) => (
              <circle
                key={key}
                cx={x}
                cy={y}
                fill={color}
                r={radius}
                stroke="black"
                strokeWidth={1}
              />
            ))}
          </g>
        )}
      </NodeGroup>
    );
  }
}

EconomyNodeGroup.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      money: PropTypes.number.isRequired
    })
  ).isRequired,
  playing: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  handleTrade: PropTypes.func.isRequired
};

export default EconomyNodeGroup;
