import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { fetchAlerts, removeAlert as apiRemoveAlert } from "../services/api/alertsApi";
import {
  presentAlertTriggeredNotification,
  requestNotificationPermissions,
} from "../services/notifications/notificationService";
import { getAlertNotificationsEnabled } from "../services/preferences/notificationPreference";
import { getCachedAlerts, replaceCachedAlerts } from "../services/sqlite/alertsCache";
import { getCachedCoins } from "../services/sqlite/coinsCache";
import { AlertWithCoin } from "../models/Alert";
import { useAuth } from "./AuthContext";

const POLL_INTERVAL_MS = 60_000;

interface AlertsContextValue {
  alerts: AlertWithCoin[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  offline: boolean;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
  removeAlert: (alertId: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertWithCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const triggeredIdsRef = useRef<Set<string> | null>(null);

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!user) return;
      const silent = opts?.silent ?? false;
      if (!silent) setRefreshing(true);
      setError(null);
      setOffline(false);
      try {
        const data = await fetchAlerts();
        const currentlyTriggered = data.filter((a) => a.triggered).map((a) => a.id);
        // First fetch of a session just seeds the seen-set — nothing has "newly"
        // triggered yet, so it shouldn't notify about alerts already flipped
        // before the app opened.
        const newlyTriggered =
          triggeredIdsRef.current === null
            ? []
            : data.filter((alert) => alert.triggered && !triggeredIdsRef.current!.has(alert.id));
        triggeredIdsRef.current = new Set(currentlyTriggered);
        setAlerts(data);
        await replaceCachedAlerts(
          user.uid,
          data.map((alert) => ({
            id: alert.id,
            user_id: alert.user_id,
            coin_id: alert.coin_id,
            type: alert.type,
            target_price: alert.target_price,
            triggered: alert.triggered,
            created_at: alert.created_at,
          }))
        );
        if (newlyTriggered.length > 0 && (await getAlertNotificationsEnabled())) {
          for (const alert of newlyTriggered) {
            presentAlertTriggeredNotification(alert).catch(() => {});
          }
        }
      } catch (err) {
        const cached = await getCachedAlerts(user.uid);
        if (cached.length > 0) {
          const cachedCoins = await getCachedCoins();
          const coinsById = new Map(cachedCoins.map((coin) => [coin.coin_id, coin]));
          setOffline(true);
          setAlerts(cached.map((alert) => ({ ...alert, coin: coinsById.get(alert.coin_id) ?? null })));
        } else {
          setError("Couldn't load alerts.");
        }
      } finally {
        if (!silent) setRefreshing(false);
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      triggeredIdsRef.current = null;
      setLoading(false);
      return;
    }

    requestNotificationPermissions().catch(() => {});
    setLoading(true);
    refresh();

    const interval = setInterval(() => refresh({ silent: true }), POLL_INTERVAL_MS);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh({ silent: true });
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
    // refresh() is stable per-user via useCallback; re-running on user change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const removeAlert = useCallback(
    async (alertId: string) => {
      setAlerts((current) => current.filter((alert) => alert.id !== alertId));
      triggeredIdsRef.current?.delete(alertId);
      try {
        await apiRemoveAlert(alertId);
      } catch (err) {
        // Roll back on failure and let the user retry.
        await refresh({ silent: true });
      }
    },
    [refresh]
  );

  const value = useMemo(
    () => ({ alerts, loading, refreshing, error, offline, refresh, removeAlert }),
    [alerts, loading, refreshing, error, offline, refresh, removeAlert]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return ctx;
}
