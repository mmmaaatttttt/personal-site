"use client";

import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Latex from "@/components/story/shared/Latex";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import { BASE_SLIDER_CONFIG } from "../../sliderConfig";
import { cooperativeFormulaLatex, nashFormulaLatex } from "./formatFormula";

const AutomationRateCalculator = () => {
  const { values, sliderData } = useSliders(BASE_SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);

  const nashLatex = nashFormulaLatex(savings, demandLoss, difficulty, numFirms);
  const cooperativeLatex = cooperativeFormulaLatex(
    savings,
    demandLoss,
    difficulty,
  );

  return (
    <ColumnLayout break="sm">
      <div className="flex flex-col justify-center h-full">
        <SliderGroup data={sliderData} />
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <div data-testid="nash-formula">
          <Latex str={nashLatex} displayMode />
        </div>
        <div data-testid="cooperative-formula">
          <Latex str={cooperativeLatex} displayMode />
        </div>
      </div>
    </ColumnLayout>
  );
};

export default AutomationRateCalculator;
