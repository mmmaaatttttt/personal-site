import React, { Component } from "react";
import styled from "styled-components";
import katex from "katex";
import PropTypes from "prop-types";
import { rhythm } from "utils/typography";

const StyledParagraph = styled.p`
  .katex,
  .katex * {
    font-family: inherit !important;
  }
  .delimcenter {
    top: 0.1em !important;
    font-size: 2rem;
  }
`;

class Latex extends Component {
  componentDidMount() {
    katex.render(this.props.str, this.p, {
      displayMode: this.props.displayMode
    });
  }

  render() {
    return <StyledParagraph innerRef={p => (this.p = p)} />;
  }
}

Latex.propTypes = {
  displayMode: PropTypes.bool.isRequired,
  str: PropTypes.string.isRequired
};

Latex.defaultProps = {
  displayMode: false
};

export default Latex;
