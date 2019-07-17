import React, { useState } from "react";
import PropTypes from "prop-types";
import { SelectProvider, withCaption } from "providers";
import { FlexContainer, Latex, StyledInput } from "story_components";
import { displayIntegerDifference } from "./helpers";

function PAdicCalculator({ primes }) {
  const [num1, setFirstNumber] = useState(1);
  const [num2, setSecondNumber] = useState(1);
  return (
    <SelectProvider
      options={[primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))]}
      render={([{ value }]) => {
        return (
          <FlexContainer column>
            <FlexContainer cross="center" main="center" shouldWrap>
              <div>
                <label>Number 1:</label>
                <StyledInput
                  type="number"
                  step="1"
                  value={num1}
                  onChange={e => setFirstNumber(e.target.value)}
                />
              </div>
              <div>
                <label>Number 2:</label>
                <StyledInput
                  type="number"
                  step="1"
                  value={num2}
                  onChange={e => setSecondNumber(e.target.value)}
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
  primes: PropTypes.arrayOf(PropTypes.number).isRequired
};

PAdicCalculator.defaultProps = {
  primes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
};

export default withCaption(React.memo(PAdicCalculator));
