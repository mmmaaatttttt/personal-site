import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";

const sliderType = PropTypes.arrayOf(
  PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number,
    initialValue: PropTypes.number.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    color: PropTypes.string,
    sliderHeight: PropTypes.number,
    sliderPadding: PropTypes.number,
    tickCount: PropTypes.number,
    minIcon: PropTypes.string,
    maxIcon: PropTypes.string,
    fadeIcons: PropTypes.bool
  })
);

const selectType = PropTypes.arrayOf(
  PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.func,
      format: PropTypes.string,
      colors: PropTypes.arrayOf(PropTypes.string),
      otherOptions: PropTypes.object
    })
  )
).isRequired;

const svgProps = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
}

const svgDefaultProps = {
  width: 600,
  height: 600,
  xScale: scaleLinear()
    .domain([-10, 10])
    .range([0, 600]),
  yScale: scaleLinear()
    .domain([-10, 10])
    .range([600, 0])
}

export { sliderType, selectType, svgProps, svgDefaultProps };
