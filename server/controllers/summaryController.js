import { db } from '../db/connection.js';
import { getSummary } from '../models/summaryModel.js';
import { isValidMonth } from '../lib/validation.js';

export function getMonthlySummary(req, res) {
  // Default to the current month when no month is supplied.
  const month = req.query.month ?? new Date().toISOString().slice(0, 7);
  if (!isValidMonth(month)) {
    return res.status(400).json({ error: 'month must be in YYYY-MM format.' });
  }
  res.json(getSummary(db, month));
}
