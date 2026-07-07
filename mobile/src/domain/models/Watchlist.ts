import { Coin } from "./Coin";

export interface WatchlistItem {
  id: string;
  user_id: string;
  coin_id: string;
  added_at: string;
  coin: Coin | null;
}
