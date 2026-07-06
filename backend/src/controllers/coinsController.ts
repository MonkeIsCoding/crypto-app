import { Request, Response } from "express";
import * as coinsService from "../services/coinsService";

export async function listCoins(_req: Request, res: Response): Promise<void> {
  const coins = await coinsService.listCoins();
  res.json(coins);
}

export async function getCoin(req: Request, res: Response): Promise<void> {
  const coin = await coinsService.getCoin(String(req.params.id));
  if (!coin) {
    res.status(404).json({ error: "Coin not found" });
    return;
  }
  res.json(coin);
}
