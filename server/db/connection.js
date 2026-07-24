import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULT_DB_PATH = path.join(__dirname, 'finance.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

/**
 * Open a SQLite database and make sure the schema exists.
 *
 * The path is a parameter (not hard-coded) so the same code can back the real
 * `finance.db` file in production and an in-memory database in tests.
 *
 * @param {string} [filename] - file path, or ':memory:' for an ephemeral db
 * @returns {import('better-sqlite3').Database}
 */
export function openDatabase(filename = DEFAULT_DB_PATH) {
  const db = new Database(filename);
  db.pragma('journal_mode = WAL'); // better read/write concurrency
  db.pragma('foreign_keys = ON'); // enforce the category relationship

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);

  return db;
}

// A single shared connection for the running server. Tests open their own.
export const db = openDatabase();

export { DEFAULT_DB_PATH };
