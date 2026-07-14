import { apiClient } from "./client";
import { Coin } from "../../models/Coin";

export async function fetchCoins(): Promise<Coin[]> {
  const { data } = await apiClient.get<Coin[]>("/coins");
  return data;
}

export async function fetchCoin(coinId: string): Promise<Coin> {
  const { data } = await apiClient.get<Coin>(`/coins/${coinId}`);
  return data;
}
