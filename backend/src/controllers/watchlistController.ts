import { Request, Response } from "express";
import * as watchlistService from "../services/watchlistService";

export async function addToWatchlist(req: Request, res: Response): Promise<void> {
  const { coinId } = req.body as { coinId?: string };
  if (!coinId) {
    res.status(400).json({ error: "coinId is required" });
    return;
  }
  const entry = await watchlistService.addCoin(req.uid!, coinId);
  res.status(201).json(entry);
}

export async function removeFromWatchlist(req: Request, res: Response): Promise<void> {
  const removed = await watchlistService.removeCoinIfOwner(String(req.params.id), req.uid!);
  if (!removed) {
    res.status(404).json({ error: "Watchlist entry not found" });
    return;
  }
  res.status(204).send();
}

export async function getWatchlist(req: Request, res: Response): Promise<void> {
  const items = await watchlistService.getUserWatchlist(req.uid!);
  res.json(items);
}
