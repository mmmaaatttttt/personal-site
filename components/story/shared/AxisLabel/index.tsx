import type { FC, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

interface AxisLabelProps extends SVGProps<SVGTextElement> {
  anchor?: "start" | "middle" | "end";
  children: ReactNode;
}

const AxisLabel: FC<AxisLabelProps> = ({
  anchor = "middle",
  children,
  className,
  fontSize = "1.25rem",
  style,
  ...props
}) => {
  return (
    <text
      textAnchor={anchor}
      className={cn(
        "fill-current font-bold italic prose-sm",
        "stroke-white stroke-[0.5px]",
        className,
      )}
      style={{ fontSize, ...style }}
      {...props}
    >
      {children}
    </text>
  );
};

export default AxisLabel;
