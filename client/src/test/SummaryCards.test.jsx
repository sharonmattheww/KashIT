import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import SummaryCards from '../components/SummaryCards.jsx';

const summary = {
  totalIncome: 4850,
  totalExpense: 2289.27,
  net: 2560.73,
  topCategory: 'Housing',
  byCategory: [{ category: 'Housing', color: '#7A6CA8', total: 1350 }],
};

describe('SummaryCards', () => {
  it('displays the figures it is handed', () => {
    render(<SummaryCards summary={summary} loading={false} />);

    expect(screen.getByText('$4,850.00')).toBeInTheDocument();
    expect(screen.getByText('$2,289.27')).toBeInTheDocument();
    expect(screen.getByText('+$2,560.73')).toBeInTheDocument();
    expect(screen.getByText('Housing')).toBeInTheDocument();
    expect(screen.getByText('saved this month')).toBeInTheDocument();
  });

  it('falls back to zeros and a dash before data arrives', () => {
    render(<SummaryCards summary={null} loading />);

    // Income, expenses and net all read $0.00 with no data yet.
    expect(screen.getAllByText('$0.00')).toHaveLength(3);
    expect(screen.getByText('—')).toBeInTheDocument(); // top category
  });
});
