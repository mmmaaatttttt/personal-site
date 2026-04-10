import React from "react";

interface StyledTableProps {
  margin?: string;
  padding?: string;
  children: React.ReactNode;
}

export default function StyledTable({
  padding = "0.75rem 1rem",
  children,
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
        {children}
      </table>
    </div>
  );
}
