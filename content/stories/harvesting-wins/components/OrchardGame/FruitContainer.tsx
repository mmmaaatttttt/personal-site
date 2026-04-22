"use client";

import { FC } from "react";
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
    <div
      onClick={clickable ? onRemove : undefined}
      className="flex flex-1 mx-[2%] rounded-lg items-center justify-center min-h-20 text-white"
      style={{
        backgroundColor: bg,
        border: `4px solid ${border}`,
        opacity: faded ? 0.3 : 1,
        cursor: clickable ? "pointer" : "not-allowed",
        textShadow: "2px 2px 6px black",
      }}
    >
      {count > 0 && (
        <div className="text-center">
          <p className="mb-0 text-sm">{title}</p>
          <h1 className="text-5xl font-bold m-0">{count}</h1>
        </div>
      )}
    </div>
  );
};

export default FruitContainer;
