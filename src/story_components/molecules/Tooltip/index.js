import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { rhythm } from "utils/typography";

const StyledTooltip = styled.div.attrs(({ visible, x, y, offsetWidth }) => ({
  style: {
    display: visible ? "block" : "none",
    left: `${Math.max(x - offsetWidth / 2, 0)}px`,
    top: `${y}px`,
    width: x > offsetWidth / 2 ? "auto" : `${2 * x}px`
  }
}))`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  pointer-events: none;
  padding: ${rhythm(0.5)};
  border-radius: ${rhythm(0.25)};
  z-index: 100;

  &:after {
    top: 100%;
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    border-top-color: rgba(0, 0, 0, 0.6);
    border-width: ${rhythm(0.3)};
    margin-left: -${rhythm(0.3)};
  }

  h4 {
    text-align: center;
    margin-bottom: ${rhythm(0.4)};
  }

  ul {
    margin-left: ${rhythm(0.5)};
    margin-bottom: 0;
  }

  ul > li {
    margin-bottom: 0;
    line-height: ${rhythm(0.6)};
  }
`;

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetWidth: 0,
      offsetHeight: 0
    };
    this.tooltipDiv = React.createRef();
  }

  componentDidUpdate() {
    const { offsetWidth, offsetHeight } = this.tooltipDiv.current;
    const { offsetWidth: stateWidth, offsetHeight: stateHeight } = this.state;
    const distance =
      Math.abs(offsetWidth - stateWidth) + Math.abs(offsetHeight - stateHeight);
    if (distance > 2) {
      this.setState({ offsetWidth, offsetHeight });
    }
  }

  render() {
    const { visible, x, y, title, body } = this.props;
    const { offsetWidth, offsetHeight } = this.state;
    const titleHTML = title ? <h4>{title}</h4> : null;
    const bodyHTML = Array.isArray(body) ? (
      <ul>
        {body.map((text, i) => (
          <li key={i}>
            <small>{text}</small>
          </li>
        ))}
      </ul>
    ) : (
      <small>{body}</small>
    );
    return (
      <StyledTooltip
        visible={visible}
        x={x}
        y={y - offsetHeight - 20}
        offsetWidth={offsetWidth}
        ref={this.tooltipDiv}
      >
        {titleHTML}
        {bodyHTML}
      </StyledTooltip>
    );
  }
}

Tooltip.propTypes = {
  visible: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired
};

Tooltip.defaultProps = {
  visible: false,
  x: 0,
  y: 0,
  title: "",
  body: ""
};

export default Tooltip;
