import React, { Component } from "react";
import PropTypes from "prop-types";
import { NarrowContainer, StyledSelect } from "story_components";
import { selectType } from "utils/types";

class SelectProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOptions: props.options.map(d => d[0])
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
    const { margin, options, render, width } = this.props;
    const { currentOptions } = this.state;
    return (
      <NarrowContainer width={width} fullWidthAt="small">
        <React.Fragment>
          {options.map((optionsArr, idx) => {
            return (
              <StyledSelect
                {...currentOptions[idx]}
                isSearchable
                margin={margin}
                placeholder={currentOptions[idx].label}
                onChange={this.handleOptionFns[idx]}
                options={optionsArr}
                key={currentOptions[idx].value}
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
  margin: PropTypes.string.isRequired,
  options: selectType,
  render: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

SelectProvider.defaultProps = {
  fullWidthAt: "small",
  margin: "0.75rem 0 0 0",
  options: [],
  render: function(...args) {
    console.log("Please implement a render!");
    console.log("Here are the render args: ", args);
  },
  width: "70%"
};

export default SelectProvider;
