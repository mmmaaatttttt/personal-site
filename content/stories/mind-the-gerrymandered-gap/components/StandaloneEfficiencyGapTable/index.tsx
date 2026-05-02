"use client";

import { FC, useEffect, useState } from "react";
import EfficiencyGapTable from "../EfficiencyGapTable";
import {
  GERRYMANDER_COUNTS_EVENT,
  GERRYMANDER_COUNTS_KEY,
} from "../SampleGerrymander/constants";

const StandaloneEfficiencyGapTable: FC = () => {
  const [districtCounts, setDistrictCounts] = useState<
    [number, number][] | null
  >(() => {
    try {
      const saved = localStorage.getItem(GERRYMANDER_COUNTS_KEY);
      return saved ? (JSON.parse(saved) as [number, number][]) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const counts = (e as CustomEvent<[number, number][] | null>).detail;
      setDistrictCounts(counts);
    };
    window.addEventListener(GERRYMANDER_COUNTS_EVENT, handler);
    return () => window.removeEventListener(GERRYMANDER_COUNTS_EVENT, handler);
  }, []);

  return <EfficiencyGapTable districtCounts={districtCounts} />;
};

export default StandaloneEfficiencyGapTable;
