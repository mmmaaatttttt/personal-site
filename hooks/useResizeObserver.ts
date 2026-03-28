import { useState, useEffect, useCallback, useRef } from "react";

interface Dimensions {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const useResizeObserver = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const ref = useRef<HTMLDivElement>(null);

  const onResize = useCallback((entries: ResizeObserverEntry[]) => {
    if (!entries[0]) return;
    const { width, height, top, right, bottom, left } = entries[0].contentRect;
    setDimensions({ width, height, top, right, bottom, left });
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(onResize);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onResize]);

  return [ref, dimensions] as const;
};
