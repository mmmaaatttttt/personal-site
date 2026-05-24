import { Children, type FC, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ColumnLayoutProps {
  children: ReactNode;
  break?: "sm" | "md" | "lg" | "xl";
  sizes?: number[];
}

const ColumnLayout: FC<ColumnLayoutProps> = ({
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
    <div
      className={cn("flex flex-row gap-8", breakAt && breakClasses[breakAt])}
    >
      {Children.toArray(children)
        .map((child, i) => ({ child, i }))
        .map(({ child, i }) => (
          <div
            key={i}
            className="flex-1"
            style={sizes?.[i] ? { flex: sizes[i] } : undefined}
          >
            {child}
          </div>
        ))}
    </div>
  );
};

export default ColumnLayout;
