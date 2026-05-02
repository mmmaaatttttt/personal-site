import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type React from "react";
import { afterEach, vi } from "vitest";

// Automatically cleanup after each test to prevent memory leaks or side effects between tests
afterEach(() => {
  cleanup();
});

// Minimalist passthrough mock for framer-motion to ensure JSDOM stability
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentPropsWithoutRef<"div">) => (
      <div {...props}>{children}</div>
    ),
    rect: ({ children, ...props }: React.ComponentPropsWithoutRef<"rect">) => (
      <rect {...props}>{children}</rect>
    ),
    path: ({ children, ...props }: React.ComponentPropsWithoutRef<"path">) => (
      <path {...props}>{children}</path>
    ),
    text: ({ children, ...props }: React.ComponentPropsWithoutRef<"text">) => (
      <text {...props}>{children}</text>
    ),
    g: ({ children, ...props }: React.ComponentPropsWithoutRef<"g">) => (
      <g {...props}>{children}</g>
    ),
  },
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  ),
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
