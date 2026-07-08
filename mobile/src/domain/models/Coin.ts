export interface PriceHistoryPoint {
  timestamp: string;
  price: number;
}

export interface Coin {
  coin_id: string;
  name: string;
  symbol: string;
  price: number;
  price_change_24h: number;
  market_cap: number;
  last_updated: string;
  price_history: PriceHistoryPoint[];
}
