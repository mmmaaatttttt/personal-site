"use client";

import { format } from "d3-format";
import type { FC } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import SortHeader from "@/components/story/shared/SortHeader";
import StyledTable from "@/components/story/shared/StyledTable";
import useSliders from "@/hooks/useSliders";
import useSortableTable from "@/hooks/useSortableTable";
import COLORS from "@/utils/styles";
import type { VoterStateRow } from "../../data";

const percentFormat = format(".2%");

interface VotingTableProps {
  tableData: VoterStateRow[];
}

const VotingTable: FC<VotingTableProps> = ({ tableData }) => {
  const { sorted, sortKey, ascending, handleSortClick } = useSortableTable(
    tableData,
    "averageTurnout",
  );

  const sliderConfig = [
    {
      min: 5,
      max: tableData.length || 51,
      initialValue: 5,
      step: 1,
      title: (val: number) => `Showing data on ${val} states.`,
      color: COLORS.DARK_GRAY,
    },
  ];

  const { values, sliderData } = useSliders(sliderConfig);
  const [numRows] = values;

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
    <NarrowContainer width="58%">
      <SliderGroup data={sliderData} />
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
    </NarrowContainer>
  );
};

export default VotingTable;
