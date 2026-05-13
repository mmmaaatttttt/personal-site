export type ShoutState = {
  blueShoutsHeardFromBlueOnly: Set<number>;
  blueShoutsHeardFromGreen: Set<number>;
  greenShoutsHeardFromBlue: Set<number>;
  greenShoutsHeardFromGreenOnly: Set<number>;
};

export type ShoutAction =
  | { type: "shout"; key: string; shoutId: number }
  | { type: "reset" };

export const initialShoutState: ShoutState = {
  blueShoutsHeardFromBlueOnly: new Set(),
  blueShoutsHeardFromGreen: new Set(),
  greenShoutsHeardFromBlue: new Set(),
  greenShoutsHeardFromGreenOnly: new Set(),
};

export function shoutReducer(
  state: ShoutState,
  action: ShoutAction,
): ShoutState {
  if (action.type === "reset") return initialShoutState;
  const { key, shoutId } = action;
  switch (key) {
    case "blueShoutsHeardFromGreen":
      return {
        ...state,
        blueShoutsHeardFromGreen: new Set(state.blueShoutsHeardFromGreen).add(
          shoutId,
        ),
      };
    case "greenShoutsHeardFromBlue":
      return {
        ...state,
        greenShoutsHeardFromBlue: new Set(state.greenShoutsHeardFromBlue).add(
          shoutId,
        ),
      };
    case "blueShoutsHeardFromBlueOnly":
      if (state.greenShoutsHeardFromBlue.has(shoutId)) return state;
      return {
        ...state,
        blueShoutsHeardFromBlueOnly: new Set(
          state.blueShoutsHeardFromBlueOnly,
        ).add(shoutId),
      };
    case "greenShoutsHeardFromGreenOnly":
      if (state.blueShoutsHeardFromGreen.has(shoutId)) return state;
      return {
        ...state,
        greenShoutsHeardFromGreenOnly: new Set(
          state.greenShoutsHeardFromGreenOnly,
        ).add(shoutId),
      };
    default:
      return state;
  }
}
