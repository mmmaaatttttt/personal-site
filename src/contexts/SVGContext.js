import { createContext } from "react";

const SVGContext = createContext({
  width: 0,
  height: 0,
  padding: { top: 0, left: 0, right: 0, bottom: 0 }
});

export default SVGContext;
