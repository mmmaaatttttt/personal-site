"use client";

import { type FC, useCallback, useEffect, useRef, useState } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import HorizontalBar from "@/components/story/shared/HorizontalBar";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { Button } from "@/components/ui/Button";
import { camelCaseToTitle } from "@/utils/stringHelpers";
import COLORS from "@/utils/styles";
import { strategies } from "../../data";

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
  const [playing, setPlaying] = useState(false);
  const [playData, setPlayData] = useState<PlayData[]>(() =>
    strategies.map(() => ({ gamesPlayed: 0, gamesWon: 0 })),
  );

  const playingRef = useRef(false);
  const lastTickRef = useRef<number>(0);

  const simulateGame = useCallback(
    (strategyFn: (counts: number[]) => number): boolean => {
      const counts = [...initialFruitCounts];
      let raven = initialRavenCount;
      const colorCount = counts.length;

      while (true) {
        const idx = Math.floor((colorCount + 2) * Math.random());
        if (idx < colorCount) {
          counts[idx] = Math.max(counts[idx] - 1, 0);
        } else if (idx === colorCount) {
          raven--;
        } else {
          for (let i = 0; i < wildCardCount; i++) {
            const si = strategyFn(counts);
            counts[si] = Math.max(counts[si] - 1, 0);
          }
        }
        if (counts.every((c) => c === 0)) return true;
        if (raven === 0) return false;
      }
    },
    [initialFruitCounts, initialRavenCount, wildCardCount],
  );

  const tick = useCallback(
    (now: number) => {
      if (!playingRef.current) return;

      if (now - lastTickRef.current > 20) {
        lastTickRef.current = now;
        setPlayData((prev) => {
          const next = prev.map((d, i) => {
            const won = +simulateGame(strategies[i].fn);
            return {
              gamesPlayed: d.gamesPlayed + 1,
              gamesWon: d.gamesWon + won,
            };
          });
          return next;
        });
      }

      requestAnimationFrame(tick);
    },
    [simulateGame],
  );

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => {
      const next = !prev;
      playingRef.current = next;
      if (next) {
        lastTickRef.current = 0;
        requestAnimationFrame(tick);
      }
      return next;
    });
  }, [tick]);

  const reset = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    setPlayData(strategies.map(() => ({ gamesPlayed: 0, gamesWon: 0 })));
  }, []);

  useEffect(() => {
    return () => {
      playingRef.current = false;
    };
  }, []);

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
