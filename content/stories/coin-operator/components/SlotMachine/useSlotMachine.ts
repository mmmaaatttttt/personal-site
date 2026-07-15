import { animate } from "framer-motion";
import { useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { evaluateActions } from "../../bonusMath";
import { NUM_SLOTS, type SlotResult, SlotValue, SPIN_COST } from "../../data";
import { calculatePayout, pickWeightedSymbol, spinReels } from "../../math";
import {
  BASE_SPIN_DURATION,
  HISTORY_STORAGE_KEY,
  REEL_STAGGER,
  type RoundEntry,
} from "./constants";

const CYCLE_SYMBOLS = Object.values(SlotValue) as SlotValue[];

export function useSlotMachine(maxBonusSpins: number) {
  const hasBonusSpins = maxBonusSpins > 0;

  const [displayValues, setDisplayValues] = useState<(SlotValue | null)[]>(
    Array(NUM_SLOTS).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(Array(NUM_SLOTS).fill(false));
  const [mainSpinning, setMainSpinning] = useState(false);
  const [bonusSpinning, setBonusSpinning] = useState(false);
  const [roundPending, setRoundPending] = useState(false);
  const [cost, setCost] = useState(0);
  const [bonusSpinsRemaining, setBonusSpinsRemaining] = useState(maxBonusSpins);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showEV, setShowEV] = useState(false);
  // Sticks true forever once the bonus round has been reached for the first
  // time, so the EV toggle button doesn't pop in and out of existence on
  // every spin/finalize cycle.
  const [evToggleRevealed, setEvToggleRevealed] = useState(false);
  const [history, setHistory, resetHistory] = useLocalStorage<RoundEntry[]>(
    `${HISTORY_STORAGE_KEY}:${maxBonusSpins}`,
    [],
  );
  const [view, setView] = useState<"spin" | "trend">("spin");
  const lockedCountRef = useRef(0);

  const isBusy = mainSpinning || bonusSpinning;
  const isBoardFilled = displayValues.every((v) => v !== null);
  // isBoardFilled alone isn't enough to show a payout: the cycling animation
  // fills every slot with *some* non-null symbol almost immediately, well
  // before a spin actually resolves. Gate on !isBusy too.
  const payout =
    !isBusy && isBoardFilled
      ? calculatePayout(displayValues as SlotResult)
      : null;

  const recordRound = (finalCost: number, finalPayout: number) => {
    setHistory((prev) => {
      const [prevCost, prevRevenue] = prev[prev.length - 1] ?? [0, 0];
      return [...prev, [prevCost + finalCost, prevRevenue + finalPayout]];
    });
  };

  const handlePull = () => {
    if (isBusy) return;

    if (roundPending && payout !== null) {
      recordRound(cost, payout);
    }

    const result = spinReels();
    lockedCountRef.current = 0;
    setMainSpinning(true);
    setRoundPending(false);
    setSelectedIndex(null);
    setLocked(Array(NUM_SLOTS).fill(false));
    setCost(SPIN_COST);
    setBonusSpinsRemaining(maxBonusSpins);

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
            setMainSpinning(false);
            if (hasBonusSpins) {
              setRoundPending(true);
              setEvToggleRevealed(true);
            } else {
              recordRound(SPIN_COST, calculatePayout(result));
            }
          }
        },
      });
    });
  };

  const handleReelClick = (index: number) => {
    if (!roundPending || isBusy || bonusSpinsRemaining === 0) return;
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  const handleBonusSpin = () => {
    if (selectedIndex === null || isBusy || bonusSpinsRemaining === 0) return;

    const idx = selectedIndex;
    const newSymbol = pickWeightedSymbol();
    const finalBoard = displayValues.map((v, i) =>
      i === idx ? newSymbol : v,
    ) as SlotResult;
    const finalPayout = calculatePayout(finalBoard);
    const newCost = cost + SPIN_COST;
    const newRemaining = bonusSpinsRemaining - 1;

    setBonusSpinning(true);

    animate(0, 1, {
      duration: BASE_SPIN_DURATION,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplayValues((prev) => {
          const next = [...prev];
          next[idx] = CYCLE_SYMBOLS[Math.floor(v * 37) % CYCLE_SYMBOLS.length];
          return next;
        });
      },
      onComplete: () => {
        setDisplayValues((prev) => {
          const next = [...prev];
          next[idx] = newSymbol;
          return next;
        });
        setCost(newCost);
        setBonusSpinsRemaining(newRemaining);
        setBonusSpinning(false);
        setSelectedIndex(null);

        if (newRemaining === 0) {
          recordRound(newCost, finalPayout);
          setRoundPending(false);
        }
      },
    });
  };

  const actionValues =
    roundPending && bonusSpinsRemaining > 0 && isBoardFilled
      ? evaluateActions(displayValues as SlotResult, bonusSpinsRemaining)
      : null;

  const canSelectReel = roundPending && !isBusy && bonusSpinsRemaining > 0;
  const canBonusSpin = canSelectReel && selectedIndex !== null;

  return {
    hasBonusSpins,
    displayValues,
    locked,
    mainSpinning,
    bonusSpinning,
    isBusy,
    roundPending,
    cost,
    bonusSpinsRemaining,
    selectedIndex,
    showEV,
    setShowEV,
    evToggleRevealed,
    history,
    resetHistory,
    view,
    setView,
    payout,
    actionValues,
    canSelectReel,
    canBonusSpin,
    handlePull,
    handleReelClick,
    handleBonusSpin,
  };
}
