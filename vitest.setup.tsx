import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
}));

// Passthrough mock for next/image so tests can assert on alt/src without
// Next's image optimization pipeline. Override locally (e.g. `() => null`)
// in test files that don't care about the rendered image.
vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => (
    // biome-ignore lint/performance/noImgElement: mocking next/image itself
    <img alt={alt} src={src} />
  ),
}));

global.ResizeObserver = vi.fn().mockImplementation(
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as never,
);

global.IntersectionObserver = vi.fn().mockImplementation(
  class {
    private cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe = vi.fn((el: Element) => {
      this.cb(
        [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      );
    });
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as never,
);

// Automatically cleanup after each test to prevent memory leaks or side effects between tests
afterEach(() => {
  cleanup();
});

// Strip framer-motion-specific props before forwarding to DOM elements.
// Without this, props like `initial`, `animate`, and `whileInView` are spread
// onto real DOM nodes, producing React "unrecognized prop" warnings.
const MOTION_PROP_KEYS = new Set([
  "initial",
  "animate",
  "exit",
  "whileHover",
  "whileTap",
  "whileInView",
  "whileFocus",
  "whileDrag",
  "transition",
  "variants",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
]);

// `animate` carries the settled geometry/style for components that only set
// it there (e.g. `animate={{ cx, cy }}`) rather than duplicating it as a
// static prop — merge it back in after stripping so tests can still read
// those values off the rendered element, instead of seeing them vanish.
function resolveMotionProps(props: Record<string, unknown>) {
  const { animate, ...rest } = props;
  const stripped = Object.fromEntries(
    Object.entries(rest).filter(([k]) => !MOTION_PROP_KEYS.has(k)),
  );
  const resolvedAnimate =
    animate && typeof animate === "object"
      ? (animate as Record<string, unknown>)
      : {};
  return { ...stripped, ...resolvedAnimate };
}

// Minimalist passthrough mock for framer-motion to ensure JSDOM stability
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"div"> & Record<string, unknown>) => (
      <div {...resolveMotionProps(props)}>{children}</div>
    ),
    rect: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"rect"> & Record<string, unknown>) => (
      <rect {...resolveMotionProps(props)}>{children}</rect>
    ),
    circle: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"circle"> & Record<string, unknown>) => (
      <circle {...resolveMotionProps(props)}>{children}</circle>
    ),
    path: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"path"> & Record<string, unknown>) => (
      <path {...resolveMotionProps(props)}>{children}</path>
    ),
    text: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"text"> & Record<string, unknown>) => (
      <text {...resolveMotionProps(props)}>{children}</text>
    ),
    g: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"g"> & Record<string, unknown>) => (
      <g {...resolveMotionProps(props)}>{children}</g>
    ),
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
  useSpring: (v: number) => ({
    get: () => v,
    set: vi.fn(),
    on: vi.fn(() => vi.fn()),
  }),
  useTransform: (v: unknown, transform: (val: unknown) => unknown) => ({
    get: () =>
      transform(
        v && typeof v === "object" && "get" in v
          ? (v as { get(): unknown }).get()
          : v,
      ),
    on: vi.fn(() => vi.fn()),
  }),
  useMotionValue: (v: unknown) => ({
    get: () => v,
    set: vi.fn(),
    on: vi.fn(() => vi.fn()),
  }),
}));
