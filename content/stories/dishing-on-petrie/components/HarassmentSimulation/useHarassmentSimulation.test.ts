import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHarassmentSimulation } from "./useHarassmentSimulation";

describe("useHarassmentSimulation", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    expect(result.current.playing).toBe(false);
    expect(result.current.paused).toBe(false);
    expect(result.current.blueCount).toBe(10);
    expect(result.current.greenCount).toBe(20);
    expect(result.current.blueOnBlueProb).toBe(0.05);
    expect(result.current.greenOnGreenProb).toBe(0.05);
    expect(result.current.blueOnGreenProb).toBe(0.05);
    expect(result.current.greenOnBlueProb).toBe(0.05);
  });

  it("shows a single Start button when not playing", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    expect(result.current.buttonData).toHaveLength(1);
    expect(result.current.buttonData[0].buttonText).toBe("Start");
  });

  it("starts the simulation and shows Pause/Reset buttons", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    act(() => {
      result.current.buttonData[0].handleClick();
    });
    expect(result.current.playing).toBe(true);
    expect(result.current.buttonData).toHaveLength(2);
    expect(result.current.buttonData[0].buttonText).toBe("Pause");
    expect(result.current.buttonData[1].buttonText).toBe("Reset");
  });

  it("toggles the pause button label between Pause and Resume", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    act(() => {
      result.current.buttonData[0].handleClick();
    });
    act(() => {
      result.current.buttonData[0].handleClick();
    });
    expect(result.current.paused).toBe(true);
    expect(result.current.buttonData[0].buttonText).toBe("Resume");
  });

  it("resets playing, paused, counts, and probabilities on Reset", () => {
    const { result } = renderHook(() => useHarassmentSimulation(1));
    act(() => {
      result.current.buttonData[0].handleClick();
    });
    act(() => {
      result.current.greenSliders[0].handleValueChange(5);
      result.current.blueSliders[0].handleValueChange(3);
      result.current.greenSliders[1].handleValueChange(0.2);
      result.current.blueSliders[1].handleValueChange(0.2);
    });
    act(() => {
      result.current.buttonData[1].handleClick();
    });
    expect(result.current.playing).toBe(false);
    expect(result.current.paused).toBe(false);
    expect(result.current.blueCount).toBe(10);
    expect(result.current.greenCount).toBe(20);
    expect(result.current.blueOnBlueProb).toBe(0.05);
    expect(result.current.greenOnGreenProb).toBe(0.05);
    expect(result.current.blueOnGreenProb).toBe(0.05);
    expect(result.current.greenOnBlueProb).toBe(0.05);
  });

  it("dispatches a shout via handleShout", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    act(() => {
      result.current.handleShout("blueShoutsHeardFromGreen", 1);
    });
    const heard = result.current.barInfo[1].data.find(
      (d) => d.key === "blueHeardGreen",
    );
    expect(heard?.size).toBe(1);
  });

  it("resets shout state when Start is pressed again", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    act(() => {
      result.current.handleShout("blueShoutsHeardFromGreen", 1);
    });
    act(() => {
      result.current.buttonData[0].handleClick();
    });
    const heard = result.current.barInfo[1].data.find(
      (d) => d.key === "blueHeardGreen",
    );
    expect(heard?.size).toBe(0);
  });

  it("omits probability sliders when idx is 0", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    expect(result.current.greenSliders).toHaveLength(1);
    expect(result.current.blueSliders).toHaveLength(1);
  });

  it("includes probability sliders when idx is greater than 0", () => {
    const { result } = renderHook(() => useHarassmentSimulation(1));
    expect(result.current.greenSliders).toHaveLength(3);
    expect(result.current.blueSliders).toHaveLength(3);
    const greenOnGreen = result.current.greenSliders.find(
      (s) => s.key === "greenOnGreenProb",
    );
    expect(greenOnGreen?.title).toBe("5% chance of harassment with Green");
  });

  it("updates counts and probabilities via slider handlers", () => {
    const { result } = renderHook(() => useHarassmentSimulation(1));
    act(() => {
      result.current.greenSliders[0].handleValueChange(7);
      result.current.blueSliders[0].handleValueChange(4);
      result.current.greenSliders[1].handleValueChange(0.1);
      result.current.greenSliders[2].handleValueChange(0.12);
      result.current.blueSliders[1].handleValueChange(0.15);
      result.current.blueSliders[2].handleValueChange(0.2);
    });
    expect(result.current.greenCount).toBe(7);
    expect(result.current.blueCount).toBe(4);
    expect(result.current.greenOnGreenProb).toBe(0.1);
    expect(result.current.greenOnBlueProb).toBe(0.12);
    expect(result.current.blueOnBlueProb).toBe(0.15);
    expect(result.current.blueOnGreenProb).toBe(0.2);
  });

  it("labels the second bar group as heard-by-opposite-group when idx is not 2", () => {
    const { result } = renderHook(() => useHarassmentSimulation(1));
    expect(result.current.barInfo[1].title).toBe(
      "Comments Overheard by Opposite Group",
    );
    expect(result.current.barInfo[1].data).toHaveLength(2);
  });

  it("adds same-color heard bars and relabels the group when idx is 2", () => {
    const { result } = renderHook(() => useHarassmentSimulation(2));
    expect(result.current.barInfo[1].title).toBe("All Comments Heard");
    expect(result.current.barInfo[1].data.map((d) => d.key)).toEqual([
      "blueHeardBlue",
      "blueHeardGreen",
      "greenHeardBlue",
      "greenHeardGreen",
    ]);
  });

  it("reflects same-color-only shout counts when idx is 2", () => {
    const { result } = renderHook(() => useHarassmentSimulation(2));
    act(() => {
      result.current.handleShout("blueShoutsHeardFromBlueOnly", 1);
      result.current.handleShout("greenShoutsHeardFromGreenOnly", 2);
    });
    const blueHeardBlue = result.current.barInfo[1].data.find(
      (d) => d.key === "blueHeardBlue",
    );
    const greenHeardGreen = result.current.barInfo[1].data.find(
      (d) => d.key === "greenHeardGreen",
    );
    expect(blueHeardBlue?.size).toBe(1);
    expect(greenHeardGreen?.size).toBe(1);
  });

  it("reflects group sizes in the first bar group", () => {
    const { result } = renderHook(() => useHarassmentSimulation(0));
    const blueSize = result.current.barInfo[0].data.find(
      (d) => d.key === "blueSize",
    );
    const greenSize = result.current.barInfo[0].data.find(
      (d) => d.key === "greenSize",
    );
    expect(blueSize?.size).toBe(10);
    expect(greenSize?.size).toBe(20);
  });
});
