import React from "react";
import FlexContainer from "./FlexContainer";
import LabeledSlider from "./LabeledSlider";

interface SliderData {
  min: number;
  max: number;
  step?: number;
  value: number;
  handleValueChange: (val: number) => void;
  title: string | ((val: number) => string);
  color: string;
  key?: any;
  tickCount?: number;
  minIcon?: string;
  maxIcon?: string;
  fadeIcons?: boolean;
}

interface SliderGroupProps {
  data: SliderData[];
  column?: boolean;
}

const SliderGroup: React.FC<SliderGroupProps> = ({ data = [], column = true }) => {
  const sliders = data && Array.isArray(data) ? data.map((d, i) => {
    const title = typeof d.title === "function" ? d.title(d.value) : (d.title || "");
    return (
      <div key={d.key ?? i} className="m-1 flex-1">
        <LabeledSlider
          min={d.min}
          max={d.max}
          step={d.step}
          value={d.value}
          handleValueChange={d.handleValueChange}
          title={title}
          color={d.color}
          tickCount={d.tickCount}
          minIcon={d.minIcon}
          maxIcon={d.maxIcon}
          fadeIcons={d.fadeIcons}
        />
      </div>
    );
  }) : [];

  return (
    <FlexContainer column={column} cross="center" flex={data.length}>
      {sliders}
    </FlexContainer>
  );
};

export default SliderGroup;
