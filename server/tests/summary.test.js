import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getSummary } from '../models/summaryModel.js';
import { makeTestDb } from './helpers.js';

test('summary totals income and expenses for the requested month only', () => {
  const { db } = makeTestDb();
  const summary = getSummary(db, '2026-07');

  assert.equal(summary.totalIncome, 3000);
  assert.equal(summary.totalExpense, 140); // 60 + 40 + 40, the June 5 is excluded
  assert.equal(summary.net, 2860);
  assert.equal(summary.transactionCount, 4);
});

test('summary groups expenses by category, largest first', () => {
  const { db } = makeTestDb();
  const summary = getSummary(db, '2026-07');

  assert.deepEqual(
    summary.byCategory.map((c) => [c.category, c.total]),
    [
      ['Food', 100],
      ['Transport', 40],
    ],
  );
  assert.equal(summary.topCategory, 'Food');
});

test('summary of an empty month returns zeros, not nulls', () => {
  const { db } = makeTestDb();
  const summary = getSummary(db, '2020-01');

  assert.equal(summary.totalIncome, 0);
  assert.equal(summary.totalExpense, 0);
  assert.equal(summary.net, 0);
  assert.equal(summary.topCategory, null);
  assert.deepEqual(summary.byCategory, []);
});
