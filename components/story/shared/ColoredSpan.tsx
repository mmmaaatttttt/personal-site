import React from "react";

interface ColoredSpanProps {
  bold?: boolean;
  color?: string;
  children: React.ReactNode;
}

export default function ColoredSpan({ bold = false, color = "black", children }: ColoredSpanProps) {
  return (
    <span style={{ color, fontWeight: bold ? "bold" : "normal" }}>
      {children}
    </span>
  );
}
