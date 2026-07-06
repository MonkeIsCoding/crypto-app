import { env } from "../config/env";
import { fetchCoinMarkets } from "./coingeckoClient";
import * as coinsRepository from "../repositories/coinsRepository";
import { evaluateAlerts } from "./alertsService";

/**
 * Daily job: pull CoinGecko data, cache in Firestore, then re-evaluate alerts
 * against the freshly cached prices. Runs on a schedule to avoid burning
 * CoinGecko's free-tier rate limit on every client request.
 */
export async function refreshCacheAndAlerts(): Promise<void> {
  const coins = await fetchCoinMarkets(env.trackedCoinIds);
  await coinsRepository.upsertCoins(coins);
  await evaluateAlerts();
}
