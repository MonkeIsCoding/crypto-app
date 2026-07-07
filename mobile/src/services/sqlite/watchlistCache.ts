import { getDb } from "./db";

export interface CachedWatchlistRow {
  user_id: string;
  coin_id: string;
  added_at: string;
}

export async function getCachedWatchlist(userId: string): Promise<CachedWatchlistRow[]> {
  const db = await getDb();
  return db.getAllAsync<CachedWatchlistRow>(
    "SELECT user_id, coin_id, added_at FROM watchlist_cache WHERE user_id = ?;",
    userId
  );
}

export async function replaceCachedWatchlist(userId: string, rows: CachedWatchlistRow[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM watchlist_cache WHERE user_id = ?;", userId);
    for (const row of rows) {
      await db.runAsync(
        "INSERT INTO watchlist_cache (user_id, coin_id, added_at) VALUES (?, ?, ?);",
        row.user_id,
        row.coin_id,
        row.added_at
      );
    }
  });
}
