import React, { Component } from "react";
import PropTypes from "prop-types";
import { SliderGroup } from "story_components";

class SliderProvider extends Component {
  state = {
    sliderValues: this.props.sliderData.map(d => d.value)
  };

  handleValueChange = (idx, newVal) => {
    this.setState(st => {
      const sliderValuesCopy = [...st.sliderValues];
      sliderValuesCopy[idx] = newVal;
      return { sliderValues: sliderValuesCopy };
    });
  };

  componentDidMount() {
    this.handleValueFns = this.props.sliderData.map((_, i) =>
      this.handleValueChange.bind(this, i)
    );
  }

  render() {
    const { sliderData, column } = this.props;
    const data = sliderData.map((d, i) => ({
      ...d,
      handleValueChange: this.handleValueFns[i]
    }));
    return (
      <React.Fragment>
        <SliderGroup data={data} column={column} />
        {this.props.render(this.state.sliderValues)}
      </React.Fragment>
    );
  }
}

SliderProvider.propTypes = {
  render: PropTypes.func.isRequired,
  column: PropTypes.bool.isRequired
};

SliderProvider.defaultProps = {
  render: function(...args) {
    console.log("Please implement a render!");
    console.log("Here are the render args: ", args);
  },
  column: true
};

export default SliderProvider;
