import React, { Component } from "react";
import PropTypes from "prop-types";
import { NarrowContainer, StyledSelect, USMap } from "story_components";

class SelectableHeatMap extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  getTooltipTitleWithCurrentOption = (data) => {
    const { selectedOption } = this.state;
    const { getTooltipTitle } = this.props;
    return getTooltipTitle(data, selectedOption);
  }

  getTooltipBodyWithCurrentOption = (data) => {
    const { selectedOption } = this.state;
    const { getTooltipBody } = this.props;
    return getTooltipBody(data, selectedOption);
  }

  render() {
    const { value, label, accessor, colors } = this.state.selectedOption;
    const { selectOptions, data } = this.props;
    return (
      <div>
        <NarrowContainer width="50%">
          <StyledSelect
            value={value}
            onChange={this.handleChange}
            options={selectOptions}
            isSearchable
            placeholder={label}
          />
        </NarrowContainer>
        <USMap
          data={data}
          fillAccessor={accessor}
          colors={colors}
          getTooltipTitle={this.getTooltipTitleWithCurrentOption}
          getTooltipBody={this.getTooltipBodyWithCurrentOption}
        />
      </div>
    );
  }
}

SelectableHeatMap.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  getTooltipTitle: PropTypes.func.isRequired,
  getTooltipBody: PropTypes.func.isRequired
};

export default SelectableHeatMap;
