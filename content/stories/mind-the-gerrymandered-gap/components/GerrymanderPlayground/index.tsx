"use client";

import { type FC, useCallback, useState } from "react";
import EfficiencyGapTable from "../EfficiencyGapTable";
import SampleGerrymander from "../SampleGerrymander";

const GerrymanderPlayground: FC = () => {
  const [districtCounts, setDistrictCounts] = useState<
    [number, number][] | null
  >(null);

  const handleDistrictCountsChange = useCallback(
    (counts: [number, number][] | null) => {
      setDistrictCounts(counts);
    },
    [],
  );

  return (
    <div>
      <SampleGerrymander onDistrictCountsChange={handleDistrictCountsChange} />
      <EfficiencyGapTable districtCounts={districtCounts} />
    </div>
  );
};

export default GerrymanderPlayground;
