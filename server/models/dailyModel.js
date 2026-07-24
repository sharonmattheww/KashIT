const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Get daily and weekly spending/income data for a specific month (YYYY-MM).
 * @param {object} db
 * @param {string} month - 'YYYY-MM'
 */
export function getDailySpending(db, month) {
  const monthLike = `${month}%`;

  const rows = db
    .prepare(
      `SELECT date,
              SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense,
              SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income
         FROM transactions
        WHERE date LIKE ?
        GROUP BY date
        ORDER BY date ASC`,
    )
    .all(monthLike);

  // Build lookup map by date YYYY-MM-DD
  const lookup = {};
  for (const r of rows) {
    lookup[r.date] = {
      expense: round2(r.expense),
      income: round2(r.income),
    };
  }

  // Get number of days in the month
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const m = parseInt(monthStr, 10);
  const daysInMonth = new Date(year, m, 0).getDate();

  const daily = [];
  const weeklyMap = { 'Week 1': { expense: 0, income: 0 }, 'Week 2': { expense: 0, income: 0 }, 'Week 3': { expense: 0, income: 0 }, 'Week 4+': { expense: 0, income: 0 } };

  for (let day = 1; day <= daysInMonth; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const dateKey = `${month}-${dayPadded}`;
    const entry = lookup[dateKey] || { expense: 0, income: 0 };

    daily.push({
      date: dateKey,
      day: dayPadded,
      label: `Day ${day}`,
      expense: entry.expense,
      income: entry.income,
    });

    // Assign to week
    let weekKey = 'Week 1';
    if (day > 21) weekKey = 'Week 4+';
    else if (day > 14) weekKey = 'Week 3';
    else if (day > 7) weekKey = 'Week 2';

    weeklyMap[weekKey].expense = round2(weeklyMap[weekKey].expense + entry.expense);
    weeklyMap[weekKey].income = round2(weeklyMap[weekKey].income + entry.income);
  }

  const weekly = Object.keys(weeklyMap).map((w) => ({
    week: w,
    expense: weeklyMap[w].expense,
    income: weeklyMap[w].income,
  }));

  return { month, daily, weekly };
}
