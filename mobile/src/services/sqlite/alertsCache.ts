import { getDb } from "./db";
import { AlertType } from "../../models/Alert";

export interface CachedAlertRow {
  id: string;
  user_id: string;
  coin_id: string;
  type: AlertType;
  target_price: number;
  triggered: boolean;
  created_at: string;
}

export async function getCachedAlerts(userId: string): Promise<CachedAlertRow[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Omit<CachedAlertRow, "triggered"> & { triggered: number }>(
    "SELECT id, user_id, coin_id, type, target_price, triggered, created_at FROM alerts_cache WHERE user_id = ?;",
    userId
  );
  return rows.map((row) => ({ ...row, triggered: row.triggered === 1 }));
}

export async function replaceCachedAlerts(userId: string, rows: CachedAlertRow[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM alerts_cache WHERE user_id = ?;", userId);
    for (const row of rows) {
      await db.runAsync(
        `INSERT INTO alerts_cache
          (id, user_id, coin_id, type, target_price, triggered, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?);`,
        row.id,
        row.user_id,
        row.coin_id,
        row.type,
        row.target_price,
        row.triggered ? 1 : 0,
        row.created_at
      );
    }
  });
}
