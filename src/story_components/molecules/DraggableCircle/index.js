import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import COLORS from "utils/styles";

const NoScrollCircle = styled.circle`
  touch-action: none;

  &:hover {
    fill: ${props => props.stroke};
  }
`;

class DraggableCircle extends Component {
  state = {
    dragging: false,
    hovering: false
  };

  getMousePosition = (type, e) => {
    // clientX and clientY need to be normalized
    // see http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    let CTM = this.circle.getScreenCTM();
    let { clientX, clientY } = type === "mouse" ? e : e.touches[0];
    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  };

  handleDragStart = () => {
    this.setState({ dragging: true }, this.props.onDragStart);
  };

  handleDrag = (type, e) => {
    e.persist();
    this.setState({ hovering: true }, () => {
      if (this.state.dragging) {
        let coords = this.getMousePosition(type, e);
        this.props.onDrag(coords);
      }
      if (type === "touch") {
        try {
          e.preventDefault();
        } catch (err) {
          console.warn(err);
        }
      }
    });
  };

  handleDragEnd = () => {
    this.setState({ dragging: false }, this.props.onDragEnd);
  };

  handleHoverEnd = () => {
    console.log("left")
    this.setState({ dragging: false, hovering: false }, this.props.onDragEnd);
  }

  render() {
    const { cx, cy, r, fill, stroke, strokeWidth } = this.props;
    const { hovering } = this.state;
    return (
      <NoScrollCircle
        cx={cx}
        cy={cy}
        fill={fill}
        r={hovering ? r * 1.5 : r}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseDown={this.handleDragStart}
        onTouchStart={this.handleDragStart}
        onMouseMove={this.handleDrag.bind(this, "mouse")}
        onTouchMove={this.handleDrag.bind(this, "touch")}
        onMouseUp={this.handleDragEnd}
        onMouseLeave={this.handleHoverEnd}
        onTouchCancel={this.handleHoverEnd}
        onTouchEnd={this.handleHoverEnd}
        innerRef={circle => (this.circle = circle)}
      />
    );
  }
}

DraggableCircle.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

DraggableCircle.defaultProps = {
  cx: 0,
  cy: 0,
  r: 10,
  fill: COLORS.BLACK,
  stroke: COLORS.BLACK,
  strokeWidth: 0
};

export default DraggableCircle;
