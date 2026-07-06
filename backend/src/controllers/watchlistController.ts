import { Request, Response } from "express";
import * as watchlistService from "../services/watchlistService";

export async function addToWatchlist(req: Request, res: Response): Promise<void> {
  const { userId, coinId } = req.body as { userId?: string; coinId?: string };
  if (!userId || !coinId) {
    res.status(400).json({ error: "userId and coinId are required" });
    return;
  }
  const entry = await watchlistService.addCoin(userId, coinId);
  res.status(201).json(entry);
}

export async function removeFromWatchlist(req: Request, res: Response): Promise<void> {
  await watchlistService.removeCoin(String(req.params.id));
  res.status(204).send();
}

export async function getWatchlist(req: Request, res: Response): Promise<void> {
  const items = await watchlistService.getUserWatchlist(String(req.params.userId));
  res.json(items);
}
