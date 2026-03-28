import React, { createContext, useContext } from "react";

interface SVGContextType {
  width: number;
  height: number;
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  dimensions: {
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const SVGContext = createContext<SVGContextType | null>(null);

export const useSVGContext = () => {
  const context = useContext(SVGContext);
  if (!context) {
    throw new Error("useSVGContext must be used within a ClippedSVG provider");
  }
  return context;
};
