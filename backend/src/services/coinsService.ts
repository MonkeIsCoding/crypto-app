import * as coinsRepository from "../repositories/coinsRepository";
import { CoinCache } from "../types";

export async function listCoins(): Promise<CoinCache[]> {
  return coinsRepository.getAllCoins();
}

export async function getCoin(coinId: string): Promise<CoinCache | null> {
  return coinsRepository.getCoinById(coinId);
}
