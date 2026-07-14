import { apiClient } from "./client";
import { Alert, AlertType } from "../../domain/models/Alert";

export async function fetchAlerts(): Promise<Alert[]> {
  const { data } = await apiClient.get<Alert[]>("/alerts");
  return data;
}

export async function createAlert(coinId: string, type: AlertType, targetPrice: number): Promise<Alert> {
  const { data } = await apiClient.post<Alert>("/alerts", { coinId, type, targetPrice });
  return data;
}

export async function removeAlert(alertId: string): Promise<void> {
  await apiClient.delete(`/alerts/${alertId}`);
}
