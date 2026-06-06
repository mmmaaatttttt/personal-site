import { format } from "d3-format";
import type { Arc, DefaultArcObject, PieArcDatum } from "d3-shape";
import {
  type MotionValue,
  motion,
  useSpring,
  useTransform,
} from "framer-motion";
import { type FC, useEffect, useState } from "react";

interface AnimatedPercentageProps {
  startAngle: MotionValue<number>;
  endAngle: MotionValue<number>;
  textFill: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  percentFormat: string;
}

const AnimatedPercentage: FC<AnimatedPercentageProps> = ({
  startAngle,
  endAngle,
  textFill,
  x,
  y,
  percentFormat,
}) => {
  const [displayValue, setDisplayValue] = useState("");

  const percentageValue = useTransform(
    [startAngle, endAngle],
    ([sa, ea]: number[]) => format(percentFormat)((ea - sa) / (2 * Math.PI)),
  );

  const opacityValue = useTransform(
    [startAngle, endAngle],
    ([sa, ea]: number[]) => ((ea - sa) / (2 * Math.PI) > 0.05 ? 1 : 0),
  );

  useEffect(() => {
    return percentageValue.on("change", (latest) => setDisplayValue(latest));
  }, [percentageValue]);

  useEffect(() => {
    setDisplayValue(percentageValue.get());
  }, [percentageValue.get]);

  return (
    <motion.text
      style={{ x, y, opacity: opacityValue }}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="24"
      fill={textFill}
      className="pointer-events-none"
    >
      {displayValue}
    </motion.text>
  );
};

interface PieSliceProps {
  datum: PieArcDatum<number>;
  index: number;
  pathArc: Arc<unknown, DefaultArcObject>;
  colorScale: (key: number) => string;
  stroke: string;
  showLabels: boolean;
  textFill: string;
  percentFormat: string;
}

const PieSlice: FC<PieSliceProps> = ({
  datum,
  index,
  pathArc,
  colorScale,
  stroke,
  showLabels,
  textFill,
  percentFormat,
}) => {
  const startAngle = useSpring(datum.startAngle, { bounce: 0, duration: 500 });
  const endAngle = useSpring(datum.endAngle, { bounce: 0, duration: 500 });

  useEffect(() => {
    startAngle.set(datum.startAngle);
    endAngle.set(datum.endAngle);
  }, [datum.startAngle, datum.endAngle, startAngle, endAngle]);

  const d = useTransform(
    [startAngle, endAngle],
    ([sa, ea]: number[]) =>
      pathArc({
        startAngle: sa,
        endAngle: ea,
        innerRadius: 0,
        outerRadius: 0,
      })!,
  );

  const labelX = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => {
    const centroid = pathArc.centroid({
      startAngle: sa,
      endAngle: ea,
      innerRadius: 0,
      outerRadius: 0,
    });
    return centroid[0];
  });

  const labelY = useTransform([startAngle, endAngle], ([sa, ea]: number[]) => {
    const centroid = pathArc.centroid({
      startAngle: sa,
      endAngle: ea,
      innerRadius: 0,
      outerRadius: 0,
    });
    return centroid[1];
  });

  return (
    <>
      <motion.path
        d={d}
        fill={colorScale(index)}
        stroke={stroke}
        strokeWidth={3}
      />
      {showLabels && (
        <AnimatedPercentage
          startAngle={startAngle}
          endAngle={endAngle}
          textFill={textFill}
          x={labelX}
          y={labelY}
          percentFormat={percentFormat}
        />
      )}
    </>
  );
};

export default PieSlice;
