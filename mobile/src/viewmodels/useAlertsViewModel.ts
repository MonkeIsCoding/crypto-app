import { useAlerts } from "../context/AlertsContext";

export function useAlertsViewModel() {
  const { alerts, loading, refreshing, error, offline, refresh, removeAlert } = useAlerts();

  return { alerts, loading, refreshing, error, offline, refresh, removeAlert };
}
