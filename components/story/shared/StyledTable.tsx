import React from "react";

interface StyledTableProps {
  margin?: string;
  padding?: string;
  children: React.ReactNode;
}

export default function StyledTable({ margin = "0 0 1.44rem 0", padding = "0.5rem 0", children }: StyledTableProps) {
  return (
    <div className="w-full overflow-x-auto" style={{ margin }}>
      <table data-styled-table className="w-full border-collapse">
        <style>{`
          table[data-styled-table] th, table[data-styled-table] td {
            text-align: center;
            padding: ${padding};
          }
        `}</style>
        {children}
      </table>
    </div>
  );
}
