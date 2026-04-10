import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup after each test to prevent memory leaks or side effects between tests
afterEach(() => {
  cleanup();
});
