import { db } from "../config/firebase";
import { WatchlistEntry } from "../types";

const COLLECTION = "watchlist";

export async function addToWatchlist(userId: string, coinId: string): Promise<WatchlistEntry> {
  const id = `${userId}_${coinId}`;
  const ref = db.collection(COLLECTION).doc(id);

  const existing = await ref.get();
  if (existing.exists) {
    return { id, ...(existing.data() as Omit<WatchlistEntry, "id">) };
  }

  const entry = {
    user_id: userId,
    coin_id: coinId,
    added_at: new Date().toISOString(),
  };
  await ref.set(entry);
  return { id, ...entry };
}

export async function getWatchlistEntryById(entryId: string): Promise<WatchlistEntry | null> {
  const doc = await db.collection(COLLECTION).doc(entryId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Omit<WatchlistEntry, "id">) };
}

export async function removeFromWatchlist(entryId: string): Promise<void> {
  await db.collection(COLLECTION).doc(entryId).delete();
}

export async function getWatchlistByUser(userId: string): Promise<WatchlistEntry[]> {
  const snapshot = await db.collection(COLLECTION).where("user_id", "==", userId).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<WatchlistEntry, "id">) }));
}

export async function deleteAllForUser(userId: string): Promise<void> {
  const snapshot = await db.collection(COLLECTION).where("user_id", "==", userId).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}
