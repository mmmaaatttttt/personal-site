import React, { cloneElement, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Animate from "react-move/Animate";
import { FlexContainer, Icon } from "story_components";

const ItemWrapper = styled(FlexContainer)`
  overflow: hidden;

  & > * {
    flex: 0 0 auto;
    margin-right: 5%;
  }
`;

function Carousel({ children }) {
  const [idx, setIdx] = useState(0);
  const leftDisabled = idx === 0;
  const rightDisabled = idx === children.length - 1;
  return (
    <Animate
      show
      start={{ marginLeft: 0 }}
      update={() => ({ marginLeft: [idx * 105] })}
    >
      {({ marginLeft }) => (
        <FlexContainer cross="center">
          <Icon
            name="chevron-left"
            disabled={leftDisabled}
            hover={!leftDisabled}
            onClick={() => !leftDisabled && setIdx(idx - 1)}
            opacity={leftDisabled ? 0.4 : 1}
            padding="0 0.25rem 0 0"
            size={2}
          />
          <ItemWrapper>
            {children.map((child, i) =>
              cloneElement(
                child,
                i === 0 ? { style: { marginLeft: `${-marginLeft}%` } } : null
              )
            )}
          </ItemWrapper>
          <Icon
            name="chevron-right"
            disabled={rightDisabled}
            hover={!rightDisabled}
            onClick={() => !rightDisabled && setIdx(idx + 1)}
            opacity={rightDisabled ? 0.4 : 1}
            padding="0 0 0 0.25rem"
            size={2}
          />
        </FlexContainer>
      )}
    </Animate>
  );
}

Carousel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

Carousel.defaultProps = {
  children: []
};

export default Carousel;
