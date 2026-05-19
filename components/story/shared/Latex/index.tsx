"use client";

import katex from "katex";
import { type FC, useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import "./Latex.css";

interface LatexProps {
  str: string;
  displayMode?: boolean;
}

const Latex: FC<LatexProps> = ({ str, displayMode = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(str, ref.current, { displayMode, throwOnError: false });
      // this is a janky hack to override default inline styles.
      // biome doesn't let us use !important in stylesheets.
      for (const el of ref.current.querySelectorAll<HTMLElement>(
        ".delimcenter",
      )) {
        el.style.top = "0.1em";
      }
    }
  }, [str, displayMode]);

  return <div ref={ref} className="latex-wrapper" />;
};

export default Latex;
