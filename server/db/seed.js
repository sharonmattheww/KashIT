// Seeds the database with a set of categories and two months of sample
// transactions so the dashboard has something to show on first run.
// Safe to run repeatedly: it clears the tables first.

import { openDatabase, DEFAULT_DB_PATH } from './connection.js';

const db = openDatabase();

const categories = [
  { name: 'Salary', color: '#2F7D5B' },
  { name: 'Freelance', color: '#6BA368' },
  { name: 'Housing', color: '#7A6CA8' },
  { name: 'Groceries', color: '#3E8E7E' },
  { name: 'Food & Dining', color: '#C1502E' },
  { name: 'Transport', color: '#4C6EA0' },
  { name: 'Bills & Utilities', color: '#5B8C8A' },
  { name: 'Shopping', color: '#C98BB9' },
  { name: 'Entertainment', color: '#E0A458' },
  { name: 'Health', color: '#B8894A' },
];

// [description, amount, type, categoryName, date]
const transactions = [
  // ---- July 2026 (current month) ----
  ['Monthly salary', 4200, 'income', 'Salary', '2026-07-01'],
  ['Freelance website project', 650, 'income', 'Freelance', '2026-07-12'],
  ['Apartment rent', 1350, 'expense', 'Housing', '2026-07-01'],
  ['Gym membership', 39.0, 'expense', 'Health', '2026-07-01'],
  ['Monthly bus pass', 60.0, 'expense', 'Transport', '2026-07-01'],
  ['Morning coffee', 4.8, 'expense', 'Food & Dining', '2026-07-02'],
  ['Weekly groceries', 82.4, 'expense', 'Groceries', '2026-07-03'],
  ['Electricity bill', 90.0, 'expense', 'Bills & Utilities', '2026-07-05'],
  ['Internet bill', 55.0, 'expense', 'Bills & Utilities', '2026-07-05'],
  ['Streaming subscription', 15.99, 'expense', 'Entertainment', '2026-07-06'],
  ['Team lunch', 34.5, 'expense', 'Food & Dining', '2026-07-08'],
  ['Wireless headphones', 129.99, 'expense', 'Shopping', '2026-07-09'],
  ['Weekly groceries', 76.15, 'expense', 'Groceries', '2026-07-10'],
  ['Fuel top-up', 48.9, 'expense', 'Transport', '2026-07-11'],
  ['Movie night', 28.0, 'expense', 'Entertainment', '2026-07-13'],
  ['Dinner out', 62.0, 'expense', 'Food & Dining', '2026-07-14'],
  ['Pharmacy', 22.3, 'expense', 'Health', '2026-07-15'],
  ['New t-shirt', 24.99, 'expense', 'Shopping', '2026-07-16'],
  ['Weekly groceries', 91.3, 'expense', 'Groceries', '2026-07-17'],
  ['Morning coffee', 5.2, 'expense', 'Food & Dining', '2026-07-20'],
  ['Weekly groceries', 68.75, 'expense', 'Groceries', '2026-07-22'],

  // ---- June 2026 (previous month) ----
  ['Monthly salary', 4200, 'income', 'Salary', '2026-06-01'],
  ['Apartment rent', 1350, 'expense', 'Housing', '2026-06-01'],
  ['Weekly groceries', 88.0, 'expense', 'Groceries', '2026-06-04'],
  ['Electricity bill', 78.0, 'expense', 'Bills & Utilities', '2026-06-05'],
  ['Internet bill', 55.0, 'expense', 'Bills & Utilities', '2026-06-05'],
  ['Doctor visit', 40.0, 'expense', 'Health', '2026-06-09'],
  ['Fuel top-up', 51.0, 'expense', 'Transport', '2026-06-12'],
  ['Running shoes', 89.99, 'expense', 'Shopping', '2026-06-14'],
  ['Weekly groceries', 79.5, 'expense', 'Groceries', '2026-06-18'],
  ['Dinner with friends', 55.0, 'expense', 'Food & Dining', '2026-06-20'],
  ['Concert tickets', 120.0, 'expense', 'Entertainment', '2026-06-21'],
];

const seed = db.transaction(() => {
  db.exec('DELETE FROM transactions; DELETE FROM categories;');
  // Reset the autoincrement counters so ids start clean on a fresh seed.
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('transactions', 'categories');");

  const insertCategory = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  const categoryId = {};
  for (const c of categories) {
    const info = insertCategory.run(c.name, c.color);
    categoryId[c.name] = info.lastInsertRowid;
  }

  const insertTx = db.prepare(
    `INSERT INTO transactions (description, amount, type, category_id, date)
     VALUES (?, ?, ?, ?, ?)`,
  );
  for (const [description, amount, type, category, date] of transactions) {
    insertTx.run(description, amount, type, categoryId[category], date);
  }
});

seed();

console.log(
  `Seeded ${categories.length} categories and ${transactions.length} transactions into ${DEFAULT_DB_PATH}`,
);
db.close();
