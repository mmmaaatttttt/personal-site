import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Slider from "rc-slider";
import { darken } from "polished";

const darkerMain = props => darken(0.2, props.mainColor);
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

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .rc-slider-rail {
    position: absolute;
    width: 100%;
    background-color: #e9e9e9;
    height: ${props => props.height}px;
    border-radius: ${totalHeight(1)}px;
  }

  .rc-slider-track {
    position: absolute;
    left: 0;
    height: ${props => props.height}px;
    border-radius: ${totalHeight(1)}px;
    background-color: ${props => props.mainColor};
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
    border: solid ${props => props.padding * 0.75}px ${props => props.mainColor};
    background-color: ${darkerMain};
    touch-action: pan-x;
    transition: border-width 0.5s;
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

  .rc-slider-mark {
    position: absolute;
    top: 18px;
    left: 0;
    width: 100%;
    font-size: 12px;
  }

  .rc-slider-mark-text {
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
    color: #999;
  }

  .rc-slider-mark-text-active {
    color: #666;
  }

  .rc-slider-step {
    position: absolute;
    width: 100%;
    height: ${props => props.height}px;
    background: transparent;
  }
`;

StyledSlider.propTypes = {
  mainColor: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

StyledSlider.defaultProps = {
  mainColor: "#abe2fb",
  height: 6,
  padding: 10
};

export default StyledSlider;
