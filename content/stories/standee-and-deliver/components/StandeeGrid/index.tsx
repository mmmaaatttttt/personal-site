import type { FC } from "react";
import { cn } from "@/lib/utils";
import { CHARACTER_BACKGROUND_CLASSES, type StandeeData } from "../../data";
import Standee from "../Standee";
import {
  getGridColumnClass,
  getTallyBadgeClass,
  groupByCharacter,
} from "./utils";

interface StandeeGridProps {
  standeeData: StandeeData[];
  tallies: number[];
  starterFlags?: boolean[];
  lastDrawnIndex: number | null;
}

const StandeeGrid: FC<StandeeGridProps> = ({
  standeeData,
  tallies,
  starterFlags,
  lastDrawnIndex,
}) => {
  const groups = groupByCharacter(standeeData, tallies);
  const tallyBadgeClass = getTallyBadgeClass(groups.length);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-md border-2 border-gray-300 p-2",
        getGridColumnClass(groups.length),
      )}
    >
      {groups.map((group) => (
        <div
          key={group.character}
          className={cn(
            "rounded-md p-2",
            CHARACTER_BACKGROUND_CLASSES[group.character] ?? "bg-gray-100",
          )}
        >
          <div className="mb-1 text-center text-sm font-bold text-white">
            {group.character}
          </div>
          <div className="grid grid-cols-6 gap-1">
            {group.items.map(({ index, standee, tally }) => (
              <Standee
                key={`${standee.character}-${standee.pose}`}
                image={standee.image}
                alt={`${standee.character} (${standee.pose})`}
                tally={tally}
                isStarter={starterFlags?.[index] ?? false}
                tallyBadgeClass={tallyBadgeClass}
                animate={index === lastDrawnIndex}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StandeeGrid;
