import { apiClient } from "./client";
import { Alert, AlertType, AlertWithCoin } from "../../models/Alert";

export async function fetchAlerts(): Promise<AlertWithCoin[]> {
  const { data } = await apiClient.get<AlertWithCoin[]>("/alerts");
  return data;
}

export async function createAlert(coinId: string, type: AlertType, targetPrice: number): Promise<Alert> {
  const { data } = await apiClient.post<Alert>("/alerts", { coinId, type, targetPrice });
  return data;
}

export async function removeAlert(alertId: string): Promise<void> {
  await apiClient.delete(`/alerts/${alertId}`);
}
