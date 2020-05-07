import React, { useState, useRef, useEffect } from "react";
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
    margin-bottom: ${props => (props.body ? rhythm(0.4) : 0)};
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

function Tooltip({ body = "", title = "", visible = false, x = 0, y = 0 }) {
  const [offset, setOffset] = useState({ width: 0, height: 0 });
  const tooltipDiv = useRef(null);

  useEffect(() => {
    const { offsetWidth, offsetHeight } = tooltipDiv.current;
    const { width, height } = offset;
    const distance =
      Math.abs(offsetWidth - width) + Math.abs(offsetHeight - height);
    if (distance > 2) setOffset({ width: offsetWidth, height: offsetHeight });
  }, [offset, tooltipDiv, x, y]);

  const { width, height } = offset;
  let titleJSX = null;
  let bodyJSX = null;
  if (title) titleJSX = <h4>{title}</h4>;
  if (body) {
    bodyJSX = Array.isArray(body) ? (
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
  }
  return (
    <StyledTooltip
      visible={visible}
      x={x}
      y={y - height - 20}
      offsetWidth={width}
      ref={tooltipDiv}
    >
      {titleJSX}
      {bodyJSX}
    </StyledTooltip>
  );
}

Tooltip.propTypes = {
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  visible: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number
};

export default Tooltip;
