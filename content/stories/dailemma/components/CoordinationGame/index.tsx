"use client";

import Caption from "@/components/story/shared/Caption";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import { payoffColor, useGameState } from "./useGameState";

const SLIDER_CONFIG = [
  {
    min: 5,
    max: 95,
    step: 1,
    initialValue: 50,
    title: (val: number) => `Automation savings: ${val}%`,
    color: COLORS.ORANGE,
  },
  {
    min: 5,
    max: 95,
    step: 1,
    initialValue: 40,
    title: (val: number) => `Consumer spending loss: ${val}%`,
    color: COLORS.BLUE,
  },
];

const fmtPayoff = (v: number) => {
  const pct = (v * 100).toFixed(1);
  return v > 0 ? `+${pct}%` : `${pct}%`;
};

interface CoordinationGameProps {
  caption?: string;
}

const CoordinationGame = ({ caption }: CoordinationGameProps) => {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [savingsPct, demandLossPct] = values;
  const { cells, isNE, isParetoOptimal } = useGameState(
    savingsPct / 100,
    demandLossPct / 100,
  );

  return (
    <Caption caption={caption}>
      <NarrowContainer width="65%">
        <SliderGroup data={sliderData} />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="w-1/3 p-2 sm:p-3" />
                <th className="w-1/3 p-2 sm:p-3 text-center font-semibold text-gray-700 border border-gray-300">
                  Firm B: Automate
                </th>
                <th className="w-1/3 p-2 sm:p-3 text-center font-semibold text-gray-700 border border-gray-300">
                  {"Firm B: Don't"}
                </th>
              </tr>
            </thead>
            <tbody>
              {(["Automate", "Don't"] as const).map((rowLabel, r) => (
                <tr key={rowLabel}>
                  <td className="h-24 border border-gray-300 font-semibold text-gray-700">
                    <div className="h-full flex items-center justify-center p-2 sm:p-3 text-center">
                      Firm A: {rowLabel}
                    </div>
                  </td>
                  {[0, 1].map((c) => {
                    const cell = cells[r][c];
                    const ne = isNE(r, c);
                    const po = isParetoOptimal(r, c);

                    let cellBg: string | undefined;
                    let cellOutline: string | undefined;
                    if (ne) {
                      cellBg = hexToRgba(COLORS.ORANGE, 0.15);
                      cellOutline = `2px solid ${COLORS.ORANGE}`;
                    } else if (po) {
                      cellBg = hexToRgba(COLORS.GREEN, 0.15);
                      cellOutline = `2px solid ${COLORS.GREEN}`;
                    }

                    return (
                      <td
                        key={c}
                        className="h-24 border border-gray-300"
                        style={{
                          backgroundColor: cellBg,
                          outline: cellOutline,
                        }}
                      >
                        <div className="h-full flex flex-col items-center justify-center p-2 sm:p-4 text-center">
                          <div className="font-mono text-xs sm:text-base">
                            <span style={{ color: payoffColor(cell.a) }}>
                              {fmtPayoff(cell.a)}
                            </span>
                            <span className="text-gray-400 mx-1">,</span>
                            <span style={{ color: payoffColor(cell.b) }}>
                              {fmtPayoff(cell.b)}
                            </span>
                          </div>
                          {(ne || po) && (
                            <div className="text-xs mt-1 font-bold">
                              {ne ? (
                                <span style={{ color: COLORS.ORANGE }}>
                                  Where both firms end up
                                </span>
                              ) : (
                                <span style={{ color: COLORS.GREEN }}>
                                  Better for both
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NarrowContainer>
    </Caption>
  );
};

export default CoordinationGame;
