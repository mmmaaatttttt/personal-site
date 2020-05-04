import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import katex from "katex";
import PropTypes from "prop-types";

const StyledParagraph = styled.p`
  .katex,
  .katex * {
    font-family: inherit !important;
  }

  .katex .delimsizing.mult {
    font-family: KaTeX_Size1 !important;
  }

  .delimcenter {
    top: 0.1em !important;
    font-size: 2rem;
  }

  .newline {
    margin-top: 1rem;
  }
`;

function Latex({ str = "", displayMode = false }) {
  const pTag = useRef(null);

  useEffect(() => {
    katex.render(str, pTag.current, { displayMode });
  }, [str, displayMode, pTag]);

  return <StyledParagraph ref={pTag} />;
}

Latex.propTypes = {
  displayMode: PropTypes.bool,
  str: PropTypes.string
};

export default Latex;
