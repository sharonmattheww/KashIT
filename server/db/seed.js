// Seeds the database with categories and 6 months of evenly-distributed sample
// transactions so all charts (daily velocity, monthly trend, category breakdown)
// look vibrant and well-populated. Safe to run repeatedly.

import { openDatabase, DEFAULT_DB_PATH } from './connection.js';

const db = openDatabase();

const categories = [
  { name: 'Salary', color: '#10B981' },
  { name: 'Freelance', color: '#34D399' },
  { name: 'Housing', color: '#8B5CF6' },
  { name: 'Groceries', color: '#06B6D4' },
  { name: 'Food & Dining', color: '#F43F5E' },
  { name: 'Transport', color: '#3B82F6' },
  { name: 'Bills & Utilities', color: '#F59E0B' },
  { name: 'Shopping', color: '#EC4899' },
  { name: 'Entertainment', color: '#A855F7' },
  { name: 'Health', color: '#14B8A6' },
];

// Helper to seed a single month with realistic daily transactions
function generateMonthTransactions(year, monthNum, baseSalary = 4200) {
  const m = String(monthNum).padStart(2, '0');
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const txs = [];

  const add = (desc, amount, type, category, day) => {
    const d = String(day).padStart(2, '0');
    txs.push([desc, amount, type, category, `${year}-${m}-${d}`]);
  };

  // Fixed monthly income & major bills
  add('Monthly Salary', baseSalary, 'income', 'Salary', 1);
  if (monthNum % 2 === 0) {
    add('Freelance Design Contract', 850, 'income', 'Freelance', 14);
  } else {
    add('Consulting Services', 650, 'income', 'Freelance', 22);
  }

  add('Apartment Rent', 1350, 'expense', 'Housing', 1);
  add('Gym & Wellness', 45, 'expense', 'Health', 1);
  add('Electricity & Power', 85 + (dayHash(year, monthNum, 5) % 25), 'expense', 'Bills & Utilities', 5);
  add('High-Speed Internet', 55, 'expense', 'Bills & Utilities', 5);
  add('Water & Garbage', 35, 'expense', 'Bills & Utilities', 18);

  // Evenly spread recurring expenses across all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const seedVal = dayHash(year, monthNum, day);

    // Groceries every 4-5 days
    if (day % 4 === 1) {
      const amt = Math.round((65 + (seedVal % 45)) * 100) / 100;
      add('Weekly Groceries', amt, 'expense', 'Groceries', day);
    }

    // Food & Dining every 2 days
    if (day % 2 === 0) {
      const amt = Math.round((8 + (seedVal % 35)) * 100) / 100;
      const desc = day % 6 === 0 ? 'Dinner out' : day % 4 === 0 ? 'Lunch combo' : 'Coffee & Pastry';
      add(desc, amt, 'expense', 'Food & Dining', day);
    }

    // Transport every 3 days
    if (day % 3 === 2) {
      const amt = Math.round((12 + (seedVal % 40)) * 100) / 100;
      const desc = day % 6 === 2 ? 'Fuel Refill' : 'Bus Pass / Metro';
      add(desc, amt, 'expense', 'Transport', day);
    }

    // Shopping on selective days
    if (day === 8 || day === 16 || day === 24) {
      const amt = Math.round((35 + (seedVal % 120)) * 100) / 100;
      add('Apparel & Accessories', amt, 'expense', 'Shopping', day);
    }

    // Entertainment on weekends/selective days
    if (day === 7 || day === 15 || day === 21 || day === 28) {
      const amt = Math.round((20 + (seedVal % 55)) * 100) / 100;
      add('Movies & Streaming', amt, 'expense', 'Entertainment', day);
    }

    // Health & Pharmacy
    if (day === 10 || day === 25) {
      const amt = Math.round((18 + (seedVal % 30)) * 100) / 100;
      add('Pharmacy / Supplements', amt, 'expense', 'Health', day);
    }
  }

  return txs;
}

function dayHash(y, m, d) {
  return (y * 31 + m * 12 + d * 7) % 100;
}

// Generate data for February 2026 through July 2026 (6 months)
const allTransactions = [
  ...generateMonthTransactions(2026, 2, 4000),
  ...generateMonthTransactions(2026, 3, 4100),
  ...generateMonthTransactions(2026, 4, 4150),
  ...generateMonthTransactions(2026, 5, 4200),
  ...generateMonthTransactions(2026, 6, 4200),
  ...generateMonthTransactions(2026, 7, 4200),
];

const seed = db.transaction(() => {
  db.exec('DELETE FROM transactions; DELETE FROM categories;');
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
  for (const [description, amount, type, category, date] of allTransactions) {
    insertTx.run(description, amount, type, categoryId[category], date);
  }
});

seed();

console.log(
  `Seeded ${categories.length} categories and ${allTransactions.length} transactions across 6 months into ${DEFAULT_DB_PATH}`,
);
db.close();
