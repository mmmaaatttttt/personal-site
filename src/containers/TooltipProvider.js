import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "story_components";

class TooltipProvider extends Component {
  state = {
    tooltipVisible: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipTitle: "",
    tooltipBody: ""
  };

  handleTooltipShow = (tooltipTitle, tooltipBody) => e => {
    this.setState({
      tooltipVisible: true,
      tooltipX: e.pageX,
      tooltipY: e.pageY,
      tooltipTitle,
      tooltipBody
    });
  };

  handleTooltipHide = () => {
    this.setState({ tooltipVisible: false });
  };

  render() {
    const {
      tooltipVisible,
      tooltipX,
      tooltipY,
      tooltipTitle,
      tooltipBody
    } = this.state;
    return (
      <React.Fragment>
        {this.props.render(this.handleTooltipShow, this.handleTooltipHide)}
        <Tooltip
          visible={tooltipVisible}
          x={tooltipX}
          y={tooltipY}
          title={tooltipTitle}
          body={tooltipBody}
        />
      </React.Fragment>
    );
  }
}

TooltipProvider.propTypes = {
  render: PropTypes.func.isRequired
};

TooltipProvider.defaultProps = {
  render: function(...args) {
    console.log("Please implement a render!");
    console.log("Here are the render args: ", args);
  }
};

export default TooltipProvider;
