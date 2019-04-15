import PropTypes from "prop-types";

const sliderDataType = PropTypes.arrayOf(
  PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
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

export { sliderDataType };
