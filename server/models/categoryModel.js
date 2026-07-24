// Data-access layer for categories.

export function listCategories(db) {
  return db.prepare('SELECT id, name, color FROM categories ORDER BY name').all();
}

export function createCategory(db, { name, color }) {
  const info = db
    .prepare('INSERT INTO categories (name, color) VALUES (@name, @color)')
    .run({ name, color });
  return db.prepare('SELECT id, name, color FROM categories WHERE id = ?').get(info.lastInsertRowid);
}
