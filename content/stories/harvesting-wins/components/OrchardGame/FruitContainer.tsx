"use client";

import type { FC } from "react";
import { darkenHex } from "@/utils/colorHelpers";

export interface FruitContainerProps {
  color: string;
  count: number;
  clickable: boolean;
  faded: boolean;
  title: string;
  onRemove: () => void;
}

const FruitContainer: FC<FruitContainerProps> = ({
  color,
  count,
  clickable,
  faded,
  title,
  onRemove,
}) => {
  const bg = count === 0 ? darkenHex(color, 0.2) : color;
  const border = darkenHex(color, 0.2);

  return (
    <button
      type="button"
      onClick={clickable ? onRemove : undefined}
      disabled={!clickable}
      className={`flex flex-1 mx-[2%] rounded-lg items-center justify-center min-h-20 text-white [text-shadow:2px_2px_6px_black] ${faded ? "opacity-30" : "opacity-100"} ${clickable ? "cursor-pointer" : "cursor-not-allowed"}`}
      style={{
        backgroundColor: bg,
        border: `4px solid ${border}`,
      }}
    >
      {count > 0 && (
        <div className="text-center">
          <p className="mb-0 text-sm">{title}</p>
          <h1 className="text-5xl font-bold m-0">{count}</h1>
        </div>
      )}
    </button>
  );
};

export default FruitContainer;
