"use client";

import { FC, useState, useCallback } from "react";
import SampleGerrymander from "../SampleGerrymander";
import EfficiencyGapTable from "../EfficiencyGapTable";

const GerrymanderPlayground: FC = () => {
  const [districtCounts, setDistrictCounts] = useState<[number, number][] | null>(null);

  const handleDistrictCountsChange = useCallback(
    (counts: [number, number][] | null) => {
      setDistrictCounts(counts);
    },
    []
  );

  return (
    <div>
      <SampleGerrymander onDistrictCountsChange={handleDistrictCountsChange} />
      <EfficiencyGapTable districtCounts={districtCounts} />
    </div>
  );
};

export default GerrymanderPlayground;
