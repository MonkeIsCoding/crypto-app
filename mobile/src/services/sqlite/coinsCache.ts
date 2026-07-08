import { getDb } from "./db";
import { Coin } from "../../domain/models/Coin";

export async function getCachedCoins(): Promise<Coin[]> {
  const db = await getDb();
  return db.getAllAsync<Coin>(
    "SELECT coin_id, name, symbol, price, price_change_24h, market_cap, last_updated FROM coins_cache;"
  );
}

export async function replaceCachedCoins(coins: Coin[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM coins_cache;");
    for (const coin of coins) {
      await db.runAsync(
        `INSERT INTO coins_cache
          (coin_id, name, symbol, price, price_change_24h, market_cap, last_updated)
          VALUES (?, ?, ?, ?, ?, ?, ?);`,
        coin.coin_id,
        coin.name,
        coin.symbol,
        coin.price,
        coin.price_change_24h,
        coin.market_cap,
        coin.last_updated
      );
    }
  });
}
