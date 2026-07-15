import { db } from "../config/firebase";
import { CoinCache } from "../types";

const COLLECTION = "coins_cache";

export async function getAllCoins(): Promise<CoinCache[]> {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map((doc) => doc.data() as CoinCache);
}

export async function getCoinById(coinId: string): Promise<CoinCache | null> {
  const doc = await db.collection(COLLECTION).doc(coinId).get();
  return doc.exists ? (doc.data() as CoinCache) : null;
}

export async function getCoinsByIds(coinIds: string[]): Promise<Map<string, CoinCache>> {
  if (coinIds.length === 0) return new Map();
  const refs = coinIds.map((id) => db.collection(COLLECTION).doc(id));
  const docs = await db.getAll(...refs);
  const result = new Map<string, CoinCache>();
  docs.forEach((doc) => {
    if (doc.exists) result.set(doc.id, doc.data() as CoinCache);
  });
  return result;
}

export async function upsertCoins(coins: CoinCache[]): Promise<void> {
  const batch = db.batch();
  coins.forEach((coin) => {
    batch.set(db.collection(COLLECTION).doc(coin.coin_id), coin, { merge: true });
  });
  await batch.commit();
}
