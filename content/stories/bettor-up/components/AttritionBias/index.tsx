"use client";

import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Latex from "@/components/story/shared/Latex";
import { SliderGroup } from "@/components/story/shared/Slider";
import useAttritionBias from "./useAttritionBias";
import { observedRateLatex, trueRateLatex } from "./utils";

export default function AttritionBias() {
  const {
    sliderData,
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
  } = useAttritionBias();

  const trueLatex = trueRateLatex(trueResponseRate);
  const observedLatex = observedRateLatex(
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
  );

  return (
    <ColumnLayout break="lg">
      <div className="flex flex-col justify-center h-full min-w-0">
        <SliderGroup data={sliderData} />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 min-w-0">
        <div data-testid="true-rate-formula" className="max-w-full">
          <div className="text-center font-bold text-gray-800">True rate</div>
          <div className="overflow-x-auto">
            <Latex str={trueLatex} displayMode />
          </div>
        </div>
        <div data-testid="observed-rate-formula" className="max-w-full">
          <div className="text-center font-bold text-gray-800">
            Observed rate
          </div>
          <div className="overflow-x-auto">
            <Latex str={observedLatex} displayMode />
          </div>
        </div>
      </div>
    </ColumnLayout>
  );
}
