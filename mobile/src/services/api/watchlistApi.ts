import { apiClient } from "./client";
import { WatchlistItem } from "../../domain/models/Watchlist";

export async function fetchWatchlist(userId: string): Promise<WatchlistItem[]> {
  const { data } = await apiClient.get<WatchlistItem[]>(`/watchlist/${userId}`);
  return data;
}

export async function addToWatchlist(userId: string, coinId: string): Promise<WatchlistItem> {
  const { data } = await apiClient.post<WatchlistItem>("/watchlist", { userId, coinId });
  return data;
}

export async function removeFromWatchlist(entryId: string): Promise<void> {
  await apiClient.delete(`/watchlist/${entryId}`);
}
