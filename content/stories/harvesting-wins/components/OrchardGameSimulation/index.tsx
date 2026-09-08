"use client";

import { type FC, useCallback, useState } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import HorizontalBar from "@/components/story/shared/HorizontalBar";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { Button } from "@/components/ui/Button";
import { useTickLoop } from "@/hooks/useTickLoop";
import { camelCaseToTitle } from "@/utils/stringHelpers";
import COLORS from "@/utils/styles";
import { strategies } from "../../data";
import { simulateGame } from "./simulateGame";

const TICK_INTERVAL_MS = 20;

interface PlayData {
  gamesPlayed: number;
  gamesWon: number;
}

interface OrchardGameSimulationProps {
  fruitCounts?: number[];
  ravenCount?: number;
  wildCardCount?: number;
}

const OrchardGameSimulation: FC<OrchardGameSimulationProps> = ({
  fruitCounts: initialFruitCounts = [4, 4, 4, 4],
  ravenCount: initialRavenCount = 5,
  wildCardCount = 1,
}) => {
  const [playData, setPlayData] = useState<PlayData[]>(() =>
    strategies.map(() => ({ gamesPlayed: 0, gamesWon: 0 })),
  );

  const {
    playing,
    toggle: togglePlaying,
    stop,
  } = useTickLoop({
    tickIntervalMs: TICK_INTERVAL_MS,
    onTick: () => {
      setPlayData((prev) =>
        prev.map((d, i) => {
          const won = +simulateGame(
            initialFruitCounts,
            initialRavenCount,
            wildCardCount,
            strategies[i].fn,
          );
          return {
            gamesPlayed: d.gamesPlayed + 1,
            gamesWon: d.gamesWon + won,
          };
        }),
      );
    },
  });

  const reset = useCallback(() => {
    stop();
    setPlayData(strategies.map(() => ({ gamesPlayed: 0, gamesWon: 0 })));
  }, [stop]);

  return (
    <NarrowContainer width="100%" fullWidthAt="sm">
      <FlexContainer main="center">
        <Button variant="outline" onClick={togglePlaying} size="sm">
          {playing ? "Pause" : "Play"}
        </Button>
        {!playing && (
          <Button onClick={reset} className="ml-2" size="sm">
            Reset Simulation
          </Button>
        )}
      </FlexContainer>
      <div className="mt-4 space-y-4">
        {playData
          .map((d, i) => ({ d, label: camelCaseToTitle(strategies[i].name) }))
          .map(({ d, label }) => {
            const pct = ((d.gamesWon / d.gamesPlayed) * 100 || 0).toFixed(1);
            return (
              <HorizontalBar
                key={label}
                title={`${label} Strategy: ${pct}%`}
                data={[
                  {
                    size: d.gamesWon,
                    color: COLORS.GREEN,
                    tooltipText: `Games Won: ${d.gamesWon.toLocaleString()}`,
                  },
                  {
                    size: d.gamesPlayed - d.gamesWon,
                    color: COLORS.RED,
                    tooltipText: `Games Played: ${d.gamesPlayed.toLocaleString()}`,
                  },
                  {
                    size: 0,
                    color: COLORS.GRAY,
                    tooltipText: `Win Percentage: ${pct}%`,
                  },
                ]}
              />
            );
          })}
      </div>
    </NarrowContainer>
  );
};

export default OrchardGameSimulation;
