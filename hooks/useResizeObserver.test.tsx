import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useResizeObserver } from "./useResizeObserver";

type ResizeCallback = (entries: ResizeObserverEntry[]) => void;

let capturedCallback: ResizeCallback | null = null;
let mockDisconnect: ReturnType<typeof vi.fn>;

// A component that attaches the ref to a real DOM node so useEffect can observe it.
function TestBox() {
  const [ref, dimensions] = useResizeObserver();
  return (
    <div
      ref={ref}
      data-testid="box"
      data-width={dimensions.width}
      data-height={dimensions.height}
    />
  );
}

beforeEach(() => {
  mockDisconnect = vi.fn();
  capturedCallback = null;

  global.ResizeObserver = vi.fn().mockImplementation((cb: ResizeCallback) => {
    capturedCallback = cb;
    return { observe: vi.fn(), unobserve: vi.fn(), disconnect: mockDisconnect };
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useResizeObserver", () => {
  it("starts with zero dimensions", () => {
    const { getByTestId } = render(<TestBox />);
    expect(getByTestId("box").dataset.width).toBe("0");
    expect(getByTestId("box").dataset.height).toBe("0");
  });

  it("updates dimensions when the observer fires with entries", () => {
    const { getByTestId } = render(<TestBox />);

    act(() => {
      capturedCallback?.([
        {
          contentRect: {
            width: 400,
            height: 300,
            top: 5,
            right: 5,
            bottom: 5,
            left: 5,
          } as DOMRectReadOnly,
        } as ResizeObserverEntry,
      ]);
    });

    expect(getByTestId("box").dataset.width).toBe("400");
    expect(getByTestId("box").dataset.height).toBe("300");
  });

  it("does not update dimensions when entries array is empty", () => {
    const { getByTestId } = render(<TestBox />);

    act(() => {
      capturedCallback?.([]);
    });

    expect(getByTestId("box").dataset.width).toBe("0");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = render(<TestBox />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledOnce();
  });
});
