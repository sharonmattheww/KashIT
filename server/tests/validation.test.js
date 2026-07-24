import { test } from 'node:test';
import assert from 'node:assert/strict';

import { validateTransaction, isValidMonth } from '../lib/validation.js';

test('a well-formed payload passes with no errors', () => {
  const { value, errors } = validateTransaction({
    description: '  Coffee  ',
    amount: '4.50',
    type: 'expense',
    categoryId: '3',
    date: '2026-07-20',
  });

  assert.deepEqual(errors, []);
  assert.equal(value.description, 'Coffee'); // trimmed
  assert.equal(value.amount, 4.5); // coerced to number
  assert.equal(value.categoryId, 3);
});

test('missing and invalid fields each produce an error', () => {
  const { errors } = validateTransaction({
    description: '',
    amount: -5,
    type: 'transfer',
    categoryId: 'abc',
    date: '20-07-2026',
  });

  assert.equal(errors.length, 5);
});

test('isValidMonth accepts YYYY-MM and rejects anything else', () => {
  assert.equal(isValidMonth('2026-07'), true);
  assert.equal(isValidMonth('2026-7'), false);
  assert.equal(isValidMonth('July'), false);
});
