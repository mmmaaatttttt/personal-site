import React from "react";
import PropTypes from "prop-types";
import { SelectProvider, withCaption } from "providers";
import { HeatChart } from "story_components";
import { generateGrid, generateTooltipContent } from "./helpers";
import COLORS from "utils/styles";

function PAdicHeatChart({ primes, gridSize }) {
  return (
    <SelectProvider
      options={[primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))]}
      width="50%"
      render={([{ value: prime }]) => {
        const gridData = generateGrid(gridSize, prime);
        return (
          <HeatChart
            axes={false}
            colorRange={[COLORS.BLUE, COLORS.BLACK]}
            data={gridData}
            delayMultiplier={1}
            getTooltipTitle={d => generateTooltipContent(d, prime)}
            getTooltipBody={() => ""}
            paddingScale={0.01}
            xAxisLabel="Second Number"
            yAxisLabel="First Number"
          />
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
  gridSize: 25,
  primes: [2, 3, 5, 7, 11, 13, 17, 19, 23]
};

export default withCaption(React.memo(PAdicHeatChart));
