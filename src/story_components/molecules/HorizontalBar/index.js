import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NodeGroup from "react-move/NodeGroup";
import { rhythm } from "utils/typography";
import COLORS from "utils/styles";
import { TooltipProvider } from "containers";

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
  getWidth = d => {
    const { data } = this.props;
    const total =
      data.map(d => d.size).reduce((total, num) => total + num, 0) || 1;
    const width = (d.size / total) * 100;
    return { width: [width], timing: { duration: 300 } };
  };

  renderBarContainer = (tooltipShow, tooltipHide) => segments => {
    const { data } = this.props;
    const body = data.map(d => d.tooltipText);
    return (
      <BarContainer
        onMouseMove={tooltipShow("", body)}
        onMouseLeave={tooltipHide}
        onTouchMove={tooltipShow("", body)}
        onTouchEnd={tooltipHide}
      >
        {segments.map(({ key, data, state }) => {
          const { width } = state;
          const { color: backgroundColor } = data;
          return (
            <div style={{ width: `${width}%`, backgroundColor }} key={key} />
          );
        })}
      </BarContainer>
    );
  };

  render() {
    const { data, title } = this.props;
    const titleHTML = title ? <BarTitle>{title}</BarTitle> : null;
    return (
      <div>
        {titleHTML}
        <TooltipProvider
          render={(tooltipShow, tooltipHide) => {
            return (
              <NodeGroup
                data={data}
                keyAccessor={(_, i) => i}
                start={() => ({ width: 0 })}
                enter={this.getWidth}
                update={this.getWidth}
              >
                {this.renderBarContainer(tooltipShow, tooltipHide)}
              </NodeGroup>
            );
          }}
        />
      </div>
    );
  }
}

HorizontalBar.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      tooltipText: PropTypes.string
    })
  ).isRequired
};

HorizontalBar.defaultProps = {
  title: ""
};

export default HorizontalBar;
