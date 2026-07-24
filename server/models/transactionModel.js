// Data-access layer for transactions. Every function takes the `db` connection
// as its first argument so the same code works against the real file database
// and the in-memory database used by the tests.

const SELECT_WITH_CATEGORY = `
  SELECT
    t.id,
    t.description,
    t.amount,
    t.type,
    t.category_id           AS categoryId,
    c.name                  AS category,
    c.color                 AS categoryColor,
    t.date,
    t.created_at            AS createdAt
  FROM transactions t
  JOIN categories c ON c.id = t.category_id
`;

/**
 * List transactions, newest first, with optional filters.
 * All filters are optional and simply add WHERE clauses to one query — search
 * and category filtering are not separate endpoints, just extra conditions.
 *
 * @param {object} db
 * @param {{ month?: string, category?: string, search?: string, type?: string }} [filters]
 */
export function listTransactions(db, filters = {}) {
  const clauses = [];
  const params = {};

  if (filters.month) {
    // month is 'YYYY-MM'; matches any date within that month.
    clauses.push('t.date LIKE @month');
    params.month = `${filters.month}%`;
  }
  if (filters.category) {
    clauses.push('c.name = @category');
    params.category = filters.category;
  }
  if (filters.type) {
    clauses.push('t.type = @type');
    params.type = filters.type;
  }
  if (filters.search) {
    clauses.push('t.description LIKE @search');
    params.search = `%${filters.search}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const sql = `${SELECT_WITH_CATEGORY} ${where} ORDER BY t.date DESC, t.id DESC`;

  return db.prepare(sql).all(params);
}

export function getTransactionById(db, id) {
  return db.prepare(`${SELECT_WITH_CATEGORY} WHERE t.id = ?`).get(id);
}

export function createTransaction(db, { description, amount, type, categoryId, date }) {
  const info = db
    .prepare(
      `INSERT INTO transactions (description, amount, type, category_id, date)
       VALUES (@description, @amount, @type, @categoryId, @date)`,
    )
    .run({ description, amount, type, categoryId, date });

  return getTransactionById(db, info.lastInsertRowid);
}

export function updateTransaction(db, id, { description, amount, type, categoryId, date }) {
  db.prepare(
    `UPDATE transactions
        SET description = @description,
            amount      = @amount,
            type        = @type,
            category_id = @categoryId,
            date        = @date
      WHERE id = @id`,
  ).run({ id, description, amount, type, categoryId, date });

  return getTransactionById(db, id);
}

export function deleteTransaction(db, id) {
  const info = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
  return info.changes > 0;
}

/** Used by validation to reject a transaction that points at a missing category. */
export function categoryExists(db, categoryId) {
  const row = db.prepare('SELECT 1 FROM categories WHERE id = ?').get(categoryId);
  return Boolean(row);
}
