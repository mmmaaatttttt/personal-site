import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SelectableScatterplot from './index';

// Mock components
vi.mock('@/components/story/shared/Scatterplot', () => ({
  default: ({ data }: any) => <div data-testid="mock-scatterplot" data-scatter-data={JSON.stringify(data)} />,
}));

vi.mock('@/components/story/shared/Select', () => ({
  default: ({ onChange, options, name }: any) => (
    <select 
      data-testid={`mock-select-${name}`} 
      onChange={(e) => {
        const opt = options.find((o: any) => o.value === e.target.value);
        if (opt) onChange(opt);
      }}
    >
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
}));

vi.mock('@/components/story/shared/NarrowContainer', () => ({
  default: ({ children }: any) => <div data-testid="mock-narrow-container">{children}</div>,
}));

vi.mock('@/components/story/shared/FlexContainer', () => ({
  default: ({ children }: any) => <div data-testid="mock-flex-container">{children}</div>,
}));

describe('SelectableScatterplot Component', () => {
  const mockData = [
    { season: 1, episode: 1, name: 'W1', ranking: 1, budget: 1000, guests: 50 },
    { season: 1, episode: 2, name: 'W2', ranking: 2, budget: 2000, guests: 100 },
  ];

  const mockOptions = [
    { 
      value: 'budget', 
      label: 'Budget', 
      accessor: (d: any) => d.budget,
      format: '$,.0f'
    },
    { 
      value: 'guests', 
      label: 'Guests', 
      accessor: (d: any) => d.guests,
      format: ',.0f'
    },
    {
      value: 'ranking',
      label: 'Ranking',
      accessor: (d: any) => d.ranking,
      format: '.0f'
    }
  ];

  const graphOptions = {
    colorScale: (ranking: number | null) => 'red',
  };

  it('maps X and Y axis data correctly based on initial selection', () => {
    const { getByTestId } = render(
      <SelectableScatterplot 
        data={mockData} 
        selectOptions={mockOptions} 
        graphOptions={graphOptions}
      />
    );
    
    const plot = getByTestId('mock-scatterplot');
    const scatterData = JSON.parse(plot.getAttribute('data-scatter-data') || '[]');
    
    // Default: first option for X (budget), second for Y (guests)
    expect(scatterData).toHaveLength(2);
    expect(scatterData[0].cx).toBe(1000); // budget
    expect(scatterData[0].cy).toBe(50);   // guests
  });

  it('updates the data coordinates when X axis selection changes', () => {
    const { getByTestId } = render(
      <SelectableScatterplot 
        data={mockData} 
        selectOptions={mockOptions} 
        graphOptions={graphOptions}
      />
    );
    
    const selectX = getByTestId('mock-select-scatter-data-x');
    // Change X from Budget ('budget') to Ranking ('ranking')
    fireEvent.change(selectX, { target: { value: 'ranking' } });

    const plot = getByTestId('mock-scatterplot');
    const scatterData = JSON.parse(plot.getAttribute('data-scatter-data') || '[]');
    
    expect(scatterData[0].cx).toBe(1); // ranking
    expect(scatterData[0].cy).toBe(50); // guests (still second option)
  });

  it('updates the data coordinates when Y axis selection changes', () => {
    const { getByTestId } = render(
      <SelectableScatterplot 
        data={mockData} 
        selectOptions={mockOptions} 
        graphOptions={graphOptions}
      />
    );
    
    const selectY = getByTestId('mock-select-scatter-data-y');
    // Change Y from Guests ('guests') to Budget ('budget')
    fireEvent.change(selectY, { target: { value: 'budget' } });

    const plot = getByTestId('mock-scatterplot');
    const scatterData = JSON.parse(plot.getAttribute('data-scatter-data') || '[]');
    
    expect(scatterData[0].cx).toBe(1000); // budget (still first option)
    expect(scatterData[0].cy).toBe(1000); // budget
  });
});
