import React, { Component } from "react";
import PropTypes from "prop-types";
import { json, csv } from "d3-fetch";
import { withPrefix } from "gatsby-link";
import withCaption from "hocs/withCaption";
import { NarrowContainer, StyledSelect, USMap } from "story_components";

class SelectableHeatMap extends Component {
  state = {
    selectedOption: this.props.selectOptions[0]
  };

  handleChange = selectedOption => this.setState({ selectedOption });

  render() {
    const { value, accessor, colors } = this.state.selectedOption;
    const { selectOptions, data, getTooltipTitle, getTooltipBody } = this.props;
    return (
      <div>
        <NarrowContainer width="50%">
          <StyledSelect
            name="map-data"
            value={value}
            onChange={this.handleChange}
            options={selectOptions}
            searchable={false}
            clearable={false}
          />
        </NarrowContainer>
        <USMap
          data={data}
          fillAccessor={accessor}
          colors={colors}
          getTooltipTitle={getTooltipTitle}
          getTooltipBody={getTooltipBody}
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

export default withCaption(SelectableHeatMap);
