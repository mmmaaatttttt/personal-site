import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CaptionProps {
  children: ReactNode;
  caption?: string;
  className?: string;
}

const Caption: FC<CaptionProps> = ({ children, caption, className }) => {
  return (
    <div
      className={cn(
        "my-12 flex flex-col items-center",
        "w-full ml-0",
        "min-[890px]:w-[120%] min-[890px]:-ml-[10%]",
        "min-[1020px]:w-[140%] min-[1020px]:-ml-[20%]",
        "min-[1240px]:w-[150%] min-[1240px]:-ml-[25%]",
        className,
      )}
    >
      <div className="w-full">{children}</div>
      {caption && (
        <p className="mt-4 max-w-2xl px-4 text-center text-sm font-medium italic text-gray-500">
          {caption}
        </p>
      )}
    </div>
  );
};

export default Caption;
