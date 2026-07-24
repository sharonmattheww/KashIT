import { db } from '../db/connection.js';
import { getDailySpending } from '../models/dailyModel.js';
import { isValidMonth } from '../lib/validation.js';

export function getDailySummary(req, res) {
  const month = req.query.month ?? new Date().toISOString().slice(0, 7);
  if (!isValidMonth(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format.' });
  }
  res.json(getDailySpending(db, month));
}
