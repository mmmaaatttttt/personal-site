import React from "react";
import { cn } from "@/lib/utils";

interface FlexContainerProps {
  children: React.ReactNode;
  column?: boolean;
  main?: "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch";
  cross?: "start" | "end" | "center" | "baseline" | "stretch";
  flex?: number | string;
  margin?: string;
  width?: string;
  textAlign?: "left" | "center" | "right";
  shouldWrap?: boolean;
  className?: string;
}

const FlexContainer: React.FC<FlexContainerProps> = ({
  children,
  column = false,
  main = "stretch",
  cross = "stretch",
  flex = 1,
  margin = "0",
  width = "auto",
  textAlign = "left",
  shouldWrap = false,
  className,
}) => {
  const mainClasses = {
    start: "justify-start",
    end: "justify-end",
    center: "justify-center",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
    stretch: "justify-stretch",
  };

  const crossClasses = {
    start: "items-start",
    end: "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  };

  const mainDirClasses = column
    ? {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        between: "items-between",
        around: "items-around",
        evenly: "items-evenly",
        stretch: "items-stretch",
      }
    : mainClasses;

  const crossDirClasses = column
    ? {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        baseline: "justify-baseline",
        stretch: "justify-stretch",
      }
    : crossClasses;

  return (
    <div
      className={cn(
        "flex",
        column ? "flex-col" : "flex-row",
        shouldWrap ? "flex-wrap" : "flex-nowrap",
        column ? mainDirClasses[main] : mainClasses[main],
        column ? crossDirClasses[cross] : crossClasses[cross],
        className
      )}
      style={{ flex, margin, width, textAlign }}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
