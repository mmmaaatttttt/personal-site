"use client";

import ColumnLayout from "@/components/story/shared/ColumnLayout";
import FlexContainer from "@/components/story/shared/FlexContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import CobwebChart from "../CobwebChart";
import TrueRateMarker from "./TrueRateMarker";
import useAttritionFeedback from "./useAttritionFeedback";

export default function AttritionFeedback() {
  const { sliderData, map, cobwebPath, fixedPoints, trueResponseRate } =
    useAttritionFeedback();

  return (
    <ColumnLayout break="lg">
      <FlexContainer column cross="center" className="h-full">
        <SliderGroup data={sliderData} />
      </FlexContainer>
      <CobwebChart map={map} cobwebPath={cobwebPath} fixedPoints={fixedPoints}>
        <TrueRateMarker trueResponseRate={trueResponseRate} />
      </CobwebChart>
    </ColumnLayout>
  );
}
