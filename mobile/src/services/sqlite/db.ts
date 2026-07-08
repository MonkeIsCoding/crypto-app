import * as SQLite from "expo-sqlite";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("crypto_tracker.db").then(async (db) => {
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS watchlist_cache (
          user_id TEXT NOT NULL,
          coin_id TEXT NOT NULL,
          added_at TEXT NOT NULL,
          PRIMARY KEY (user_id, coin_id)
        );`
      );
      await db.execAsync(
        `CREATE TABLE IF NOT EXISTS coins_cache (
          coin_id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          symbol TEXT NOT NULL,
          price REAL NOT NULL,
          price_change_24h REAL NOT NULL,
          market_cap REAL NOT NULL,
          last_updated TEXT NOT NULL
        );`
      );
      return db;
    });
  }
  return dbPromise;
}

export { getDb };
