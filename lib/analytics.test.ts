import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    window.umami = undefined;
  });

  it("calls window.umami.track with the event name and data", () => {
    const track = vi.fn();
    window.umami = { track };
    trackEvent("test-event", { foo: "bar" });
    expect(track).toHaveBeenCalledWith("test-event", { foo: "bar" });
  });

  it("calls window.umami.track with no data when omitted", () => {
    const track = vi.fn();
    window.umami = { track };
    trackEvent("test-event");
    expect(track).toHaveBeenCalledWith("test-event", undefined);
  });

  it("does nothing when window.umami is not present", () => {
    expect(() => trackEvent("test-event")).not.toThrow();
  });
});
