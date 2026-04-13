import { describe, it, expect, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Tooltip, { useTooltip } from '.';

// Mock framer-motion to render static elements for tests
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: (props: any) => <div {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Tooltip Hook and Component', () => {
  it('useTooltip correctly manages tooltip state', () => {
    const { result } = renderHook(() => useTooltip());
    
    expect(result.current.tooltip).toBeNull();
    
    act(() => {
      // @ts-ignore - Mocking event
      result.current.showTooltip('Title', 'Body')({ clientX: 100, clientY: 200 });
    });
    
    expect(result.current.tooltip).toEqual({
      title: 'Title',
      body: 'Body',
      x: 100,
      y: 200,
    });
    
    act(() => {
      result.current.hideTooltip();
    });
    
    expect(result.current.tooltip).toBeNull();
  });

  it('renders correctly when info is provided', () => {
    const info = {
      title: 'Test Tooltip',
      body: 'Tooltip body content',
      x: 50,
      y: 50,
    };
    
    render(<Tooltip info={info} />);
    
    expect(screen.getByText('Test Tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip body content')).toBeInTheDocument();
  });

  it('handles array bodies correctly', () => {
    const info = {
      title: 'Array Tooltip',
      body: ['Line 1', 'Line 2'],
      x: 50,
      y: 50,
    };
    
    render(<Tooltip info={info} />);
    
    expect(screen.getByText('Line 1')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });
});
