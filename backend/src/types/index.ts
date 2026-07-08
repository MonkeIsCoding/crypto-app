export interface PriceHistoryPoint {
  timestamp: string;
  price: number;
}

export interface CoinCache {
  coin_id: string;
  name: string;
  symbol: string;
  price: number;
  price_change_24h: number;
  market_cap: number;
  last_updated: string;
  price_history: PriceHistoryPoint[];
}

export interface WatchlistEntry {
  id: string;
  user_id: string;
  coin_id: string;
  added_at: string;
}

export interface WatchlistItemWithPrice extends WatchlistEntry {
  coin: CoinCache | null;
}

export type AlertType = "above" | "below";

export interface Alert {
  id: string;
  user_id: string;
  coin_id: string;
  type: AlertType;
  target_price: number;
  triggered: boolean;
  created_at: string;
}
