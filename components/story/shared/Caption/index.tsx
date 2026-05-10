import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CaptionProps {
  children: ReactNode;
  caption?: string;
  className?: string;
}

const Caption: FC<CaptionProps> = ({ children, caption, className }) => {
  return (
    <div className={cn("my-8 flex flex-col items-center w-full", className)}>
      <div className="w-full">{children}</div>
      {caption && (
        <div className="mt-2 max-w-2xl px-4 text-center text-sm font-bold text-gray-600">
          {caption}
        </div>
      )}
    </div>
  );
};

export default Caption;
