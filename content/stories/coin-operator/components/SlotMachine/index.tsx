"use client";

import type { FC } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import ToggleSwitch from "@/components/story/shared/ToggleSwitch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import COLORS from "@/utils/styles";
import Reel from "./Reel";
import StatusPanel from "./StatusPanel";
import TrendChart from "./TrendChart";
import { useSlotMachine } from "./useSlotMachine";

interface SlotMachineProps {
  /** Bonus re-spins available per round. 0 (the default) is the plain
   *  single-pull machine; a positive value enables the reel-select + bonus
   *  spin mechanic and its EV toggle. */
  maxBonusSpins?: number;
}

const SlotMachine: FC<SlotMachineProps> = ({ maxBonusSpins = 0 }) => {
  const {
    hasBonusSpins,
    displayValues,
    locked,
    mainSpinning,
    bonusSpinning,
    isBusy,
    cost,
    bonusSpinsRemaining,
    selectedIndex,
    showEV,
    setShowEV,
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
  } = useSlotMachine(maxBonusSpins);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <ToggleSwitch
            leftText="Play Slots"
            rightText="View History"
            leftColor={COLORS.DARK_GRAY}
            rightColor={COLORS.DARK_GRAY}
            handleSwitchChange={(checked) =>
              setView(checked ? "trend" : "spin")
            }
            noWrap
          />
          {hasBonusSpins && view === "spin" && (
            <ToggleSwitch
              leftText="Show Expected Value"
              rightText="Hide Expected Value"
              leftColor={COLORS.DARK_GRAY}
              rightColor={COLORS.DARK_GRAY}
              handleSwitchChange={setShowEV}
              noWrap
            />
          )}
        </div>
        <Button variant="outline" onClick={resetHistory}>
          Clear History
        </Button>
      </div>
      {view === "spin" ? (
        <div className="mt-6 rounded-2xl border-4 border-yellow-600 bg-gradient-to-b from-neutral-800 to-black p-10 shadow-xl">
          <div className="rounded-lg border-2 border-neutral-900/60 bg-neutral-700 p-6 shadow-inner">
            <FlexContainer main="center" cross="center" className="gap-3">
              {displayValues.map((value, i) => {
                if (!hasBonusSpins) {
                  return (
                    <Reel
                      // biome-ignore lint/suspicious/noArrayIndexKey: reel count and order are fixed
                      key={i}
                      value={value}
                      active={mainSpinning && !locked[i]}
                    />
                  );
                }

                const evValue =
                  showEV && actionValues && value
                    ? actionValues.spin[value]
                    : undefined;

                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: reel count and order are fixed
                  <div key={i} className="relative">
                    <button
                      type="button"
                      onClick={() => handleReelClick(i)}
                      disabled={!canSelectReel}
                      aria-pressed={selectedIndex === i}
                      className={cn(
                        "rounded-md disabled:cursor-not-allowed",
                        selectedIndex === i && "ring-4 ring-yellow-400",
                      )}
                    >
                      <Reel
                        value={value}
                        active={
                          mainSpinning
                            ? !locked[i]
                            : bonusSpinning && selectedIndex === i
                        }
                      />
                    </button>
                    {evValue !== undefined && (
                      <span className="-bottom-2 -translate-x-1/2 absolute left-1/2 rounded-full bg-white px-2 font-mono text-black text-xs shadow">
                        {evValue.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })}
            </FlexContainer>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              onClick={handlePull}
              disabled={isBusy}
              className="rounded-full bg-yellow-500 px-8 py-3 text-lg font-bold text-black hover:bg-yellow-400"
            >
              Pull!
            </Button>
            {hasBonusSpins && (
              <Button
                onClick={handleBonusSpin}
                disabled={!canBonusSpin}
                className="rounded-full bg-purple-500 px-8 py-3 text-lg font-bold text-white hover:bg-purple-400"
              >
                Bonus Spin ({bonusSpinsRemaining} remaining)
              </Button>
            )}
          </div>
          <div className="mt-8">
            <StatusPanel cost={cost} payout={payout} />
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
