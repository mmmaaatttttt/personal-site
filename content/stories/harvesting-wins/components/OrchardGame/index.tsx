"use client";

import { type FC, useCallback, useState } from "react";
import Figure from "@/components/story/shared/Figure";
import FlexContainer from "@/components/story/shared/FlexContainer";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import COLORS from "@/utils/styles";
import { INITIAL_COUNTS, SPINNER_COLORS } from "./constants";
import FruitContainer from "./FruitContainer";
import ScreenOverlay from "./ScreenOverlay";
import Spinner from "./Spinner";

type GameState = "start" | "playing" | "win" | "loss";

const RAVEN_IDX = INITIAL_COUNTS.length - 1; // 4
const BASKET_IDX = SPINNER_COLORS.length - 1; // 5

const OVERLAYS = {
  start: { title: "Orchard Game", buttonText: "Play", bg: COLORS.GRAY },
  win: { title: "You won!", buttonText: "Play Again", bg: COLORS.GREEN },
  loss: { title: "You lost.", buttonText: "Play Again", bg: COLORS.RED },
} as const;

const OrchardGame: FC<{ caption?: string }> = ({ caption }) => {
  const [counts, setCounts] = useState<number[]>(INITIAL_COUNTS);
  const [fruitBasketEnabled, setFruitBasketEnabled] = useState(false);
  const [gameState, setGameState] = useState<GameState>("start");
  const [gamesPlayed, setGamesPlayed, removeGamesPlayed] = useLocalStorage(
    "harvestingWins:gamesPlayed",
    0,
  );
  const [gamesWon, setGamesWon, removeGamesWon] = useLocalStorage(
    "harvestingWins:gamesWon",
    0,
  );

  const startGame = useCallback(() => {
    setCounts(INITIAL_COUNTS);
    setFruitBasketEnabled(false);
    setGameState("playing");
    setGamesPlayed((prev) => prev + 1);
  }, [setGamesPlayed]);

  const clearData = useCallback(() => {
    removeGamesWon();
    removeGamesPlayed();
  }, [removeGamesWon, removeGamesPlayed]);

  const removeAt = useCallback(
    (idx: number) => {
      setFruitBasketEnabled(false);
      setCounts((prev) => {
        const next = [...prev];
        next[idx] = Math.max(next[idx] - 1, 0);
        if (next.slice(0, -1).every((c) => c === 0)) {
          setGameState("win");
          setGamesWon((w) => w + 1);
        } else if (next[next.length - 1] === 0) {
          setGameState("loss");
        }
        return next;
      });
    },
    [setGamesWon],
  );

  const handleSpinEnd = useCallback(
    (idx: number) => {
      if (idx === BASKET_IDX) {
        setFruitBasketEnabled(true);
      } else {
        removeAt(Math.min(idx, RAVEN_IDX));
      }
    },
    [removeAt],
  );

  const message = fruitBasketEnabled
    ? "Click on a square to remove a fruit."
    : gameState !== "playing"
      ? "\u00a0"
      : "";

  return (
    <Figure caption={caption}>
      <NarrowContainer width="77%" fullWidthAt="sm">
        <div className="relative pb-4">
          {gameState !== "playing" && (
            <ScreenOverlay backgroundColor={OVERLAYS[gameState].bg}>
              <h1 className="text-3xl font-bold mb-2">
                {OVERLAYS[gameState].title}
              </h1>
              <p>Games won: {gamesWon}</p>
              <p>Games played: {gamesPlayed}</p>
              <div className="flex flex-col gap-2 mt-4">
                <Button onClick={startGame}>
                  {OVERLAYS[gameState].buttonText}
                </Button>
                <Button variant="outline" onClick={clearData}>
                  Clear Game Data
                </Button>
              </div>
            </ScreenOverlay>
          )}
          <FlexContainer column className="gap-4">
            <NarrowContainer width="60%">
              <Spinner onSpinEnd={handleSpinEnd} message={message} />
            </NarrowContainer>
            <FlexContainer>
              {SPINNER_COLORS.slice(0, -1).map((color, i) => {
                const isRaven = i === RAVEN_IDX;
                return (
                  <FruitContainer
                    key={color}
                    color={color}
                    count={counts[i]}
                    clickable={counts[i] > 0 && !isRaven && fruitBasketEnabled}
                    faded={isRaven && fruitBasketEnabled}
                    title={isRaven ? "Raven" : "Fruit"}
                    onRemove={() => removeAt(i)}
                  />
                );
              })}
            </FlexContainer>
          </FlexContainer>
        </div>
      </NarrowContainer>
    </Figure>
  );
};

export default OrchardGame;
