"use client";

import { type FC, Suspense } from "react";
import { cn } from "@/lib/utils";
import FigureInner from "./FigureInner";
import type { FigureProps } from "./types";

const bleedClasses = [
  "min-[890px]:w-[110%] min-[890px]:-ml-[5%]",
  "min-[1020px]:w-[120%] min-[1020px]:-ml-[10%]",
  "min-[1240px]:w-[130%] min-[1240px]:-ml-[15%]",
];

const Figure: FC<FigureProps> = (props) => (
  <Suspense
    fallback={
      <div
        className={cn(
          "my-8 flex flex-col items-center w-full ml-0",
          props.bleed !== false && bleedClasses,
          props.className,
        )}
      >
        <div className="not-prose w-full">{props.children}</div>
        {props.caption && (
          <div
            className="mt-1 max-w-2xl px-4 text-center text-sm font-bold text-gray-600"
            style={
              props.captionMarginTop
                ? { marginTop: props.captionMarginTop }
                : undefined
            }
          >
            {props.caption}
          </div>
        )}
      </div>
    }
  >
    <FigureInner {...props} />
  </Suspense>
);

export default Figure;
