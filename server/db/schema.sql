-- Database schema for the Personal Finance Dashboard.
-- Two tables kept intentionally small and normalised: a transaction points at a
-- category by id rather than repeating the category name on every row.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,          -- Food, Transport, Salary, ...
  color TEXT NOT NULL DEFAULT '#6E7B75' -- hex used to keep chart + list colours in sync
);

CREATE TABLE IF NOT EXISTS transactions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT    NOT NULL,
  amount      REAL    NOT NULL CHECK (amount > 0),   -- always stored positive
  type        TEXT    NOT NULL CHECK (type IN ('income', 'expense')),
  category_id INTEGER NOT NULL,
  date        TEXT    NOT NULL,                        -- 'YYYY-MM-DD'
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Indexes that back the two things we filter/aggregate on most: the month view
-- and per-category grouping. They keep the summary query fast as rows grow.
CREATE INDEX IF NOT EXISTS idx_transactions_date        ON transactions (date);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions (category_id);
