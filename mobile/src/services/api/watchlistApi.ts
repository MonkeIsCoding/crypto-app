import { apiClient } from "./client";
import { WatchlistItem } from "../../models/Watchlist";

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  const { data } = await apiClient.get<WatchlistItem[]>("/watchlist");
  return data;
}

export async function addToWatchlist(coinId: string): Promise<WatchlistItem> {
  const { data } = await apiClient.post<WatchlistItem>("/watchlist", { coinId });
  return data;
}

export async function removeFromWatchlist(entryId: string): Promise<void> {
  await apiClient.delete(`/watchlist/${entryId}`);
}
