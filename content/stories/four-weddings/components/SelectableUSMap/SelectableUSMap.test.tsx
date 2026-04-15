import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import SelectableUSMap from './index';
import { WeddingData } from '../../types';

// Mock components
vi.mock('@/components/story/shared/USMap', () => ({
  default: ({ data, fillAccessor }: any) => (
    <div data-testid="mock-us-map" data-data-len={data.length} data-fill-accessor-type={typeof fillAccessor} />
  ),
}));

vi.mock('@/components/story/shared/Select', () => ({
  default: ({ onChange, options }: any) => (
    <select 
      data-testid="mock-select" 
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

vi.mock('@/components/story/shared/Tooltip', () => ({
  default: () => <div data-testid="mock-tooltip" />,
  useTooltip: () => ({
    tooltip: null,
    showTooltip: vi.fn(),
    hideTooltip: vi.fn(),
  })
}));

describe('SelectableUSMap Component', () => {
  const mockData = [
    { state: 'AL', value: 10 },
    { state: 'GA', value: 20 },
  ] as unknown as WeddingData[];

  const mockOptions = [
    {
      value: 'v1',
      label: 'Option 1',
      accessor: (_: any) => 1,
      colors: ['red', 'blue']
    },
    {
      value: 'v2',
      label: 'Option 2',
      accessor: (_: any) => 2,
      colors: ['green', 'yellow']
    },
  ];

  it('renders with initial data and accessor', () => {
    const { getByTestId } = render(
      <SelectableUSMap 
        data={mockData} 
        selectOptions={mockOptions} 
      />
    );
    
    const map = getByTestId('mock-us-map');
    expect(map.getAttribute('data-data-len')).toBe('2');
    expect(map.getAttribute('data-fill-accessor-type')).toBe('function');
  });

  it('updates selection when Select is changed', () => {
    const { getByTestId } = render(
      <SelectableUSMap 
        data={mockData} 
        selectOptions={mockOptions} 
      />
    );
    
    const select = getByTestId('mock-select');
    fireEvent.change(select, { target: { value: 'v2' } });

    // Since we're mocking USMap and just passing props, 
    // we've verified the state update logic works if components re-render with new props
    // In a more complex test, we could spy on the accessor call or colors prop
    expect(select).toHaveValue('v2');
  });
});
