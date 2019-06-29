import React from "react";
import PropTypes from "prop-types";
import { SelectProvider, withCaption } from "providers";
import { FlexContainer, HeatChart } from "story_components";
import { generateGrid } from "./helpers";

function PAdicHeatChart({ primes, gridSize }) {
  return (
    <SelectProvider
      options={[primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))]}
      render={([{ value: prime }]) => {
        const gridData = generateGrid(gridSize, prime);
        return (
          // <div>hi</div>
          // wtf why does this break
          <HeatChart data={gridData} />
        );
      }}
    />
  );
}

PAdicHeatChart.propTypes = {
  gridSize: PropTypes.number.isRequired,
  primes: PropTypes.arrayOf(PropTypes.number).isRequired
};

PAdicHeatChart.defaultProps = {
  gridSize: 50,
  primes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
};

export default withCaption(React.memo(PAdicHeatChart));
