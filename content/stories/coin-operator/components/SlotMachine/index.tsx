"use client";

import { animate } from "framer-motion";
import { type FC, useRef, useState } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import ToggleSwitch from "@/components/story/shared/ToggleSwitch";
import { Button } from "@/components/ui/Button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import COLORS from "@/utils/styles";
import { NUM_SLOTS, SlotValue, SPIN_COST } from "../../data";
import { calculatePayout, spinReels } from "../../math";
import {
  BASE_SPIN_DURATION,
  HISTORY_STORAGE_KEY,
  REEL_STAGGER,
  type RoundEntry,
} from "./constants";
import Reel from "./Reel";
import StatusPanel from "./StatusPanel";
import TrendChart from "./TrendChart";

const CYCLE_SYMBOLS = Object.values(SlotValue) as SlotValue[];

const SlotMachine: FC = () => {
  const [displayValues, setDisplayValues] = useState<(SlotValue | null)[]>(
    Array(NUM_SLOTS).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(Array(NUM_SLOTS).fill(false));
  const [spinning, setSpinning] = useState(false);
  const [payout, setPayout] = useState<number | null>(null);
  const [history, setHistory, resetHistory] = useLocalStorage<RoundEntry[]>(
    HISTORY_STORAGE_KEY,
    [],
  );
  const [view, setView] = useState<"spin" | "trend">("spin");
  const lockedCountRef = useRef(0);

  const handleSpin = () => {
    const result = spinReels();
    const roundPayout = calculatePayout(result);

    lockedCountRef.current = 0;
    setSpinning(true);
    setPayout(null);
    setLocked(Array(NUM_SLOTS).fill(false));

    result.forEach((symbol, i) => {
      animate(0, 1, {
        duration: BASE_SPIN_DURATION + i * REEL_STAGGER,
        ease: "easeOut",
        onUpdate: (v) => {
          setDisplayValues((prev) => {
            const next = [...prev];
            next[i] =
              CYCLE_SYMBOLS[Math.floor(v * 37 + i * 3) % CYCLE_SYMBOLS.length];
            return next;
          });
        },
        onComplete: () => {
          setDisplayValues((prev) => {
            const next = [...prev];
            next[i] = symbol;
            return next;
          });
          setLocked((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });

          lockedCountRef.current += 1;
          if (lockedCountRef.current === NUM_SLOTS) {
            setSpinning(false);
            setPayout(roundPayout);
            setHistory((prev) => {
              const [prevCost, prevRevenue] = prev[prev.length - 1] ?? [0, 0];
              const entry: RoundEntry = [
                prevCost + SPIN_COST,
                prevRevenue + roundPayout,
              ];
              return [...prev, entry];
            });
          }
        },
      });
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ToggleSwitch
          leftText="Play Slots"
          rightText="View History"
          leftColor={COLORS.DARK_GRAY}
          rightColor={COLORS.DARK_GRAY}
          handleSwitchChange={(checked) => setView(checked ? "trend" : "spin")}
          noWrap
        />
        <Button variant="outline" onClick={resetHistory}>
          Clear History
        </Button>
      </div>
      {view === "spin" ? (
        <div className="mt-6 rounded-2xl border-4 border-yellow-600 bg-gradient-to-b from-neutral-800 to-black p-10 shadow-xl">
          <div className="rounded-lg border-2 border-neutral-900/60 bg-neutral-700 p-6 shadow-inner">
            <FlexContainer main="center" cross="center" className="gap-3">
              {displayValues.map((value, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: reel count and order are fixed
                <Reel key={i} value={value} active={spinning && !locked[i]} />
              ))}
            </FlexContainer>
          </div>
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleSpin}
              disabled={spinning}
              className="rounded-full bg-yellow-500 px-8 py-3 text-lg font-bold text-black hover:bg-yellow-400"
            >
              Pull!
            </Button>
          </div>
          <div className="mt-8">
            <StatusPanel cost={SPIN_COST} payout={payout} />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <TrendChart history={history} />
        </div>
      )}
    </div>
  );
};

export default SlotMachine;
