import { Request, Response } from "express";
import * as alertsService from "../services/alertsService";
import { AlertType } from "../types";

function isValidAlertType(type: unknown): type is AlertType {
  return type === "above" || type === "below";
}

export async function createAlert(req: Request, res: Response): Promise<void> {
  const { coinId, type, targetPrice } = req.body as {
    coinId?: string;
    type?: unknown;
    targetPrice?: unknown;
  };

  if (!coinId || !isValidAlertType(type) || typeof targetPrice !== "number") {
    res.status(400).json({ error: "coinId, type ('above'|'below') and numeric targetPrice are required" });
    return;
  }

  const alert = await alertsService.createAlert(req.uid!, coinId, type, targetPrice);
  res.status(201).json(alert);
}

export async function removeAlert(req: Request, res: Response): Promise<void> {
  const removed = await alertsService.removeAlertIfOwner(String(req.params.id), req.uid!);
  if (!removed) {
    res.status(404).json({ error: "Alert not found" });
    return;
  }
  res.status(204).send();
}

export async function getUserAlerts(req: Request, res: Response): Promise<void> {
  const alerts = await alertsService.getUserAlerts(req.uid!);
  res.json(alerts);
}

export async function checkAlerts(_req: Request, res: Response): Promise<void> {
  const result = await alertsService.evaluateAlerts();
  res.json(result);
}
