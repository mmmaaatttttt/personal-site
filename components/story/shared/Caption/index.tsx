import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CaptionProps {
  children: ReactNode;
  caption?: string;
  className?: string;
  captionMarginTop?: string;
}

const Caption: FC<CaptionProps> = ({
  children,
  caption,
  className,
  captionMarginTop,
}) => {
  return (
    <div
      className={cn(
        "my-8 flex flex-col items-center w-full ml-0",
        "min-[890px]:w-[110%] min-[890px]:-ml-[5%]",
        "min-[1020px]:w-[120%] min-[1020px]:-ml-[10%]",
        "min-[1240px]:w-[130%] min-[1240px]:-ml-[15%]",
        className,
      )}
    >
      <div className="w-full not-prose">{children}</div>
      {caption && (
        <div
          className="mt-1 max-w-2xl px-4 text-center text-sm font-bold text-gray-600"
          style={captionMarginTop ? { marginTop: captionMarginTop } : undefined}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default Caption;
