"use client";

import { type FC, useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  leftText: string;
  rightText: string;
  leftColor: string;
  rightColor: string;
  handleSwitchChange: (checked: boolean) => void;
  /** When true, labels never wrap to a second line. Default false preserves
   *  existing wrap-permitted behavior for stories already relying on it. */
  noWrap?: boolean;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  leftText,
  rightText,
  leftColor,
  rightColor,
  handleSwitchChange,
  noWrap = false,
}) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    const next = !checked;
    setChecked(next);
    handleSwitchChange(next);
  };

  const activeColor = checked ? rightColor : leftColor;

  return (
    <div className="flex items-center justify-center">
      <span
        className={cn(
          "flex-1 text-right text-sm",
          noWrap && "whitespace-nowrap",
        )}
      >
        {leftText}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className="relative mx-2 h-8 w-16 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-400 focus-visible:outline-none focus-visible:ring-2"
        style={{ backgroundColor: activeColor }}
      >
        <span
          className="block h-7 w-7 rounded-full bg-white transition-transform duration-400"
          style={{ transform: checked ? "translateX(2rem)" : "translateX(0)" }}
        />
      </button>
      <span
        className={cn(
          "flex-1 text-left text-sm",
          noWrap && "whitespace-nowrap",
        )}
      >
        {rightText}
      </span>
    </div>
  );
};

export default ToggleSwitch;
