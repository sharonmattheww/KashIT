import { formatCurrency, formatSignedCurrency } from '../utils/format.js';

export default function SummaryCards({ summary, loading }) {
  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const net = summary?.net ?? 0;
  const topCategory = summary?.topCategory;
  const topAmount = summary?.byCategory?.[0]?.total ?? 0;

  const expenseRatio = income > 0 ? Math.min(100, Math.round((expense / income) * 100)) : 0;
  const netRatio = income > 0 ? Math.max(0, Math.min(100, Math.round((net / income) * 100))) : 0;
  const topRatio = expense > 0 ? Math.min(100, Math.round((topAmount / expense) * 100)) : 0;

  const cards = [
    {
      key: 'income',
      label: 'Total Income',
      value: formatCurrency(income),
      meta: 'Received this month',
      tone: 'income',
      progress: 100,
      color: '#10B981',
    },
    {
      key: 'expense',
      label: 'Total Expenses',
      value: formatCurrency(expense),
      meta: `${expenseRatio}% of income`,
      tone: 'expense',
      progress: expenseRatio,
      color: '#F43F5E',
    },
    {
      key: 'net',
      label: 'Net Balance',
      value: formatSignedCurrency(net),
      meta: net >= 0 ? `${netRatio}% saved this month` : 'Overspent this month',
      tone: net >= 0 ? 'positive' : 'negative',
      progress: netRatio,
      color: net >= 0 ? '#10B981' : '#EF4444',
    },
    {
      key: 'top',
      label: 'Top Category',
      value: topCategory ?? '—',
      meta: topCategory ? `${formatCurrency(topAmount)} (${topRatio}%)` : 'No spending yet',
      tone: 'neutral',
      text: true,
      progress: topRatio,
      color: '#8B5CF6',
    },
  ];

  return (
    <section className="summary-grid" aria-label="Monthly summary">
      {cards.map((card) => (
        <article
          key={card.key}
          className={`stat stat--${card.tone} ${loading ? 'is-loading' : ''}`}
        >
          <div className="stat__top">
            <span className="stat__label">{card.label}</span>
            {card.progress !== undefined && (
              <span className="stat__pct mono">{card.progress}%</span>
            )}
          </div>
          <p className={`stat__value ${card.text ? 'stat__value--text' : 'mono'}`}>{card.value}</p>
          <p className="stat__meta">{card.meta}</p>
          <div className="stat__progress-track">
            <div
              className="stat__progress-bar"
              style={{
                width: `${card.progress || 0}%`,
                backgroundColor: card.color,
              }}
            />
          </div>
        </article>
      ))}
    </section>
  );
}
