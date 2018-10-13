import React, { Component } from "react";
import PropTypes from "prop-types";

class DraggableCircle extends Component {
  state = {
    dragging: false
  };

  getMousePosition = e => {
    // clientX and clientY need to be normalized
    // see http://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
    let CTM = this.circle.getScreenCTM();
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
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
    const { cx, cy, r } = this.props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        onMouseDown={this.handleDragStart}
        onTouchStart={this.handleDragStart}
        onMouseMove={this.handleDrag}
        onTouchMove={this.handleDrag}
        onMouseUp={this.handleDragEnd}
        onMouseLeave={this.handleDragEnd}
        onTouchCancel={this.handleDragEnd}
        onTouchEnd={this.handleDragEnd}
        ref={circle => (this.circle = circle)}
      />
    );
  }
}

DraggableCircle.propTypes = {
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

DraggableCircle.defaultProps = {
  cx: 0,
  cy: 0,
  r: 8
};

export default DraggableCircle;
