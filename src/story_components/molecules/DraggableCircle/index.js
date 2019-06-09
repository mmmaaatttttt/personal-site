import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import COLORS from "utils/styles";

const NoScrollCircle = styled.circle`
  touch-action: none;
  transition: stroke-width 300ms;

  &:hover {
    fill: ${props => props.stroke};
    stroke-width: ${props => props.r * 1.5};
    cursor: pointer;
  }
`;

class DraggableCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false
    };
    this.circle = React.createRef()
  }

  getMousePosition = e => {
    // clientX and clientY need to be normalized
    // see http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    let CTM = this.circle.current.getScreenCTM();
    let clientX, clientY;
    try {
      // try touch event first
      clientX = e.touches[0];
      clientY = e.touches[1];
    } catch (err) {
      // no go, assume mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  };

  handleDragStart = () => {
    this.setState({ dragging: true }, this.props.onDragStart);
  };

  handleDrag = e => {
    if (this.state.dragging) {
      let coords = this.getMousePosition(e);
      this.props.onDrag(coords);
    }
  };

  handleDragEnd = () => {
    this.setState({ dragging: false }, this.props.onDragEnd);
  };

  render() {
    const { cx, cy, r, fill, stroke, strokeWidth } = this.props;
    const { hovering } = this.state;
    return (
      <NoScrollCircle
        cx={cx}
        cy={cy}
        fill={fill}
        r={r}
        hovering={hovering}
        stroke={stroke}
        strokeWidth={strokeWidth}
        onMouseDown={this.handleDragStart}
        onTouchStart={this.handleDragStart}
        onMouseMove={this.handleDrag}
        onTouchMove={this.handleDrag}
        onMouseUp={this.handleDragEnd}
        onMouseLeave={this.handleDragEnd}
        onTouchCancel={this.handleDragEnd}
        onTouchEnd={this.handleDragEnd}
        ref={this.circle}
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
  r: 8,
  fill: COLORS.BLACK,
  stroke: COLORS.BLACK,
  strokeWidth: 0
};

export default DraggableCircle;
