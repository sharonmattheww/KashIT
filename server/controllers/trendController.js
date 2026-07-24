import { db } from '../db/connection.js';
import { getTrend } from '../models/trendModel.js';

/**
 * GET /api/summary/trend?months=6
 * Returns monthly income/expense totals for the last N months.
 */
export function getMonthlyTrend(req, res) {
  const rawMonths = req.query.months ?? '6';
  const months = parseInt(rawMonths, 10);

  if (Number.isNaN(months) || months < 1 || months > 24) {
    return res.status(400).json({ error: 'months must be an integer between 1 and 24.' });
  }

  res.json(getTrend(db, months));
}
