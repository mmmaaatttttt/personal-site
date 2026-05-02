"use client";

import { type FC, useState } from "react";
import FlexContainer from "@/components/story/shared/FlexContainer";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";

interface RadioLabel {
  text: string;
  color: string;
  disabled?: boolean;
}

interface RadioButtonGroupProps {
  labels: RadioLabel[];
  buttonText: string;
  handleRadioChange: (idx: number) => void;
  handleSelectConfirm: (idx: number) => void;
}

const RadioButtonGroup: FC<RadioButtonGroupProps> = ({
  labels,
  buttonText,
  handleRadioChange,
  handleSelectConfirm,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleChange = (idx: number) => {
    setSelectedIndex(idx);
    handleRadioChange(idx);
  };

  const handleConfirm = () => {
    if (selectedIndex === null) return;
    const confirmed = selectedIndex;
    setSelectedIndex(null);
    handleSelectConfirm(confirmed);
  };

  const options = labels.map((obj, i) => {
    const { text, color, disabled } = obj;
    return (
      <FlexContainer
        key={text}
        width="90%"
        main="center"
        cross="center"
        className="gap-2"
      >
        <input
          name="group"
          type="radio"
          id={`radio-${i}`}
          value={i}
          checked={selectedIndex === i}
          onChange={() => !disabled && handleChange(i)}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={`radio-${i}`}
          className="flex cursor-pointer items-center gap-2"
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black"
            style={{
              backgroundColor: disabled ? COLORS.RED : color,
            }}
          >
            {!disabled && selectedIndex === i && (
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {disabled && (
              <svg
                className="h-4 w-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </span>
          {disabled ? <del>{text}</del> : <span>{text}</span>}
        </label>
      </FlexContainer>
    );
  });

  return (
    <div>
      <FlexContainer main="around" cross="center" width="100%" shouldWrap>
        {options}
      </FlexContainer>
      <FlexContainer main="center" margin="1rem 0">
        {selectedIndex === null ? (
          <Button variant="white" disabled>
            Please make a selection.
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            style={{ backgroundColor: labels[selectedIndex].color }}
          >
            {buttonText}
          </Button>
        )}
      </FlexContainer>
    </div>
  );
};

export default RadioButtonGroup;
