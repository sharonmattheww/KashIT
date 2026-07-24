import { formatCurrency, formatSignedCurrency } from '../utils/format.js';

// Presentational: renders the numbers it is handed.
// Each card shows a label, big value, subtitle and a progress bar
// whose width represents the metric relative to income.
export default function SummaryCards({ summary, loading }) {
  const income  = summary?.totalIncome  ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const net     = summary?.net          ?? 0;
  const topCategory = summary?.topCategory;
  const topAmount   = summary?.byCategory?.[0]?.total ?? 0;

  // Progress bar widths relative to income (capped at 100%)
  const expensePct = income > 0 ? Math.min((expense / income) * 100, 100) : 0;
  const netPct     = income > 0 ? Math.min((Math.abs(net) / income) * 100, 100) : 0;
  const savingsRate = income > 0 ? Math.max(0, Math.round(((income - expense) / income) * 100)) : 0;

  const cards = [
    {
      key: 'income',
      label: 'Total Income',
      value: formatCurrency(income),
      meta: 'received this month',
      tone: 'income',
      barPct: 100,
    },
    {
      key: 'expense',
      label: 'Total Expenses',
      value: formatCurrency(expense),
      meta: 'spent this month',
      tone: 'expense',
      barPct: expensePct,
    },
    {
      key: 'net',
      label: 'Net Balance',
      value: formatSignedCurrency(net),
      meta: net >= 0 ? 'saved this month' : 'overspent this month',
      tone: net >= 0 ? 'positive' : 'negative',
      barPct: netPct,
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      meta: topCategory ? `Top: ${topCategory} · ${formatCurrency(topAmount)}` : 'no expenses yet',
      tone: 'neutral',
      barPct: savingsRate,
      isText: true,
    },
  ];

  return (
    <section className="summary-grid" aria-label="Monthly summary">
      {cards.map((card) => (
        <article
          key={card.key}
          className={`stat stat--${card.tone} ${loading ? 'is-loading' : ''}`}
        >
          <p className="stat__label">{card.label}</p>
          <p className={`stat__value ${card.isText ? '' : 'mono'}`}>{card.value}</p>
          <p className="stat__meta">{card.meta}</p>
          <div className="stat__bar">
            <span
              className="stat__bar-fill"
              style={{ width: `${card.barPct}%` }}
              aria-hidden="true"
            />
          </div>
        </article>
      ))}
    </section>
  );
}
