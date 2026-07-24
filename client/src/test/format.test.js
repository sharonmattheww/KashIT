import { describe, it, expect } from 'vitest';

import {
  formatCurrency,
  formatSignedCurrency,
  formatDate,
  formatMonth,
  recentMonths,
} from '../utils/format.js';

describe('currency formatting', () => {
  it('formats a plain amount with two decimals and a thousands separator', () => {
    expect(formatCurrency(1350)).toBe('$1,350.00');
    expect(formatCurrency(4.8)).toBe('$4.80');
  });

  it('adds a sign for the net balance', () => {
    expect(formatSignedCurrency(2560.73)).toBe('+$2,560.73');
    expect(formatSignedCurrency(-100)).toBe('−$100.00'); // U+2212 minus
    expect(formatSignedCurrency(0)).toBe('$0.00');
  });
});

describe('date and month formatting', () => {
  it('renders an ISO date without timezone drift', () => {
    expect(formatDate('2026-07-14')).toBe('Jul 14, 2026');
  });

  it('renders a month key as a long label', () => {
    expect(formatMonth('2026-07')).toBe('July 2026');
  });
});

describe('recentMonths', () => {
  it('lists the last N months newest first, including the anchor month', () => {
    const months = recentMonths(3, new Date(2026, 6, 15)); // July 2026
    expect(months).toEqual(['2026-07', '2026-06', '2026-05']);
  });

  it('rolls back across a year boundary', () => {
    const months = recentMonths(3, new Date(2026, 1, 10)); // February 2026
    expect(months).toEqual(['2026-02', '2026-01', '2025-12']);
  });
});
