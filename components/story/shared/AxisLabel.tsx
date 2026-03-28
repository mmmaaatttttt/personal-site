import React from "react";
import { cn } from "@/lib/utils";

interface AxisLabelProps extends React.SVGProps<SVGTextElement> {
  anchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}

const AxisLabel: React.FC<AxisLabelProps> = ({
  anchor = "middle",
  children,
  className,
  ...props
}) => {
  return (
    <text
      textAnchor={anchor}
      className={cn(
        "fill-current font-bold italic prose-sm",
        "stroke-white stroke-[0.5px]",
        className
      )}
      style={{ fontSize: "1.25rem" }}
      {...props}
    >
      {children}
    </text>
  );
};

export default AxisLabel;
