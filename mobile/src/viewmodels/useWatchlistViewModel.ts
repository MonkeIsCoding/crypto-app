import { useWatchlist } from "../context/WatchlistContext";

export function useWatchlistViewModel() {
  const { items, loading, refreshing, error, offline, refresh } = useWatchlist();

  return { items, loading, refreshing, error, offline, refresh };
}
