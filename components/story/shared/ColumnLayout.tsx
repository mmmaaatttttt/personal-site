import React from "react";
import { cn } from "@/lib/utils";

interface ColumnLayoutProps {
  children: React.ReactNode;
  break?: "sm" | "md" | "lg" | "xl";
  sizes?: number[];
}

const ColumnLayout: React.FC<ColumnLayoutProps> = ({
  children,
  break: breakAt,
  sizes,
}) => {
  const breakClasses = {
    sm: "max-sm:flex-col",
    md: "max-md:flex-col",
    lg: "max-lg:flex-col",
    xl: "max-xl:flex-col",
  };

  return (
    <div className={cn("flex flex-row gap-8", breakAt && breakClasses[breakAt])}>
      {React.Children.map(children, (child, idx) => (
        <div
          key={idx}
          className="flex-1"
          style={sizes && sizes[idx] ? { flex: sizes[idx] } : undefined}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ColumnLayout;
