import React from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver";
import { SVGContext } from "@/context/SVGContext";
import { cn } from "@/lib/utils";

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface ClippedSVGProps {
  id: string;
  width: number;
  height: number;
  marginTop?: number | string;
  padding?: number | Padding;
  children: React.ReactNode;
  className?: string;
}

const ClippedSVG: React.FC<ClippedSVGProps> = ({
  id,
  width,
  height,
  marginTop = 0,
  padding = 0,
  children,
  className,
}) => {
  const [measureRef, dimensions] = useResizeObserver();

  const paddingObj: Padding =
    typeof padding === "number"
      ? { top: padding, left: 0, right: padding, bottom: padding }
      : padding;

  return (
    <div ref={measureRef} className={cn("w-full h-full", className)}>
      <SVGContext.Provider value={{ width, height, padding: paddingObj, dimensions }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          style={{ marginTop }}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <clipPath id={`clip-path-${id}`}>
              <rect
                x={paddingObj.left}
                y={paddingObj.top}
                width={width - paddingObj.left - paddingObj.right}
                height={height - paddingObj.top - paddingObj.bottom}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#clip-path-${id})`}>{children}</g>
        </svg>
      </SVGContext.Provider>
    </div>
  );
};

export default ClippedSVG;
