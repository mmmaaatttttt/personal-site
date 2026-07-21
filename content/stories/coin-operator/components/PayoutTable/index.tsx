"use client";

import type { FC } from "react";
import SortHeader from "@/components/story/shared/SortHeader";
import StyledTable from "@/components/story/shared/StyledTable";
import useSortableTable from "@/hooks/useSortableTable";
import { formatSignificantPercentage, type PayoutGroup } from "../../tableData";

interface PayoutTableProps {
  data: PayoutGroup[];
}

const PayoutTable: FC<PayoutTableProps> = ({ data }) => {
  const { sorted, sortKey, ascending, handleSortClick } = useSortableTable(
    data,
    "payout",
  );

  const headers = [
    {
      key: "classification",
      content: "Winning Combination",
    },
    {
      key: "payout",
      content: (
        <SortHeader
          label="Payout"
          sortKey="payout"
          currentKey={sortKey}
          ascending={ascending}
          onClick={handleSortClick}
        />
      ),
    },
    {
      key: "probability",
      content: (
        <SortHeader
          label="Probability"
          sortKey="probability"
          currentKey={sortKey}
          ascending={ascending}
          onClick={handleSortClick}
        />
      ),
    },
  ];

  return (
    <StyledTable
      className="[&_td:first-child]:!text-base sm:[&_td:first-child]:!text-xl lg:[&_td:first-child]:!text-2xl"
      padding="0.1rem 0.4rem"
      headers={headers}
      rows={sorted.map((row) => ({
        key: row.classification,
        cells: [
          { key: "classification", content: row.classification },
          { key: "payout", content: row.payout },
          {
            key: "probability",
            content: formatSignificantPercentage(row.probability),
          },
        ],
      }))}
    />
  );
};

export default PayoutTable;
