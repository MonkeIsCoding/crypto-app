import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  addToWatchlist as apiAddToWatchlist,
  fetchWatchlist,
  removeFromWatchlist as apiRemoveFromWatchlist,
} from "../services/api/watchlistApi";
import { getCachedWatchlist, replaceCachedWatchlist } from "../services/sqlite/watchlistCache";
import { WatchlistItem } from "../domain/models/Watchlist";
import { useAuth } from "./AuthContext";

interface WatchlistContextValue {
  items: WatchlistItem[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  offline: boolean;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
  isWatchlisted: (coinId: string) => string | null;
  addCoin: (coinId: string) => Promise<void>;
  removeCoin: (coinId: string) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!user) return;
      const silent = opts?.silent ?? false;
      if (!silent) setRefreshing(true);
      setError(null);
      setOffline(false);
      try {
        const data = await fetchWatchlist();
        setItems(data);
        await replaceCachedWatchlist(
          user.uid,
          data.map((item) => ({ user_id: item.user_id, coin_id: item.coin_id, added_at: item.added_at }))
        );
      } catch (err) {
        // Backend/network unavailable — fall back to the last synced SQLite cache.
        const cached = await getCachedWatchlist(user.uid);
        if (cached.length > 0) {
          setOffline(true);
          setItems(cached.map((row) => ({ ...row, id: `${row.user_id}:${row.coin_id}`, coin: null })));
        } else {
          setError("Couldn't load your watchlist.");
        }
      } finally {
        if (!silent) setRefreshing(false);
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      setLoading(true);
      refresh();
    } else {
      setItems([]);
      setLoading(false);
    }
    // refresh() is stable per-user via useCallback; re-running on user change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWatchlisted = useCallback(
    (coinId: string) => items.find((item) => item.coin_id === coinId)?.id ?? null,
    [items]
  );

  const addCoin = useCallback(
    async (coinId: string) => {
      if (!user) return;
      await apiAddToWatchlist(coinId);
      await refresh({ silent: true });
    },
    [user, refresh]
  );

  const removeCoin = useCallback(
    async (coinId: string) => {
      const entryId = isWatchlisted(coinId);
      if (!entryId) return;
      await apiRemoveFromWatchlist(entryId);
      await refresh({ silent: true });
    },
    [isWatchlisted, refresh]
  );

  const value = useMemo(
    () => ({ items, loading, refreshing, error, offline, refresh, isWatchlisted, addCoin, removeCoin }),
    [items, loading, refreshing, error, offline, refresh, isWatchlisted, addCoin, removeCoin]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return ctx;
}
