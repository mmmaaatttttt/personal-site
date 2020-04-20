import React, { useState } from "react";
import PropTypes from "prop-types";
import { SelectProvider, withCaption } from "providers";
import { FlexContainer, Latex, StyledInput } from "story_components";
import { clampInput, displayIntegerDifference } from "./helpers";

function PAdicCalculator({ primes, min, max }) {
  const [num1, setFirstNumber] = useState(0);
  const [num2, setSecondNumber] = useState(0);
  return (
    <SelectProvider
      options={[primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))]}
      render={([{ value }]) => {
        return (
          <FlexContainer column>
            <FlexContainer cross="center" main="center" shouldWrap>
              <div>
                <label htmlFor="num1">Number 1:</label>
                <StyledInput
                  onChange={clampInput(min, max, setFirstNumber)}
                  step="1"
                  min={min}
                  max={max}
                  id="num1"
                  type="number"
                />
              </div>
              <div>
                <label htmlFor="num2">Number 2:</label>
                <StyledInput
                  onChange={clampInput(min, max, setSecondNumber)}
                  step="1"
                  min={min}
                  max={max}
                  id="num2"
                  type="number"
                />
              </div>
            </FlexContainer>
            <Latex
              displayMode
              str={displayIntegerDifference(num1 || 0, num2 || 0, value)}
            />
          </FlexContainer>
        );
      }}
    />
  );
}

PAdicCalculator.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  primes: PropTypes.arrayOf(PropTypes.number).isRequired
};

PAdicCalculator.defaultProps = {
  max: 1e6,
  min: -1e6,
  primes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
};

export default withCaption(React.memo(PAdicCalculator));
