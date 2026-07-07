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
