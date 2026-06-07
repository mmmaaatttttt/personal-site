"use client";

import { type FC, useMemo, useState } from "react";
import HeatChart from "@/components/story/shared/HeatChart";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import COLORS from "@/utils/styles";
import { generateGrid } from "./padicHeatMath";

const GRID_SIZE = 25;
const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const PRIME_OPTIONS = PRIMES.map((p) => ({
  value: String(p),
  label: `Selected prime: ${p}`,
}));

const PAdicHeatChart: FC = () => {
  const [primeOpt, setPrimeOpt] = useState(PRIME_OPTIONS[0]);
  const prime = Number(primeOpt.value);

  const gridData = useMemo(() => generateGrid(GRID_SIZE, prime), [prime]);

  return (
    <NarrowContainer width="55%">
      <div className="flex flex-col items-center gap-4">
        <Select
          name="padic-heat-prime"
          value={primeOpt.value}
          onChange={setPrimeOpt}
          options={PRIME_OPTIONS}
        />
        <div className="w-full">
          <HeatChart
            data={gridData}
            accessor={(d) => d}
            getTooltipBody={(d, x, y) => [
              `| ${y + 1} − ${x + 1} |_${prime} = ${d.toFixed(4)}`,
            ]}
            colorDomain={[0, 1]}
            colorRange={[COLORS.BLUE, COLORS.BLACK]}
            xAxisLabel="First Number"
            yAxisLabel="Second Number"
            axes={false}
            paddingScale={0.02}
          />
        </div>
      </div>
    </NarrowContainer>
  );
};

export default PAdicHeatChart;
