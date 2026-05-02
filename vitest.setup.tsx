import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup after each test to prevent memory leaks or side effects between tests
afterEach(() => {
  cleanup();
});

// Minimalist passthrough mock for framer-motion to ensure JSDOM stability
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    rect: ({ children, ...props }: any) => <rect {...props}>{children}</rect>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
    text: ({ children, ...props }: any) => <text {...props}>{children}</text>,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useSpring: (v: number) => ({ get: () => v, set: vi.fn(), on: vi.fn(() => vi.fn()) }),
  useTransform: (v: any, transform: any) => ({ 
    get: () => transform(v && v.get ? v.get() : v), 
    on: vi.fn(() => vi.fn()) 
  }),
  useMotionValue: (v: any) => ({ get: () => v, set: vi.fn(), on: vi.fn(() => vi.fn()) }),
}));
