import { formatCurrency, formatSignedCurrency } from '../utils/format.js';

// Presentational: it only renders the numbers it is handed. All the maths lives
// in the backend summary query, so there is nothing to compute here.
export default function SummaryCards({ summary, loading }) {
  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const net = summary?.net ?? 0;
  const topCategory = summary?.topCategory;
  const topAmount = summary?.byCategory?.[0]?.total ?? 0;

  const cards = [
    {
      key: 'income',
      label: 'Income',
      value: formatCurrency(income),
      meta: 'received this month',
      tone: 'income',
    },
    {
      key: 'expense',
      label: 'Expenses',
      value: formatCurrency(expense),
      meta: 'spent this month',
      tone: 'expense',
    },
    {
      key: 'net',
      label: 'Net balance',
      value: formatSignedCurrency(net),
      meta: net >= 0 ? 'saved this month' : 'overspent this month',
      tone: net >= 0 ? 'positive' : 'negative',
    },
    {
      key: 'top',
      label: 'Top category',
      value: topCategory ?? '—',
      meta: topCategory ? `${formatCurrency(topAmount)} spent` : 'no spending yet',
      tone: 'neutral',
      text: true,
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
          <p className={`stat__value ${card.text ? 'stat__value--text' : 'mono'}`}>{card.value}</p>
          <p className="stat__meta">{card.meta}</p>
        </article>
      ))}
    </section>
  );
}
