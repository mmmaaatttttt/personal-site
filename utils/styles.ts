const COLORS = {
  BLUE: "#5ecfff",
  DARK_BLUE: "#2227ff",
  GREEN: "#52a081",
  DARK_GREEN: "#00802b",
  ORANGE: "#ff8f34",
  PURPLE: "#e15bff",
  RED: "#ff3c23",
  YELLOW: "#ffec28",
  MAROON: "#a05e52",
  DARK_GRAY: "#555555",
  GRAY: "#bbbbbb",
  INPUT_GRAY: "#cccccc",
  LIGHT_GRAY: "#eeeeee",
  WHITE: "#ffffff",
  BLACK: "#000000",
  LINK: "#ff5700",
  NAV: "#f9f9f9",
};

export const hexToRgba = (hex: string, opacity: number) => {
  const numbers = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map(
    (subHex) => parseInt(subHex, 16),
  );
  return `rgba(${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${opacity})`;
};

export const SIZES = {
  maxWidthContent: "768px",
};

export function paddingObj(
  padVal: number | { top: number; bottom: number; left: number; right: number },
) {
  if (typeof padVal === "number") {
    return {
      top: padVal,
      bottom: padVal,
      left: padVal,
      right: padVal,
    };
  }
  return padVal;
}

export default COLORS;
