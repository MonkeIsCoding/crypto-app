import { apiClient } from "./client";
import { Alert, AlertType } from "../../domain/models/Alert";

export async function fetchAlerts(userId: string): Promise<Alert[]> {
  const { data } = await apiClient.get<Alert[]>(`/alerts/${userId}`);
  return data;
}

export async function createAlert(
  userId: string,
  coinId: string,
  type: AlertType,
  targetPrice: number
): Promise<Alert> {
  const { data } = await apiClient.post<Alert>("/alerts", { userId, coinId, type, targetPrice });
  return data;
}

export async function removeAlert(alertId: string): Promise<void> {
  await apiClient.delete(`/alerts/${alertId}`);
}
