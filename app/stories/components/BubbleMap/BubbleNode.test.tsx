import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BubbleNode from "./BubbleNode";

beforeEach(() => {
  SVGSVGElement.prototype.getScreenCTM = vi
    .fn()
    .mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderNode = (
  overrides: Partial<Parameters<typeof BubbleNode>[0]> = {},
) => {
  const props = {
    slug: "coin-operator",
    title: "Coin Operator",
    imageHref: "/images/coin.webp",
    descriptionId: "description",
    x: 50,
    y: 60,
    r: 20,
    active: false,
    dimmed: false,
    onActivate: vi.fn(),
    onDeactivate: vi.fn(),
    onGrab: vi.fn(),
    onGrabMove: vi.fn(),
    onRelease: vi.fn(),
    ...overrides,
  };
  const { container } = render(
    <svg role="img" aria-label="test">
      <BubbleNode {...props} />
    </svg>,
  );
  return {
    props,
    container,
    link: screen.getByRole("link", { name: "Coin Operator" }),
  };
};

describe("BubbleNode", () => {
  it("links to the story with its image and description", () => {
    const { link, container } = renderNode();
    expect(link).toHaveAttribute("href", "/stories/coin-operator");
    expect(link).toHaveAttribute("aria-describedby", "description");
    const image = container.querySelector("image");
    expect(image).toHaveAttribute("href", "/images/coin.webp");
    expect(image).toHaveAttribute("width", "40");
    expect(container.querySelector("g")).toHaveAttribute(
      "transform",
      "translate(50,60)",
    );
  });

  it("dims its image when another story is active", () => {
    const { container } = renderNode({ dimmed: true });
    expect(container.querySelector("image")).toHaveClass("opacity-35");
  });

  it("activates on focus and deactivates on blur", () => {
    const { props, link } = renderNode();
    fireEvent.focus(link);
    expect(props.onActivate).toHaveBeenCalledWith("coin-operator");
    fireEvent.blur(link);
    expect(props.onDeactivate).toHaveBeenCalled();
  });

  it("activates on mouse hover only", () => {
    const { props, link } = renderNode();
    fireEvent.pointerOver(link, { pointerType: "touch" });
    expect(props.onActivate).not.toHaveBeenCalled();
    fireEvent.pointerOver(link, { pointerType: "mouse" });
    expect(props.onActivate).toHaveBeenCalledWith("coin-operator");
  });

  it("deactivates when the mouse leaves, but not mid-gesture or for touch", () => {
    const { props, link } = renderNode();
    fireEvent.pointerOut(link, { pointerType: "touch" });
    expect(props.onDeactivate).not.toHaveBeenCalled();
    fireEvent.pointerDown(link, { pointerType: "mouse", pointerId: 1 });
    fireEvent.pointerOut(link, { pointerType: "mouse" });
    expect(props.onDeactivate).not.toHaveBeenCalled();
    fireEvent.click(link);
    fireEvent.pointerOut(link, { pointerType: "mouse" });
    expect(props.onDeactivate).toHaveBeenCalled();
  });

  it("drags past a small threshold and suppresses the click", () => {
    const { props, link } = renderNode();
    fireEvent.pointerDown(link, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    expect(props.onGrab).toHaveBeenCalledWith("coin-operator");
    expect(link.setPointerCapture).toHaveBeenCalledWith(1);
    fireEvent.pointerMove(link, { pointerId: 1, clientX: 12, clientY: 11 });
    expect(props.onGrabMove).not.toHaveBeenCalled();
    fireEvent.pointerMove(link, { pointerId: 1, clientX: 40, clientY: 30 });
    expect(props.onGrabMove).toHaveBeenCalledWith("coin-operator", {
      x: 40,
      y: 30,
    });
    fireEvent.pointerUp(link, { pointerId: 1 });
    expect(link.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(props.onRelease).toHaveBeenCalledWith("coin-operator");
    expect(fireEvent.click(link)).toBe(false);
    expect(fireEvent.click(link)).toBe(true);
  });

  it("ignores pointer moves and releases from other pointers", () => {
    const { props, link } = renderNode();
    fireEvent.pointerMove(link, { pointerId: 1, clientX: 40, clientY: 30 });
    fireEvent.pointerUp(link, { pointerId: 1 });
    fireEvent.pointerDown(link, { pointerType: "mouse", pointerId: 1 });
    fireEvent.pointerMove(link, { pointerId: 2, clientX: 40, clientY: 30 });
    fireEvent.pointerUp(link, { pointerId: 2 });
    expect(props.onGrabMove).not.toHaveBeenCalled();
    expect(props.onRelease).not.toHaveBeenCalled();
  });

  it("skips moves when the SVG has no screen transform", () => {
    SVGSVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue(null);
    const { props, link } = renderNode();
    fireEvent.pointerDown(link, { pointerType: "mouse", pointerId: 1 });
    fireEvent.pointerMove(link, { pointerId: 1, clientX: 40, clientY: 30 });
    expect(props.onGrabMove).not.toHaveBeenCalled();
  });

  it("previews on the first tap and navigates on the second", () => {
    const { props, link } = renderNode();
    fireEvent.pointerDown(link, { pointerType: "touch", pointerId: 1 });
    fireEvent.pointerUp(link, { pointerId: 1 });
    expect(fireEvent.click(link)).toBe(false);
    expect(props.onActivate).toHaveBeenCalledWith("coin-operator");
  });

  it("navigates when tapping an already active story", () => {
    const { link } = renderNode({ active: true });
    fireEvent.pointerDown(link, { pointerType: "touch", pointerId: 1 });
    fireEvent.pointerUp(link, { pointerId: 1 });
    expect(fireEvent.click(link)).toBe(true);
  });

  it("navigates on a plain click", () => {
    const { link } = renderNode();
    expect(fireEvent.click(link)).toBe(true);
  });

  it("blocks the browser's native link dragging", () => {
    const { link } = renderNode();
    const dragStart = createEvent.dragStart(link);
    fireEvent(link, dragStart);
    expect(dragStart.defaultPrevented).toBe(true);
  });
});
