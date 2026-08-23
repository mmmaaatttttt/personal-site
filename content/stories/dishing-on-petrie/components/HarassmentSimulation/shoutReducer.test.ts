import { describe, expect, it } from "vitest";
import {
  initialShoutState,
  type ShoutAction,
  shoutReducer,
} from "./shoutReducer";

describe("shoutReducer", () => {
  it("returns the initial state on reset", () => {
    const dirtyState = shoutReducer(initialShoutState, {
      type: "shout",
      key: "blueShoutsHeardFromGreen",
      shoutId: 1,
    });
    expect(shoutReducer(dirtyState, { type: "reset" })).toBe(initialShoutState);
  });

  it("adds a shoutId to blueShoutsHeardFromGreen", () => {
    const next = shoutReducer(initialShoutState, {
      type: "shout",
      key: "blueShoutsHeardFromGreen",
      shoutId: 5,
    });
    expect(next.blueShoutsHeardFromGreen.has(5)).toBe(true);
    expect(next.blueShoutsHeardFromGreen).not.toBe(
      initialShoutState.blueShoutsHeardFromGreen,
    );
  });

  it("adds a shoutId to greenShoutsHeardFromBlue", () => {
    const next = shoutReducer(initialShoutState, {
      type: "shout",
      key: "greenShoutsHeardFromBlue",
      shoutId: 7,
    });
    expect(next.greenShoutsHeardFromBlue.has(7)).toBe(true);
  });

  it("adds a shoutId to blueShoutsHeardFromBlueOnly when not heard by green", () => {
    const next = shoutReducer(initialShoutState, {
      type: "shout",
      key: "blueShoutsHeardFromBlueOnly",
      shoutId: 3,
    });
    expect(next.blueShoutsHeardFromBlueOnly.has(3)).toBe(true);
  });

  it("skips blueShoutsHeardFromBlueOnly when green already heard it", () => {
    const heardByGreen = shoutReducer(initialShoutState, {
      type: "shout",
      key: "greenShoutsHeardFromBlue",
      shoutId: 3,
    });
    const next = shoutReducer(heardByGreen, {
      type: "shout",
      key: "blueShoutsHeardFromBlueOnly",
      shoutId: 3,
    });
    expect(next).toBe(heardByGreen);
    expect(next.blueShoutsHeardFromBlueOnly.has(3)).toBe(false);
  });

  it("adds a shoutId to greenShoutsHeardFromGreenOnly when not heard by blue", () => {
    const next = shoutReducer(initialShoutState, {
      type: "shout",
      key: "greenShoutsHeardFromGreenOnly",
      shoutId: 9,
    });
    expect(next.greenShoutsHeardFromGreenOnly.has(9)).toBe(true);
  });

  it("skips greenShoutsHeardFromGreenOnly when blue already heard it", () => {
    const heardByBlue = shoutReducer(initialShoutState, {
      type: "shout",
      key: "blueShoutsHeardFromGreen",
      shoutId: 9,
    });
    const next = shoutReducer(heardByBlue, {
      type: "shout",
      key: "greenShoutsHeardFromGreenOnly",
      shoutId: 9,
    });
    expect(next).toBe(heardByBlue);
    expect(next.greenShoutsHeardFromGreenOnly.has(9)).toBe(false);
  });

  it("returns the same state for an unrecognized key", () => {
    const unknownAction = {
      type: "shout",
      key: "somethingElse",
      shoutId: 1,
    } as unknown as ShoutAction;
    expect(shoutReducer(initialShoutState, unknownAction)).toBe(
      initialShoutState,
    );
  });
});
