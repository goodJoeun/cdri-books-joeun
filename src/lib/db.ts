import Database from 'better-sqlite3';

declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function createDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS search_history (
      term TEXT PRIMARY KEY,
      added_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE TABLE IF NOT EXISTS wishlist (
      isbn TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      added_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
  return db;
}

// Persist across HMR reloads in development
const db = global.__db ?? createDb();
if (process.env.NODE_ENV !== 'production') global.__db = db;

export default db;
