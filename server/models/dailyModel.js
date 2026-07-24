// Daily spending per day within a month.
// Used by the daily spending area chart on the overview page.

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Returns one row per calendar day in `month` that has transactions.
 * The frontend fills zero-gaps for days with no activity.
 *
 * @param {object} db
 * @param {string} month - 'YYYY-MM'
 * @returns {Array<{ date: string, expense: number, income: number }>}
 */
export function getDailySpending(db, month) {
  const rows = db
    .prepare(
      `SELECT date,
              SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
              SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS income
         FROM transactions
        WHERE date LIKE ?
        GROUP BY date
        ORDER BY date ASC`,
    )
    .all(`${month}%`);

  return rows.map((r) => ({
    date: r.date,
    expense: round2(r.expense),
    income: round2(r.income),
  }));
}
