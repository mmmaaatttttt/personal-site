import PropTypes from "prop-types";

const paddingType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })
]).isRequired;

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
};

const svgDefaultProps = {
  width: 600,
  height: 600
};

export { paddingType, sliderType, selectType, svgProps, svgDefaultProps };
