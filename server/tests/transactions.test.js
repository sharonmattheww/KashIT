import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../models/transactionModel.js';
import { makeTestDb } from './helpers.js';

test('create returns the row joined with its category', () => {
  const { db, ids } = makeTestDb();
  const created = createTransaction(db, {
    description: 'Coffee',
    amount: 4.5,
    type: 'expense',
    categoryId: ids.food,
    date: '2026-07-20',
  });

  assert.equal(created.description, 'Coffee');
  assert.equal(created.category, 'Food');
  assert.equal(created.categoryColor, '#C1502E');
});

test('filters combine: month + category + search narrow the list', () => {
  const { db } = makeTestDb();

  assert.equal(listTransactions(db, { month: '2026-07' }).length, 4);
  assert.equal(listTransactions(db, { month: '2026-07', category: 'Food' }).length, 2);
  assert.equal(
    listTransactions(db, { month: '2026-07', category: 'Food', search: 'lunch' }).length,
    1,
  );
});

test('update changes fields and delete removes the row', () => {
  const { db, ids } = makeTestDb();
  const [first] = listTransactions(db, { month: '2026-07' });

  const updated = updateTransaction(db, first.id, {
    description: 'Updated',
    amount: 99,
    type: 'expense',
    categoryId: ids.transport,
    date: first.date,
  });
  assert.equal(updated.description, 'Updated');
  assert.equal(updated.amount, 99);
  assert.equal(updated.category, 'Transport');

  assert.equal(deleteTransaction(db, first.id), true);
  assert.equal(deleteTransaction(db, first.id), false); // already gone
});
