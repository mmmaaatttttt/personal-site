"use client";

import Caption from "@/components/story/shared/Caption";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import { payoffColor, useGameState } from "./useGameState";

const SLIDER_CONFIG = [
  {
    min: 0.05,
    max: 0.95,
    initialValue: 0.4,
    title: (val: number) =>
      `How much automation saves per task: ${val.toFixed(2)}`,
    color: COLORS.ORANGE,
  },
  {
    min: 0.05,
    max: 0.95,
    initialValue: 0.6,
    title: (val: number) =>
      `Consumer spending lost per automated job: ${val.toFixed(2)}`,
    color: COLORS.BLUE,
  },
];

const fmtPayoff = (v: number) => (v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

interface CoordinationGameProps {
  caption?: string;
}

const CoordinationGame = ({ caption }: CoordinationGameProps) => {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [savings, demandLoss] = values;
  const { cells, isNE, isParetoOptimal, gameLabel, gameLabelColor } =
    useGameState(savings, demandLoss);

  return (
    <Caption caption={caption}>
      <NarrowContainer width="65%">
        <SliderGroup data={sliderData} />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-2" />
                <th className="p-3 text-center font-semibold text-gray-700 border border-gray-300">
                  Firm B: Automate
                </th>
                <th className="p-3 text-center font-semibold text-gray-700 border border-gray-300">
                  {"Firm B: Don't"}
                </th>
              </tr>
            </thead>
            <tbody>
              {(["Automate", "Don't"] as const).map((rowLabel, r) => (
                <tr key={rowLabel}>
                  <td className="p-3 font-semibold text-gray-700 border border-gray-300 text-center whitespace-nowrap">
                    Firm A: {rowLabel}
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
                        className="p-4 text-center border border-gray-300"
                        style={{
                          backgroundColor: cellBg,
                          outline: cellOutline,
                        }}
                      >
                        <div className="font-mono text-base">
                          <span style={{ color: payoffColor(cell.a) }}>
                            {fmtPayoff(cell.a)}
                          </span>
                          <span className="text-gray-400 mx-1">,</span>
                          <span style={{ color: payoffColor(cell.b) }}>
                            {fmtPayoff(cell.b)}
                          </span>
                        </div>
                        {ne && (
                          <div
                            className="text-xs mt-1 font-bold"
                            style={{ color: COLORS.ORANGE }}
                          >
                            Where both firms end up
                          </div>
                        )}
                        {po && (
                          <div
                            className="text-xs mt-1 font-bold"
                            style={{ color: COLORS.GREEN }}
                          >
                            Better for both
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p
          className="mt-4 text-sm text-center font-medium"
          style={{ color: gameLabelColor }}
        >
          {gameLabel}
        </p>
      </NarrowContainer>
    </Caption>
  );
};

export default CoordinationGame;
