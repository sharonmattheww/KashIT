import { db } from '../db/connection.js';
import {
  listTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  categoryExists,
} from '../models/transactionModel.js';
import { validateTransaction } from '../lib/validation.js';

export function getTransactions(req, res) {
  const { month, category, search, type } = req.query;
  const rows = listTransactions(db, { month, category, search, type });
  res.json(rows);
}

export function getTransaction(req, res) {
  const row = getTransactionById(db, Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'Transaction not found.' });
  res.json(row);
}

export function postTransaction(req, res) {
  const { value, errors } = validateTransaction(req.body);
  if (errors.length) return res.status(400).json({ errors });
  if (!categoryExists(db, value.categoryId)) {
    return res.status(400).json({ errors: ['That category does not exist.'] });
  }

  const created = createTransaction(db, value);
  res.status(201).json(created);
}

export function putTransaction(req, res) {
  const id = Number(req.params.id);
  if (!getTransactionById(db, id)) {
    return res.status(404).json({ error: 'Transaction not found.' });
  }

  const { value, errors } = validateTransaction(req.body);
  if (errors.length) return res.status(400).json({ errors });
  if (!categoryExists(db, value.categoryId)) {
    return res.status(400).json({ errors: ['That category does not exist.'] });
  }

  const updated = updateTransaction(db, id, value);
  res.json(updated);
}

export function removeTransaction(req, res) {
  const removed = deleteTransaction(db, Number(req.params.id));
  if (!removed) return res.status(404).json({ error: 'Transaction not found.' });
  res.status(204).end();
}
