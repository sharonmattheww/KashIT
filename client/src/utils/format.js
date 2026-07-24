// Small pure formatting helpers, shared across components and covered by tests.

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 1350 -> "$1,350.00". Signed variant is used for the net balance. */
export function formatCurrency(amount) {
  return currency.format(amount ?? 0);
}

export function formatSignedCurrency(amount) {
  const sign = amount > 0 ? '+' : amount < 0 ? '−' : '';
  return `${sign}${currency.format(Math.abs(amount ?? 0))}`;
}

/** '2026-07-14' -> "Jul 14, 2026". Parsed as local, not UTC, to avoid drift. */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** '2026-07' -> "July 2026", for headings and the month selector. */
export function formatMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/** Today's month as 'YYYY-MM'. */
export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

/** The last `count` months (including this one) as 'YYYY-MM', newest first. */
export function recentMonths(count = 12, from = new Date()) {
  const months = [];
  for (let i = 0; i < count; i += 1) {
    const d = new Date(from.getFullYear(), from.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}
