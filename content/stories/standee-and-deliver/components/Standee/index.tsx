import type { FC } from "react";
import { cn } from "@/lib/utils";
import AnimatedTile from "./AnimatedTile";

interface StandeeProps {
  image: string;
  alt: string;
  tally: number;
  isStarter: boolean;
  tallyBadgeClass?: string;
  animate: boolean;
}

const DEFAULT_TALLY_BADGE_CLASS = "-top-0.5 right-0.25 text-[10px]";

const Standee: FC<StandeeProps> = ({
  image,
  alt,
  tally,
  isStarter,
  tallyBadgeClass = DEFAULT_TALLY_BADGE_CLASS,
  animate,
}) => {
  const found = isStarter || tally > 0;
  const imageClass = found ? "" : "grayscale";

  return (
    <AnimatedTile key={tally} animate={animate}>
      <img
        src={image}
        alt={alt}
        width={256}
        height={256}
        loading="lazy"
        className={cn("h-auto w-full bg-white", imageClass)}
      />
      {!isStarter && (
        <span
          className={cn("absolute font-bold text-gray-900", tallyBadgeClass)}
        >
          {tally}
        </span>
      )}
    </AnimatedTile>
  );
};

export default Standee;
