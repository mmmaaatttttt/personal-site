import { type ReactNode, useId } from "react";
import { cn } from "@/lib/utils";

interface TableCell {
  key: string | number;
  content: ReactNode;
}

interface TableRow {
  key: string | number;
  cells: TableCell[];
  className?: string;
}

interface TableHeader {
  key: string | number;
  content: ReactNode;
  className?: string;
}

interface StyledTableProps {
  margin?: string;
  padding?: string;
  className?: string;
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
  className,
  margin,
  children,
  headers,
  rows,
  data,
}: StyledTableProps) {
  const id = useId();

  if (data) {
    const [headerRow, ...dataRows] = data;
    headers = headerRow.map((content, i) => ({ key: i, content }));
    rows = dataRows.map((cells, i) => ({
      key: i,
      cells: cells.map((content, j) => ({ key: j, content })),
    }));
  }
  return (
    <div
      className={cn("mb-6 mt-0 w-full overflow-x-auto text-center", className)}
      style={margin !== undefined ? { margin } : undefined}
    >
      <table
        data-styled-table={id}
        className="border-gray/30 mx-auto w-full border-collapse border shadow-sm"
      >
        <style>{`
          table[data-styled-table="${id}"] th, table[data-styled-table="${id}"] td {
            text-align: center;
            vertical-align: middle;
            padding: ${padding};
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 0.85rem;
            line-height: 1.4;
          }
          table[data-styled-table="${id}"] th {
            font-weight: 700;
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
              <tr key={row.key} className={row.className}>
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
