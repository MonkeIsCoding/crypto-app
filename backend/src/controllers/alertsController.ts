import { Request, Response } from "express";
import * as alertsService from "../services/alertsService";
import { AlertType } from "../types";

function isValidAlertType(type: unknown): type is AlertType {
  return type === "above" || type === "below";
}

export async function createAlert(req: Request, res: Response): Promise<void> {
  const { userId, coinId, type, targetPrice } = req.body as {
    userId?: string;
    coinId?: string;
    type?: unknown;
    targetPrice?: unknown;
  };

  if (!userId || !coinId || !isValidAlertType(type) || typeof targetPrice !== "number") {
    res.status(400).json({ error: "userId, coinId, type ('above'|'below') and numeric targetPrice are required" });
    return;
  }

  const alert = await alertsService.createAlert(userId, coinId, type, targetPrice);
  res.status(201).json(alert);
}

export async function removeAlert(req: Request, res: Response): Promise<void> {
  await alertsService.removeAlert(String(req.params.id));
  res.status(204).send();
}

export async function getUserAlerts(req: Request, res: Response): Promise<void> {
  const alerts = await alertsService.getUserAlerts(String(req.params.userId));
  res.json(alerts);
}

export async function checkAlerts(_req: Request, res: Response): Promise<void> {
  const result = await alertsService.evaluateAlerts();
  res.json(result);
}
