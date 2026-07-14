import { useCallback, useState } from "react";
import { fetchCoins } from "../services/api/coinsApi";
import { getCachedCoins, replaceCachedCoins } from "../services/sqlite/coinsCache";
import { Coin } from "../models/Coin";

export function useHomeViewModel() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  const loadCoins = useCallback(async () => {
    setLoading(true);
    setError(null);
    setOffline(false);
    try {
      const data = await fetchCoins();
      setCoins(data);
      await replaceCachedCoins(data);
    } catch (err) {
      // Backend/network unavailable — fall back to the last synced SQLite cache.
      const cached = await getCachedCoins();
      if (cached.length > 0) {
        setOffline(true);
        setCoins(cached);
      } else {
        setError("Couldn't load coins. Pull to retry.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { coins, loading, error, offline, loadCoins };
}
