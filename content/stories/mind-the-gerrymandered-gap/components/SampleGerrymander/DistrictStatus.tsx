"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/Button";
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
    <div className="flex flex-col items-center gap-2">
      {districts.length > rowCount ? (
        <h2>Too many districts!</h2>
      ) : (
        Array.from({ length: rowCount }, (_, idx) => idx + 1).map(
          (districtNum) => {
            const district = districts[districtNum - 1];
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
              <div key={districtNum} className="flex items-center gap-2">
                <h4 className="!my-0" style={{ color: labelColor }}>
                  D{districtNum}: {size} {msgByColor}
                </h4>
                {isComplete ? (
                  <CheckCircle2 size={24} color={COLORS.GREEN} />
                ) : (
                  <XCircle size={24} color={COLORS.RED} />
                )}
              </div>
            );
          },
        )
      )}
      <div className="mt-2 flex gap-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={!saveable}
          className={
            saveable ? "bg-green hover:bg-green/90" : "bg-gray hover:bg-gray/90"
          }
        >
          {saveable ? "Save" : "Saved"}
        </Button>
        <Button size="sm" className="bg-red hover:bg-red/90" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default DistrictStatus;
