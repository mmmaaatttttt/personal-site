import { ReactNode } from "react";

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
}

interface StyledTableProps {
  margin?: string;
  padding?: string;
  children?: ReactNode;
  headers?: TableHeader[];
  rows?: TableRow[];
}

export default function StyledTable({
  padding = "0.75rem 1rem",
  children,
  headers,
  rows,
}: StyledTableProps) {
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
                <th key={h.key}>{h.content}</th>
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
