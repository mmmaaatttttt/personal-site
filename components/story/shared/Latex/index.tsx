"use client";

import katex from "katex";
import { type FC, useCallback } from "react";
import "katex/dist/katex.min.css";
import "./Latex.css";

interface LatexProps {
  str: string;
  displayMode?: boolean;
}

const Latex: FC<LatexProps> = ({ str, displayMode = false }) => {
  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      katex.render(str, el, { displayMode, throwOnError: false });
      // this is a janky hack to override default inline styles.
      // biome doesn't let us use !important in stylesheets.
      for (const span of el.querySelectorAll<HTMLElement>(".delimcenter")) {
        span.style.top = "0.1em";
      }
    },
    [str, displayMode],
  );

  return <div ref={ref} className="latex-wrapper" />;
};

export default Latex;
