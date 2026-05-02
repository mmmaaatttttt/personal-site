import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import HarassmentSimulation from '.';

// Mock the child component to simplify testing the orchestrator
vi.mock('./HarassmentNodeGroup', () => ({
  default: () => <div data-testid="mock-node-group">Interactive Node Group</div>
}));

// Mock ResizeObserver for JSDOM in ClippedSVG
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('HarassmentSimulation Component', () => {
  it('renders initial state with Start button', () => {
    render(<HarassmentSimulation idx={0} />);
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByTestId('mock-node-group')).toBeInTheDocument();
  });

  it('switches to Pause and Reset buttons when Start is clicked', () => {
    render(<HarassmentSimulation idx={0} />);
    
    fireEvent.click(screen.getByText('Start'));
    
    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('toggles Pause/Resume button text correctly', () => {
    render(<HarassmentSimulation idx={0} />);
    
    fireEvent.click(screen.getByText('Start'));
    const pauseBtn = screen.getByText('Pause');
    
    fireEvent.click(pauseBtn);
    expect(screen.getByText('Resume')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Resume'));
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('renders additional sliders when idx > 0', () => {
    render(<HarassmentSimulation idx={1} />);
    // Check for probability sliders (there are multiple involving "Blue")
    const titles = screen.getAllByText(/chance of harassment with Blue/i);
    expect(titles.length).toBeGreaterThan(0);
  });
});
