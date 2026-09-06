"use client";

import { type FC, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import styles from "./Standee.module.css";

interface AnimatedTileProps {
  animate: boolean;
  children: ReactNode;
}

const AnimatedTile: FC<AnimatedTileProps> = ({ animate, children }) => {
  const [shouldJiggle] = useState(() => animate);

  return (
    <div className={cn("relative", shouldJiggle && styles.jiggle)}>
      {children}
    </div>
  );
};

export default AnimatedTile;
