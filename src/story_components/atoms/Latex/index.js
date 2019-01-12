import React, { Component } from "react";
import styled from "styled-components";
import katex from "katex";
import PropTypes from "prop-types";

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
  constructor(props) {
    super(props);
    this.pTag = React.createRef(); 
  }

  componentDidMount() {
    katex.render(this.props.str, this.pTag.current, {
      displayMode: this.props.displayMode
    });
  }

  render() {
    return <StyledParagraph ref={this.pTag} />;
  }
}

Latex.propTypes = {
  displayMode: PropTypes.bool.isRequired,
  str: PropTypes.string.isRequired
};

Latex.defaultProps = {
  displayMode: false,
  str: ""
};

export default Latex;
