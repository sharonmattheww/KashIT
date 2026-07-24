// Monthly trend — aggregates income and expense totals for the last N calendar
// months. Months with no transactions still appear (via a CTE date series) so
// the bar chart never has surprise gaps in the timeline.

/**
 * Return the last `months` months of income/expense totals in ascending date
 * order (oldest first, so the chart reads left → right).
 *
 * @param {object} db
 * @param {number} months - how many months back to look (default 6)
 * @returns {Array<{ month: string, totalIncome: number, totalExpense: number }>}
 */
export function getTrend(db, months = 6) {
  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  // Build a list of the last `months` YYYY-MM strings in JS (SQLite doesn't
  // have a native date-series generator in all versions).
  const now = new Date();
  const monthKeys = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthKeys.push(key);
  }

  // One query that returns one row per (month, type) combination present in
  // the database. We'll merge it with the full monthKeys list in JS so every
  // month is represented even if it has no transactions.
  const rows = db
    .prepare(
      `SELECT substr(date, 1, 7) AS month,
              type,
              SUM(amount)         AS total
         FROM transactions
        WHERE substr(date, 1, 7) >= ?
        GROUP BY month, type
        ORDER BY month ASC`,
    )
    .all(monthKeys[0]);

  // Build a lookup: { 'YYYY-MM': { income: n, expense: n } }
  const lookup = {};
  for (const row of rows) {
    if (!lookup[row.month]) lookup[row.month] = { income: 0, expense: 0 };
    lookup[row.month][row.type] = round2(row.total);
  }

  return monthKeys.map((m) => ({
    month: m,
    totalIncome: lookup[m]?.income ?? 0,
    totalExpense: lookup[m]?.expense ?? 0,
  }));
}
