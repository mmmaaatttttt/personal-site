import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Slider from "rc-slider";
import { darken } from "polished";

const darkerMain = props => darken(0.2, props.activeColor);
const totalHeight = s => props => (props.height + 2 * props.padding) * s;

const StyledSlider = styled(Slider)`
  position: relative;
  height: ${totalHeight(1)}px;
  padding: ${props => props.padding}px 0;
  width: 100%;
  border-radius: ${totalHeight(1)}px;
  -ms-touch-action: none;
  touch-action: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  justify-content: space-between;

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider-rail {
    position: absolute;
    width: 100%;
    background-color: ${props => props.inactiveColor};
    height: ${props => props.height}px;
    border-radius: ${totalHeight(1)}px;
  }

  .rc-slider-track {
    position: absolute;
    left: 0;
    height: ${props => props.height}px;
    border-radius: ${totalHeight(1)}px;
    background-color: ${props => props.activeColor};
  }

  .rc-slider-handle {
    position: absolute;
    margin-left: -${totalHeight(1 / 2)}px;
    margin-top: -${props => props.padding}px;
    width: ${totalHeight(1)}px;
    height: ${totalHeight(1)}px;
    cursor: pointer;
    cursor: grab;
    border-radius: 50%;
    border: solid ${props => props.padding * 0.75}px
      ${props => props.activeColor};
    background-color: ${darkerMain};
    touch-action: pan-x;
    transition: border-width 0.5s;
    z-index: 100;
  }

  .rc-slider-handle:hover {
    border-width: 0;
  }

  .rc-slider-handle:active {
    border-width: 0;
    border-color: ${darkerMain};
    box-shadow: 0 0 ${props => props.padding}px ${darkerMain};
    cursor: grabbing;
  }

  .rc-slider-handle:focus {
    border-width: 0;
    border-color: ${darkerMain};
    box-shadow: 0 0 0 ${props => props.padding}px ${darkerMain};
    outline: none;
  }
`;

StyledSlider.propTypes = {
  activeColor: PropTypes.string.isRequired,
  inactiveColor: PropTypes.string.isRequired
};

StyledSlider.defaultProps = {
  activeColor: "#abe2fb",
  inactiveColor: "#e9e9e9"
};

export default StyledSlider;
