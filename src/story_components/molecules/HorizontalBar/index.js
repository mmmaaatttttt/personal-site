import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NodeGroup from "react-move/NodeGroup";
import { rhythm } from "utils/typography";
import COLORS from "utils/styles";
import { Tooltip } from "story_components";

const BarContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  height: ${rhythm(0.5)};
  margin: ${rhythm(0.25)} 0;
  border: 1px solid ${COLORS.GRAY};
  display: flex;
  overflow: hidden;
`;

const BarTitle = styled.h4`
  text-align: center;
  margin-bottom: ${rhythm(0.25)};
`;

class HorizontalBar extends Component {
  state = {
    tooltipVisible: false,
    tooltipX: 0,
    tooltipY: 0
  };

  handleTooltipShow = e => {
    this.setState({
      tooltipVisible: true,
      tooltipX: e.pageX,
      tooltipY: e.pageY
    });
  };

  handleTooltipHide = e => {
    this.setState({
      tooltipVisible: false
    });
  };

  getWidth = d => {
    const { data } = this.props;
    const total =
      data.map(d => d.size).reduce((total, num) => total + num, 0) || 1;
    const width = d.size / total * 100;
    return { width: [width], timing: { duration: 300 } };
  };

  render() {
    const { data, title } = this.props;
    const { tooltipVisible, tooltipX, tooltipY } = this.state;
    const titleHTML = title ? <BarTitle>{title}</BarTitle> : null;
    return (
      <div>
        {titleHTML}
        <NodeGroup
          data={data}
          keyAccessor={(d, i) => i}
          start={() => ({ width: 0 })}
          enter={this.getWidth}
          update={this.getWidth}
        >
          {segments => (
            <BarContainer
              onMouseMove={this.handleTooltipShow}
              onMouseLeave={this.handleTooltipHide}
              onTouchMove={this.handleTooltipShow}
              onTouchEnd={this.handleTooltipHide}
            >
              {segments.map(({ key, data, state }) => {
                const { width } = state;
                const { color: backgroundColor } = data;
                return (
                  <div
                    style={{ width: `${width}%`, backgroundColor }}
                    key={key}
                  />
                );
              })}
              <Tooltip
                body={data.map(d => d.tooltipText)}
                visible={tooltipVisible}
                x={tooltipX}
                y={tooltipY}
              />
            </BarContainer>
          )}
        </NodeGroup>
      </div>
    );
  }
}

HorizontalBar.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired
};

HorizontalBar.defaultProps = {
  title: ""
};

export default HorizontalBar;
