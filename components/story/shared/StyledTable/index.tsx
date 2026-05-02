import type { ReactNode } from "react";

interface TableCell {
  key: string | number;
  content: ReactNode;
}

interface TableRow {
  key: string | number;
  cells: TableCell[];
}

interface TableHeader {
  key: string | number;
  content: ReactNode;
  className?: string;
}

interface StyledTableProps {
  margin?: string;
  padding?: string;
  children?: ReactNode;
  headers?: TableHeader[];
  rows?: TableRow[];
  /**
   * Simple 2D array: first element is the header row, rest are data rows.
   * Useful for static data only, since in this case we use
   * the array indices as the keys
   */
  data?: string[][];
}

export default function StyledTable({
  padding = "0.75rem 1rem",
  children,
  headers,
  rows,
  data,
}: StyledTableProps) {
  if (data) {
    const [headerRow, ...dataRows] = data;
    headers = headerRow.map((content, i) => ({ key: i, content }));
    rows = dataRows.map((cells, i) => ({
      key: i,
      cells: cells.map((content, j) => ({ key: j, content })),
    }));
  }
  return (
    <div className="my-12 w-full overflow-x-auto text-center">
      <table
        data-styled-table
        className="border-gray/30 mx-auto w-full border-collapse border shadow-sm"
      >
        <style>{`
          table[data-styled-table] th, table[data-styled-table] td {
            text-align: center;
            padding: ${padding};
            border: 1px solid rgba(0, 0, 0, 0.1);
          }
          table[data-styled-table] th {
            background-color: rgba(0, 0, 0, 0.03);
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.875rem;
          }
        `}</style>
        {headers && (
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h.key} className={h.className}>
                  {h.content}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {rows && (
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                {row.cells.map((cell) => (
                  <td key={cell.key}>{cell.content}</td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
        {children}
      </table>
    </div>
  );
}
