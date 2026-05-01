"use client";

import { FC, useRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import styles from "./Latex.module.css";

interface LatexProps {
  str: string;
  displayMode?: boolean;
}

const Latex: FC<LatexProps> = ({ str, displayMode = false }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(str, ref.current, { displayMode, throwOnError: false });
    }
  }, [str, displayMode]);

  return <div ref={ref} className={styles.wrapper} />;
};

export default Latex;
