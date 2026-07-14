import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";
import { fetchAlerts, removeAlert as apiRemoveAlert } from "../services/api/alertsApi";
import {
  presentAlertTriggeredNotification,
  requestNotificationPermissions,
} from "../services/notifications/notificationService";
import { Alert } from "../models/Alert";
import { useAuth } from "./AuthContext";

const POLL_INTERVAL_MS = 60_000;

interface AlertsContextValue {
  alerts: Alert[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: (opts?: { silent?: boolean }) => Promise<void>;
  removeAlert: (alertId: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggeredIdsRef = useRef<Set<string> | null>(null);

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!user) return;
      const silent = opts?.silent ?? false;
      if (!silent) setRefreshing(true);
      setError(null);
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
        for (const alert of newlyTriggered) {
          presentAlertTriggeredNotification(alert).catch(() => {});
        }
      } catch (err) {
        setError("Couldn't load alerts.");
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

  const removeAlert = useCallback(async (alertId: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== alertId));
    triggeredIdsRef.current?.delete(alertId);
    await apiRemoveAlert(alertId);
  }, []);

  const value = useMemo(
    () => ({ alerts, loading, refreshing, error, refresh, removeAlert }),
    [alerts, loading, refreshing, error, refresh, removeAlert]
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
