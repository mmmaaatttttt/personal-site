import COLORS from "@/utils/styles";

// Order maps 1:1 to counts[]: indices 0-3 = fruit, index 4 = raven, index 5 = basket wildcard
export const SPINNER_COLORS = [
  COLORS.RED,
  COLORS.DARK_GREEN,
  COLORS.DARK_BLUE,
  COLORS.YELLOW,
  COLORS.BLACK, // raven
  COLORS.WHITE, // fruit basket wildcard
];

export const INITIAL_FRUIT_COUNTS = [4, 4, 4, 4];
export const INITIAL_RAVEN_COUNT = 5;
export const INITIAL_COUNTS = [...INITIAL_FRUIT_COUNTS, INITIAL_RAVEN_COUNT];
