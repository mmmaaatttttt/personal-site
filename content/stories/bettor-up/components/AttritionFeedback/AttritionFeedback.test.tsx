import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { writeMemoryItem } from "@/hooks/useMemoryStore";
import COLORS from "@/utils/styles";
import {
  DEFAULT_NON_RESPONDER_COMPLETION,
  DEFAULT_RESPONDER_COMPLETION,
  DEFAULT_TRUE_RATE,
  NON_RESPONDER_COMPLETION_KEY,
  RESPONDER_COMPLETION_KEY,
  TRUE_RATE_KEY,
} from "../../sliderStore";
import AttritionBias from "../AttritionBias";
import AttritionFeedback from ".";

vi.mock("katex", () => ({
  default: { render: vi.fn() },
}));
vi.mock("katex/dist/katex.min.css", () => ({}));

beforeEach(() => {
  writeMemoryItem(TRUE_RATE_KEY, DEFAULT_TRUE_RATE);
  writeMemoryItem(RESPONDER_COMPLETION_KEY, DEFAULT_RESPONDER_COMPLETION);
  writeMemoryItem(
    NON_RESPONDER_COMPLETION_KEY,
    DEFAULT_NON_RESPONDER_COMPLETION,
  );
});

describe("AttritionFeedback", () => {
  it("renders seven sliders and the chart", () => {
    const { container } = render(<AttritionFeedback />);
    expect(screen.getAllByRole("slider")).toHaveLength(7);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("marks the true response rate with a circle on the diagonal", () => {
    const { container } = render(<AttritionFeedback />);
    expect(
      container.querySelector(`circle[fill="${COLORS.DARK_GRAY}"]`),
    ).toBeInTheDocument();
  });

  it("redraws the cobweb path when the true-response-rate slider changes", () => {
    const { container } = render(<AttritionFeedback />);
    const sliders = screen.getAllByRole("slider");
    const trueResponseRateSlider = sliders[1];
    const pathBefore = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");

    fireEvent.change(trueResponseRateSlider, { target: { value: "0.8" } });

    const pathAfter = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");
    expect(pathAfter).not.toEqual(pathBefore);
  });

  it("accepts changes to the responder market-sensitivity slider without crashing", () => {
    render(<AttritionFeedback />);
    const sliders = screen.getAllByRole("slider");
    const responderSensitivitySlider = sliders[3];
    fireEvent.change(responderSensitivitySlider, { target: { value: "1" } });
    expect(responderSensitivitySlider).toHaveValue("1");
  });

  it("accepts changes to the non-responder market-sensitivity slider without crashing", () => {
    render(<AttritionFeedback />);
    const sliders = screen.getAllByRole("slider");
    const nonResponderSensitivitySlider = sliders[5];
    fireEvent.change(nonResponderSensitivitySlider, { target: { value: "1" } });
    expect(nonResponderSensitivitySlider).toHaveValue("1");
  });

  it("redraws the cobweb path when the adjustment-speed slider changes", () => {
    const { container } = render(<AttritionFeedback />);
    const sliders = screen.getAllByRole("slider");
    const responderSensitivitySlider = sliders[3];
    const adjustmentSpeedSlider = sliders[6];
    fireEvent.change(responderSensitivitySlider, { target: { value: "1" } });
    const pathBefore = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");

    fireEvent.change(adjustmentSpeedSlider, { target: { value: "0.2" } });

    const pathAfter = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");
    expect(pathAfter).not.toEqual(pathBefore);
  });

  it("redraws the cobweb path when the initial-contract-price slider changes", () => {
    const { container } = render(<AttritionFeedback />);
    const sliders = screen.getAllByRole("slider");
    const initialContractPriceSlider = sliders[0];
    const pathBefore = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");

    fireEvent.change(initialContractPriceSlider, { target: { value: "0.2" } });

    const pathAfter = container
      .querySelector(`path[stroke="${COLORS.DARK_GRAY}"]`)
      ?.getAttribute("d");
    expect(pathAfter).not.toEqual(pathBefore);
  });

  it("syncs the true-rate, responder-completion, and non-responder-completion sliders with AttritionBias", () => {
    render(
      <div>
        <AttritionBias />
        <AttritionFeedback />
      </div>,
    );
    // AttritionBias renders 3 sliders first; AttritionFeedback's own first
    // slider (initial contract price) isn't storage-backed, so the synced
    // sliders start one further in than AttritionFeedback's own indices.
    const [
      biasTrueRate,
      biasResponderCompletion,
      biasNonResponderCompletion,
      ,
      feedbackTrueRate,
      feedbackResponderCompletion,
      ,
      feedbackNonResponderCompletion,
    ] = screen.getAllByRole("slider");

    fireEvent.change(biasTrueRate, { target: { value: "0.8" } });
    expect(feedbackTrueRate).toHaveValue("0.8");

    fireEvent.change(biasResponderCompletion, { target: { value: "0.3" } });
    expect(feedbackResponderCompletion).toHaveValue("0.3");

    fireEvent.change(biasNonResponderCompletion, { target: { value: "0.6" } });
    expect(feedbackNonResponderCompletion).toHaveValue("0.6");
  });
});
