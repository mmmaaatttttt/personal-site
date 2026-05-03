import { AnimatePresence, motion } from "framer-motion";
import type { FC } from "react";
import Tooltip, { useTooltip } from "../Tooltip";

interface BarData {
  size: number;
  color: string;
  tooltipText?: string;
  key?: string | number;
}

interface HorizontalBarProps {
  title?: string;
  data: BarData[];
  height?: number;
}

const HorizontalBar: FC<HorizontalBarProps> = ({
  title = "",
  data,
  height = 24,
}) => {
  const { tooltip, showTooltip, hideTooltip } = useTooltip();

  const total = data.reduce((sum, d) => sum + d.size, 0) || 1;

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-center font-bold text-gray-800 mb-2">{title}</h4>
      )}
      <div
        role="img"
        className="flex w-full overflow-hidden rounded-lg border border-gray-300"
        style={{ height }}
        onMouseLeave={hideTooltip}
        onTouchEnd={hideTooltip}
      >
        <AnimatePresence>
          {data.map((d, i) => {
            const widthPct = (d.size / total) * 100;
            return (
              <motion.div
                key={d.key ?? i}
                initial={{ width: 0 }}
                animate={{ width: `${widthPct}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ backgroundColor: d.color }}
                className="h-full cursor-pointer hover:brightness-110"
                onMouseMove={
                  d.tooltipText ? showTooltip("", d.tooltipText) : undefined
                }
                onTouchMove={
                  d.tooltipText ? showTooltip("", d.tooltipText) : undefined
                }
              />
            );
          })}
        </AnimatePresence>
      </div>
      <Tooltip info={tooltip} />
    </div>
  );
};

export default HorizontalBar;
