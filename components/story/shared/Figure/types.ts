import type { ReactNode } from "react";

export interface FigureProps {
  children: ReactNode;
  caption?: string;
  className?: string;
  captionMarginTop?: string;
  bleed?: boolean;
}
