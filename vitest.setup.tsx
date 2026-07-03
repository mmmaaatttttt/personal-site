import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
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

function stripMotionProps(props: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(props).filter(([k]) => !MOTION_PROP_KEYS.has(k)),
  );
}

// Minimalist passthrough mock for framer-motion to ensure JSDOM stability
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"div"> & Record<string, unknown>) => (
      <div {...stripMotionProps(props)}>{children}</div>
    ),
    rect: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"rect"> & Record<string, unknown>) => (
      <rect {...stripMotionProps(props)}>{children}</rect>
    ),
    path: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"path"> & Record<string, unknown>) => (
      <path {...stripMotionProps(props)}>{children}</path>
    ),
    text: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"text"> & Record<string, unknown>) => (
      <text {...stripMotionProps(props)}>{children}</text>
    ),
    g: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<"g"> & Record<string, unknown>) => (
      <g {...stripMotionProps(props)}>{children}</g>
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
