"use client";

import { FC, useState } from "react";
import { format } from "d3-format";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import StyledTable from "@/components/story/shared/StyledTable";
import COLORS from "@/utils/styles";
import SortHeader, { type SortKey } from "./SortHeader";
import type { VoterStateRow } from "../../data";

const percentFormat = format(".2%");

interface VotingTableProps {
  tableData: VoterStateRow[];
}

const VotingTable: FC<VotingTableProps> = ({ tableData }) => {
  const [sortKey, setSortKey] = useState<SortKey>("averageTurnout");
  const [ascending, setAscending] = useState(true);

  const handleSortClick = (key: SortKey) => {
    if (key === sortKey) {
      setAscending((prev) => !prev);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  const sorted = [...tableData].sort((a, b) => {
    const dir = ascending ? 1 : -1;
    const v1 = a[sortKey];
    const v2 = b[sortKey];
    if (v1 > v2) return dir;
    if (v1 < v2) return -dir;
    return 0;
  });

  const sliderData = [
    {
      min: 5,
      max: tableData.length || 51,
      initialValue: 5,
      step: 1,
      title: (val: number) => `Showing data on ${val} states.`,
      color: COLORS.DARK_GRAY,
    },
  ];

  const headers = [
    {
      key: "state",
      className: "w-1/3",
      content: (
        <SortHeader
          label="State"
          sortKey="state"
          currentKey={sortKey}
          ascending={ascending}
          onClick={handleSortClick}
        />
      ),
    },
    {
      key: "sat",
      className: "w-1/3",
      content: (
        <SortHeader
          label="Average Saturation"
          sortKey="averageSaturation"
          currentKey={sortKey}
          ascending={ascending}
          onClick={handleSortClick}
        />
      ),
    },
    {
      key: "turnout",
      className: "w-1/3",
      content: (
        <SortHeader
          label="Average Turnout"
          sortKey="averageTurnout"
          currentKey={sortKey}
          ascending={ascending}
          onClick={handleSortClick}
        />
      ),
    },
  ];

  return (
    <SliderProvider
      initialData={sliderData}
      render={([numRows]) => (
        <StyledTable
          headers={headers}
          rows={sorted.slice(0, numRows).map((d) => ({
            key: d.state,
            cells: [
              { key: "state", content: d.state },
              { key: "sat", content: percentFormat(d.averageSaturation) },
              { key: "turnout", content: percentFormat(d.averageTurnout) },
            ],
          }))}
        />
      )}
    />
  );
};

export default VotingTable;
