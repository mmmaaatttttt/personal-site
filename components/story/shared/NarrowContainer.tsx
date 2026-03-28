import React from "react";
import { cn } from "@/lib/utils";

interface NarrowContainerProps {
  children: React.ReactNode;
  width?: string;
  margin?: string;
  fullWidthAt?: "sm" | "md" | "lg" | "xl";
  center?: boolean;
  className?: string;
}


const NarrowContainer: React.FC<NarrowContainerProps> = ({
  children,
  width = "80%",
  margin = "0 auto",
  fullWidthAt = "sm",
  center = false,
  className,
}) => {


  const breakpointClasses = {
    sm: "max-sm:w-full max-sm:mx-0",
    md: "max-md:w-full max-md:mx-0",
    lg: "max-lg:w-full max-lg:mx-0",
    xl: "max-xl:w-full max-xl:mx-0",
  };

  return (
    <div
      style={{ width, margin }}
      className={cn(
        "transition-all duration-300",
        breakpointClasses[fullWidthAt],
        center && "text-center",
        className
      )}

    >
      {children}
    </div>
  );
};

export default NarrowContainer;
