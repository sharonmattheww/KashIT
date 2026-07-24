import { db } from '../db/connection.js';
import { getDailySpending } from '../models/dailyModel.js';
import { isValidMonth } from '../lib/validation.js';

/**
 * GET /api/summary/daily?month=YYYY-MM
 * Returns per-day income and expense totals for the requested month.
 */
export function getDailyBreakdown(req, res) {
  const month = req.query.month ?? new Date().toISOString().slice(0, 7);
  if (!isValidMonth(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format.' });
  }
  res.json(getDailySpending(db, month));
}
