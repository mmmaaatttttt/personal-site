"use client";

import { type ChangeEvent, type FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import Latex from "@/components/story/shared/Latex";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import { displayIntegerDifference } from "./helpers";

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const MIN = -1_000_000;
const MAX = 1_000_000;

const PRIME_OPTIONS = PRIMES.map((p) => ({
  value: String(p),
  label: `Selected prime: ${p}`,
}));

interface PAdicCalculatorProps {
  caption?: string;
}

const PAdicCalculator: FC<PAdicCalculatorProps> = ({ caption }) => {
  const [prime, setPrime] = useState(PRIME_OPTIONS[0]);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  const handleNumber =
    (setter: (n: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      const val = Math.round(Number(e.target.value));
      if (MIN <= val && val <= MAX) setter(val);
    };

  const latexStr = displayIntegerDifference(num1, num2, Number(prime.value));

  return (
    <Caption caption={caption}>
      <NarrowContainer width="60%">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Select
              name="prime-select"
              value={prime.value}
              onChange={setPrime}
              options={PRIME_OPTIONS}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <label htmlFor="num1-input" className="text-sm font-medium">
                Number 1
              </label>
              <input
                id="num1-input"
                type="number"
                step="1"
                min={MIN}
                max={MAX}
                defaultValue={0}
                onChange={handleNumber(setNum1)}
                className="w-36 rounded-lg border-2 border-gray-200 px-3 py-2 text-center text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <label htmlFor="num2-input" className="text-sm font-medium">
                Number 2
              </label>
              <input
                id="num2-input"
                type="number"
                step="1"
                min={MIN}
                max={MAX}
                defaultValue={0}
                onChange={handleNumber(setNum2)}
                className="w-36 rounded-lg border-2 border-gray-200 px-3 py-2 text-center text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div data-testid="padic-formula">
            <Latex str={latexStr} displayMode />
          </div>
        </div>
      </NarrowContainer>
    </Caption>
  );
};

export default PAdicCalculator;
