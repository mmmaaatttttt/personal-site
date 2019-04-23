import React, { Component } from "react";
import PropTypes from "prop-types";
import { ColumnLayout, NarrowContainer, SliderGroup } from "story_components";
import { sliderType } from "utils/types";

class SliderProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValues: props.initialData.map(d => d.initialValue)
    };
    this.handleValueFns = props.initialData.map((_, i) =>
      this.handleValueChange.bind(this, i)
    );
  }

  handleValueChange = (idx, newVal) => {
    this.setState(st => {
      const sliderValuesCopy = [...st.sliderValues];
      sliderValuesCopy[idx] = newVal;
      return { sliderValues: sliderValuesCopy };
    });
  };

  render() {
    const { column, fullWidthAt, initialData, render, width } = this.props;
    const { sliderValues } = this.state;
    const dataWithHandlers = initialData.map((d, i) => ({
      ...d,
      value: sliderValues[i],
      handleValueChange: this.handleValueFns[i]
    }));
    const numSliders = sliderValues.length;
    const mainContent = (
      <React.Fragment>
        <SliderGroup data={dataWithHandlers} column={column} />
        {render(this.state.sliderValues)}
      </React.Fragment>
    );
    return numSliders < 4 ? (
      <NarrowContainer width={width} fullWidthAt={fullWidthAt}>
        {mainContent}
      </NarrowContainer>
    ) : (
      <ColumnLayout break="small">{mainContent}</ColumnLayout>
    );
  }
}

SliderProvider.propTypes = {
  column: PropTypes.bool.isRequired,
  initialData: sliderType,
  fullWidthAt: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

SliderProvider.defaultProps = {
  column: true,
  initialData: [],
  fullWidthAt: "small",
  render: function(...args) {
    console.log("Please implement a render!");
    console.log("Here are the render args: ", args);
  },
  width: "70%"
};

export default SliderProvider;
