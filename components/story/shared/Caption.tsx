import React from "react";
import { cn } from "@/lib/utils";

interface CaptionProps {
  children: React.ReactNode;
  caption?: string;
  className?: string;
}

const Caption: React.FC<CaptionProps> = ({ children, caption, className }) => {
  return (
    <div className={cn("my-12 flex flex-col items-center", className)}>
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
