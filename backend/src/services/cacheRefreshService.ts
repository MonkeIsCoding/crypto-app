import { env } from "../config/env";
import { fetchCoinMarkets, fetchCoinMarketChart } from "./coingeckoClient";
import * as coinsRepository from "../repositories/coinsRepository";
import { evaluateAlerts } from "./alertsService";
import { CoinCache } from "../types";

/**
 * Daily job: pull CoinGecko data (including 7-day price history for the
 * chart), cache in Firestore, then re-evaluate alerts against the freshly
 * cached prices. Runs on a schedule to avoid burning CoinGecko's free-tier
 * rate limit on every client request.
 */
export async function refreshCacheAndAlerts(): Promise<void> {
  const markets = await fetchCoinMarkets(env.trackedCoinIds);
  const coins: CoinCache[] = await Promise.all(
    markets.map(async (coin) => ({
      ...coin,
      price_history: await fetchCoinMarketChart(coin.coin_id, 7),
    }))
  );
  await coinsRepository.upsertCoins(coins);
  await evaluateAlerts();
}
