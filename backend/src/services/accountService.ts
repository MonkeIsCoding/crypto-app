import { getAuth } from "firebase-admin/auth";
import * as watchlistRepository from "../repositories/watchlistRepository";
import * as alertsRepository from "../repositories/alertsRepository";

export async function deleteAccount(userId: string): Promise<void> {
  await watchlistRepository.deleteAllForUser(userId);
  await alertsRepository.deleteAllForUser(userId);
  await getAuth().deleteUser(userId);
}
