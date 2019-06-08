import PropTypes from "prop-types";

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

export { sliderType, selectType };
