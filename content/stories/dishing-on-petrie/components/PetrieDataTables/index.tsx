import StyledTable from "@/components/story/shared/StyledTable";

const tables = [
  {
    headers: [
      { key: "group", content: "Group (20 green, 4 blue total)" },
      { key: "count", content: "Count" },
    ],
    rows: [
      { key: 1, cells: [{ key: "g", content: "Heard only by blue, said by blue" }, { key: "c", content: "0" }] },
      { key: 2, cells: [{ key: "g", content: "Heard by blue, said by green" }, { key: "c", content: "100" }] },
      { key: 3, cells: [{ key: "g", content: "Heard by green, said by blue" }, { key: "c", content: "25" }] },
      { key: 4, cells: [{ key: "g", content: "Heard by green, said only by green" }, { key: "c", content: "70" }] },
    ],
  },
  {
    headers: [
      { key: "group", content: "Group (20 green, 10 blue total)" },
      { key: "count", content: "Count" },
    ],
    rows: [
      { key: 1, cells: [{ key: "g", content: "Heard only by blue, said by blue" }, { key: "c", content: "0" }] },
      { key: 2, cells: [{ key: "g", content: "Heard by blue, said by green" }, { key: "c", content: "100" }] },
      { key: 3, cells: [{ key: "g", content: "Heard by green, said by blue" }, { key: "c", content: "55" }] },
      { key: 4, cells: [{ key: "g", content: "Heard by green, said only by green" }, { key: "c", content: "18" }] },
    ],
  },
];

export default function PetrieDataTable({ idx = 0 }: { idx?: number }) {
  const table = tables[idx];
  if (!table) return null;
  return <StyledTable headers={table.headers} rows={table.rows} />;
}
