import React, { Component } from "react";
import PropTypes from "prop-types";
import { NarrowContainer, StyledSelect } from "story_components";
import { selectType } from "utils/types";

class SelectProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOptions: props.options.map(d => d[props.initialIndex])
    };
    this.handleOptionFns = props.options.map((_, i) =>
      this.handleOptionChange.bind(this, i)
    );
  }

  handleOptionChange = (selectIdx, newOption) => {
    this.setState(st => {
      const currentOptionsCopy = [...st.currentOptions];
      currentOptionsCopy[selectIdx] = newOption;
      return { currentOptions: currentOptionsCopy };
    });
  };

  render() {
    const { fullWidthAt, margin, options, render, width } = this.props;
    const { currentOptions } = this.state;
    return (
      <NarrowContainer width={width} fullWidthAt={fullWidthAt}>
        <React.Fragment>
          {options.map((optionsArr, idx) => {
            const option = currentOptions[idx];
            return (
              <StyledSelect
                {...option}
                isSearchable
                margin={margin}
                placeholder={option.label}
                onChange={this.handleOptionFns[idx]}
                options={optionsArr}
                key={`${option.value}|${option.label}`}
              />
            );
          })}
          {render(currentOptions)}
        </React.Fragment>
      </NarrowContainer>
    );
  }
}

SelectProvider.propTypes = {
  fullWidthAt: PropTypes.string.isRequired,
  initialIndex: PropTypes.number.isRequired,
  margin: PropTypes.string.isRequired,
  options: selectType,
  render: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

SelectProvider.defaultProps = {
  fullWidthAt: "small",
  initialIndex: 0,
  margin: "0.75rem 0 0 0",
  options: [],
  render: function(...args) {
    console.log("Please implement a render!");
    console.log("Here are the render args: ", args);
  },
  width: "70%"
};

export default SelectProvider;
