"use client";

import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import CobwebChart from "../CobwebChart";
import LoopGainReadout from "./LoopGainReadout";
import useSymmetricCobweb from "./useSymmetricCobweb";

const CONTAINER_WIDTH = "50%";

export default function SymmetricCobweb() {
  const { sliderData, map, cobwebPath, fixedPoints, gain } =
    useSymmetricCobweb();

  return (
    <NarrowContainer width={CONTAINER_WIDTH}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full">
          <SliderGroup data={sliderData} />
        </div>
        <CobwebChart
          map={map}
          cobwebPath={cobwebPath}
          fixedPoints={fixedPoints}
        />
        <LoopGainReadout gain={gain} />
      </div>
    </NarrowContainer>
  );
}
