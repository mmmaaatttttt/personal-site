"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { FC } from "react";
import COLORS from "@/utils/styles";

interface DistrictStatusProps {
  rowCount: number;
  colCount: number;
  districts: [number, number][][];
  saveable: boolean;
  onSave: () => void;
  onReset: () => void;
}

const DistrictStatus: FC<DistrictStatusProps> = ({
  rowCount,
  colCount,
  districts,
  saveable,
  onSave,
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-around gap-2">
      {districts.length > rowCount ? (
        <h2>Too many districts!</h2>
      ) : (
        Array.from({ length: rowCount }, (_, idx) => {
          const district = districts[idx];
          const size = district ? district.length : "--";
          const isComplete = district && district.length === colCount;

          let labelColor = COLORS.BLACK;
          let msgByColor: string | null = null;

          if (district) {
            const blueTotal = district.filter(([r]) => r % 2 === 0).length;
            const redTotal = district.filter(([r]) => r % 2 === 1).length;
            msgByColor = `(${blueTotal} blue, ${redTotal} red)`;
            if (blueTotal > redTotal) labelColor = COLORS.DARK_BLUE;
            if (redTotal > blueTotal) labelColor = COLORS.RED;
          }

          return (
            <div key={idx} className="flex items-center gap-2">
              <h4 className="m-0" style={{ color: labelColor }}>
                D{idx + 1}: {size} {msgByColor}
              </h4>
              {isComplete ? (
                <CheckCircle2 size={24} color={COLORS.GREEN} />
              ) : (
                <XCircle size={24} color={COLORS.RED} />
              )}
            </div>
          );
        })
      )}
      <div className="mt-2 flex gap-2">
        <button
          onClick={onSave}
          disabled={!saveable}
          className="cursor-pointer rounded border-none px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: saveable ? COLORS.GREEN : COLORS.GRAY }}
        >
          {saveable ? "Save" : "Saved"}
        </button>
        <button
          onClick={onReset}
          className="cursor-pointer rounded border-none px-4 py-2 text-white"
          style={{ backgroundColor: COLORS.RED }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DistrictStatus;
