"use client";

import { useEffect, useState } from "react";

export function useScrollThreshold(threshold: number): boolean {
  const [reached, setReached] = useState(false);

  useEffect(() => {
    if (reached) return;

    const checkScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      if (window.scrollY / docHeight >= threshold) {
        setReached(true);
      }
    };

    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, [reached, threshold]);

  return reached;
}
