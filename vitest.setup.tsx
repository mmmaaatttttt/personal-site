import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { afterEach, vi } from "vitest";

global.ResizeObserver = vi.fn().mockImplementation(
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as never,
);

// Automatically cleanup after each test to prevent memory leaks or side effects between tests
afterEach(() => {
  cleanup();
});

// Minimalist passthrough mock for framer-motion to ensure JSDOM stability
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: ComponentPropsWithoutRef<"div">) => (
      <div {...props}>{children}</div>
    ),
    rect: ({ children, ...props }: ComponentPropsWithoutRef<"rect">) => (
      <rect {...props}>{children}</rect>
    ),
    path: ({ children, ...props }: ComponentPropsWithoutRef<"path">) => (
      <path {...props}>{children}</path>
    ),
    text: ({ children, ...props }: ComponentPropsWithoutRef<"text">) => (
      <text {...props}>{children}</text>
    ),
    g: ({ children, ...props }: ComponentPropsWithoutRef<"g">) => (
      <g {...props}>{children}</g>
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
