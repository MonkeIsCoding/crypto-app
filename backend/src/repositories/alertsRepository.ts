import { db } from "../config/firebase";
import { Alert, AlertType } from "../types";

const COLLECTION = "alerts";

export async function createAlert(
  userId: string,
  coinId: string,
  type: AlertType,
  targetPrice: number
): Promise<Alert> {
  const entry = {
    user_id: userId,
    coin_id: coinId,
    type,
    target_price: targetPrice,
    triggered: false,
    created_at: new Date().toISOString(),
  };
  const ref = await db.collection(COLLECTION).add(entry);
  return { id: ref.id, ...entry };
}

export async function getAlertById(alertId: string): Promise<Alert | null> {
  const doc = await db.collection(COLLECTION).doc(alertId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...(doc.data() as Omit<Alert, "id">) };
}

export async function removeAlert(alertId: string): Promise<void> {
  await db.collection(COLLECTION).doc(alertId).delete();
}

export async function getAlertsByUser(userId: string): Promise<Alert[]> {
  const snapshot = await db.collection(COLLECTION).where("user_id", "==", userId).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Alert, "id">) }));
}

export async function deleteAllForUser(userId: string): Promise<void> {
  const snapshot = await db.collection(COLLECTION).where("user_id", "==", userId).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

export async function getUntriggeredAlerts(): Promise<Alert[]> {
  const snapshot = await db.collection(COLLECTION).where("triggered", "==", false).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Alert, "id">) }));
}

export async function markTriggered(alertId: string): Promise<void> {
  await db.collection(COLLECTION).doc(alertId).update({ triggered: true });
}
