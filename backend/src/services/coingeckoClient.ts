import axios from "axios";
import { env } from "../config/env";
import { CoinCache, PriceHistoryPoint } from "../types";

interface CoinGeckoMarketEntry {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
}

interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
}

export async function fetchCoinMarkets(coinIds: string[]): Promise<Omit<CoinCache, "price_history">[]> {
  const { data } = await axios.get<CoinGeckoMarketEntry[]>(`${env.coingecko.apiBase}/coins/markets`, {
    params: {
      vs_currency: "usd",
      ids: coinIds.join(","),
    },
  });

  const now = new Date().toISOString();
  return data.map((entry) => ({
    coin_id: entry.id,
    name: entry.name,
    symbol: entry.symbol,
    price: entry.current_price,
    price_change_24h: entry.price_change_percentage_24h ?? 0,
    market_cap: entry.market_cap,
    last_updated: now,
  }));
}

export async function fetchCoinMarketChart(coinId: string, days = 7): Promise<PriceHistoryPoint[]> {
  const { data } = await axios.get<CoinGeckoMarketChartResponse>(
    `${env.coingecko.apiBase}/coins/${coinId}/market_chart`,
    { params: { vs_currency: "usd", days } }
  );

  return data.prices.map(([timestamp, price]) => ({
    timestamp: new Date(timestamp).toISOString(),
    price,
  }));
}
