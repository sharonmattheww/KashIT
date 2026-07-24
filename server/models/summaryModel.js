// Monthly summary. This is where SQL earns its keep: the per-category breakdown
// and the income/expense totals are done with GROUP BY / SUM in the database,
// so the frontend just displays numbers it is handed rather than looping over
// every transaction in the browser.

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Build the summary object for a single month.
 * @param {object} db
 * @param {string} month - 'YYYY-MM'
 */
export function getSummary(db, month) {
  const monthLike = `${month}%`;

  // Totals per type (income vs expense) in one grouped query.
  const totalsByType = db
    .prepare(
      `SELECT type, SUM(amount) AS total
         FROM transactions
        WHERE date LIKE ?
        GROUP BY type`,
    )
    .all(monthLike);

  const totalIncome = totalsByType.find((r) => r.type === 'income')?.total ?? 0;
  const totalExpense = totalsByType.find((r) => r.type === 'expense')?.total ?? 0;

  // Expense breakdown per category — this feeds the chart and the "top category"
  // card from a single source of truth.
  const byCategory = db
    .prepare(
      `SELECT c.name AS category, c.color, SUM(t.amount) AS total
         FROM transactions t
         JOIN categories c ON c.id = t.category_id
        WHERE t.date LIKE ? AND t.type = 'expense'
        GROUP BY c.id
        ORDER BY total DESC`,
    )
    .all(monthLike)
    .map((row) => ({ ...row, total: round2(row.total) }));

  const transactionCount = db
    .prepare('SELECT COUNT(*) AS count FROM transactions WHERE date LIKE ?')
    .get(monthLike).count;

  return {
    month,
    totalIncome: round2(totalIncome),
    totalExpense: round2(totalExpense),
    net: round2(totalIncome - totalExpense),
    topCategory: byCategory[0]?.category ?? null,
    byCategory,
    transactionCount,
  };
}
