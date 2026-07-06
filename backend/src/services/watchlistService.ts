import * as watchlistRepository from "../repositories/watchlistRepository";
import * as coinsRepository from "../repositories/coinsRepository";
import { WatchlistItemWithPrice } from "../types";

export async function addCoin(userId: string, coinId: string) {
  return watchlistRepository.addToWatchlist(userId, coinId);
}

export async function removeCoin(entryId: string): Promise<void> {
  return watchlistRepository.removeFromWatchlist(entryId);
}

export async function getUserWatchlist(userId: string): Promise<WatchlistItemWithPrice[]> {
  const entries = await watchlistRepository.getWatchlistByUser(userId);
  const coinsById = await coinsRepository.getCoinsByIds(entries.map((e) => e.coin_id));

  return entries.map((entry) => ({
    ...entry,
    coin: coinsById.get(entry.coin_id) ?? null,
  }));
}
