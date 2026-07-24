import { openDatabase } from '../db/connection.js';

/**
 * Build an in-memory database pre-loaded with a small, known dataset so tests
 * assert against numbers we can compute by hand. Never touches finance.db.
 */
export function makeTestDb() {
  const db = openDatabase(':memory:');

  const cat = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  const salary = cat.run('Salary', '#2F7D5B').lastInsertRowid;
  const food = cat.run('Food', '#C1502E').lastInsertRowid;
  const transport = cat.run('Transport', '#4C6EA0').lastInsertRowid;

  const tx = db.prepare(
    `INSERT INTO transactions (description, amount, type, category_id, date)
     VALUES (?, ?, ?, ?, ?)`,
  );
  // July 2026: income 3000; expenses 100 (food) + 40 (transport) = 140.
  tx.run('Salary', 3000, 'income', salary, '2026-07-01');
  tx.run('Lunch', 60, 'expense', food, '2026-07-05');
  tx.run('Dinner', 40, 'expense', food, '2026-07-12');
  tx.run('Bus', 40, 'expense', transport, '2026-07-08');
  // June 2026: a single expense, to prove month filtering excludes it.
  tx.run('Old coffee', 5, 'expense', food, '2026-06-30');

  return { db, ids: { salary, food, transport } };
}
