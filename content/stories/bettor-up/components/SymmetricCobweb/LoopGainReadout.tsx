import type { FC } from "react";

interface LoopGainReadoutProps {
  gain: number;
  threshold?: number;
}

const LoopGainReadout: FC<LoopGainReadoutProps> = ({ gain, threshold = 1 }) => {
  const stable = Math.abs(gain) < threshold;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={`text-lg font-bold ${stable ? "text-green-700" : "text-red-600"}`}
      >
        {gain.toFixed(2)}
      </span>
      <span className="text-sm text-gray-600">
        For this curve, a $0.50 price is {stable ? "" : "un"}stable.
      </span>
    </div>
  );
};

export default LoopGainReadout;
