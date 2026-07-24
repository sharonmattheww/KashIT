// Seeds the database with rich categories and 6 full months of realistic
// sample transactions so all charts (spending velocity, monthly trend, 
// category breakdown, summary cards) display smooth, well-distributed data.

import { openDatabase, DEFAULT_DB_PATH } from './connection.js';

const db = openDatabase();

const categories = [
  { name: 'Salary', color: '#10B981' },
  { name: 'Freelance', color: '#34D399' },
  { name: 'Investments', color: '#059669' },
  { name: 'Housing', color: '#8B5CF6' },
  { name: 'Groceries', color: '#A78BFA' },
  { name: 'Food & Dining', color: '#F43F5E' },
  { name: 'Transport', color: '#3B82F6' },
  { name: 'Bills & Utilities', color: '#6366F1' },
  { name: 'Shopping', color: '#EC4899' },
  { name: 'Entertainment', color: '#F59E0B' },
  { name: 'Health', color: '#14B8A6' },
];

const transactions = [
  // ==================== July 2026 (Current Active Month) ====================
  // Income
  ['Monthly Salary - Tech Corp', 4850, 'income', 'Salary', '2026-07-01'],
  ['Freelance UI Design Client', 850, 'income', 'Freelance', '2026-07-12'],
  ['Stock Dividend Payout', 145, 'income', 'Investments', '2026-07-24'],

  // Daily Expenses (distributed continuously from Day 1 to Day 31)
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-07-01'],
  ['Gym & Fitness Membership', 45, 'expense', 'Health', '2026-07-01'],
  ['Monthly Transit Pass', 75, 'expense', 'Transport', '2026-07-01'],
  ['Artisan Coffee & Breakfast', 8.5, 'expense', 'Food & Dining', '2026-07-02'],
  ['Organic Grocery Market', 112.4, 'expense', 'Groceries', '2026-07-03'],
  ['Gas Station Fuel', 48.0, 'expense', 'Transport', '2026-07-04'],
  ['Electricity & Energy Bill', 95.5, 'expense', 'Bills & Utilities', '2026-07-05'],
  ['High-Speed Fiber Internet', 60.0, 'expense', 'Bills & Utilities', '2026-07-05'],
  ['Cloud Services Subscription', 19.99, 'expense', 'Bills & Utilities', '2026-07-06'],
  ['Team Bistro Lunch', 38.5, 'expense', 'Food & Dining', '2026-07-07'],
  ['Pharmacy & Vitamins', 34.2, 'expense', 'Health', '2026-07-08'],
  ['Wireless ANC Headphones', 149.99, 'expense', 'Shopping', '2026-07-09'],
  ['Weekly Grocery Supermarket', 94.6, 'expense', 'Groceries', '2026-07-10'],
  ['Cinema & IMAX Tickets', 32.0, 'expense', 'Entertainment', '2026-07-11'],
  ['Weekend Brunch Spot', 45.0, 'expense', 'Food & Dining', '2026-07-12'],
  ['Mobile Phone Plan', 55.0, 'expense', 'Bills & Utilities', '2026-07-13'],
  ['Italian Restaurant Dinner', 78.5, 'expense', 'Food & Dining', '2026-07-14'],
  ['Rideshare Downtown', 22.4, 'expense', 'Transport', '2026-07-15'],
  ['Casual Clothing Store', 68.0, 'expense', 'Shopping', '2026-07-16'],
  ['Mid-Month Grocery Restock', 108.3, 'expense', 'Groceries', '2026-07-17'],
  ['Bookstore Purchase', 29.95, 'expense', 'Entertainment', '2026-07-18'],
  ['Specialty Coffee Roasters', 12.0, 'expense', 'Food & Dining', '2026-07-19'],
  ['Car Wash & Detailing', 35.0, 'expense', 'Transport', '2026-07-20'],
  ['Dental Checkup', 85.0, 'expense', 'Health', '2026-07-21'],
  ['Weekly Fresh Farmers Market', 82.5, 'expense', 'Groceries', '2026-07-22'],
  ['Streaming & Music Services', 24.99, 'expense', 'Entertainment', '2026-07-23'],
  ['Sushi House Dinner', 64.0, 'expense', 'Food & Dining', '2026-07-24'],
  ['Home Hardware Supplies', 42.8, 'expense', 'Shopping', '2026-07-25'],
  ['Weekend Grocery Shopping', 115.2, 'expense', 'Groceries', '2026-07-26'],
  ['Bakery & Desserts', 18.5, 'expense', 'Food & Dining', '2026-07-27'],
  ['Gas Station Refill', 52.1, 'expense', 'Transport', '2026-07-28'],
  ['Tech Accessories', 39.99, 'expense', 'Shopping', '2026-07-29'],
  ['End of Month Groceries', 74.3, 'expense', 'Groceries', '2026-07-30'],
  ['Café & Pastry', 9.5, 'expense', 'Food & Dining', '2026-07-31'],

  // ==================== June 2026 ====================
  ['Monthly Salary', 4850, 'income', 'Salary', '2026-06-01'],
  ['Consulting Gig', 500, 'income', 'Freelance', '2026-06-15'],
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-06-01'],
  ['Weekly Groceries', 110.0, 'expense', 'Groceries', '2026-06-03'],
  ['Utilities & Electricity', 88.0, 'expense', 'Bills & Utilities', '2026-06-05'],
  ['Doctor Consultation', 50.0, 'expense', 'Health', '2026-06-09'],
  ['Fuel & Tolls', 62.0, 'expense', 'Transport', '2026-06-12'],
  ['Running Sneakers', 119.99, 'expense', 'Shopping', '2026-06-14'],
  ['Groceries', 95.5, 'expense', 'Groceries', '2026-06-18'],
  ['Concert Ticket', 85.0, 'expense', 'Entertainment', '2026-06-22'],

  // ==================== May 2026 ====================
  ['Monthly Salary', 4600, 'income', 'Salary', '2026-05-01'],
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-05-01'],
  ['Groceries Total', 420.0, 'expense', 'Groceries', '2026-05-10'],
  ['Electric & Water', 92.0, 'expense', 'Bills & Utilities', '2026-05-05'],
  ['New Monitor Purchase', 280.0, 'expense', 'Shopping', '2026-05-15'],
  ['Dining & Night Out', 140.0, 'expense', 'Food & Dining', '2026-05-20'],

  // ==================== April 2026 ====================
  ['Monthly Salary', 4600, 'income', 'Salary', '2026-04-01'],
  ['Bonus Payment', 600, 'income', 'Salary', '2026-04-15'],
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-04-01'],
  ['Groceries', 380.0, 'expense', 'Groceries', '2026-04-08'],
  ['Utilities', 85.0, 'expense', 'Bills & Utilities', '2026-04-05'],
  ['Spring Clothes', 160.0, 'expense', 'Shopping', '2026-04-18'],

  // ==================== March 2026 ====================
  ['Monthly Salary', 4500, 'income', 'Salary', '2026-03-01'],
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-03-01'],
  ['Groceries', 390.0, 'expense', 'Groceries', '2026-03-09'],
  ['Utilities', 80.0, 'expense', 'Bills & Utilities', '2026-03-05'],
  ['Car Maintenance', 210.0, 'expense', 'Transport', '2026-03-14'],

  // ==================== February 2026 ====================
  ['Monthly Salary', 4500, 'income', 'Salary', '2026-02-01'],
  ['Apartment Rent', 1450, 'expense', 'Housing', '2026-02-01'],
  ['Groceries', 360.0, 'expense', 'Groceries', '2026-02-11'],
  ['Utilities', 88.0, 'expense', 'Bills & Utilities', '2026-02-05'],
  ['Valentine Dinner', 110.0, 'expense', 'Food & Dining', '2026-02-14'],
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
  for (const [description, amount, type, category, date] of transactions) {
    insertTx.run(description, amount, type, categoryId[category], date);
  }
});

seed();

console.log(
  `Seeded ${categories.length} categories and ${transactions.length} transactions into ${DEFAULT_DB_PATH}`,
);
db.close();
