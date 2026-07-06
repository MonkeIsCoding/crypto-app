import * as alertsRepository from "../repositories/alertsRepository";
import * as coinsRepository from "../repositories/coinsRepository";
import { Alert, AlertType } from "../types";

export async function createAlert(userId: string, coinId: string, type: AlertType, targetPrice: number) {
  const alert = await alertsRepository.createAlert(userId, coinId, type, targetPrice);

  // The threshold may already be met by the current cached price (no need
  // to wait for the next cron sweep) — check it against cache right away.
  const coin = await coinsRepository.getCoinById(coinId);
  if (coin && isTriggered(alert, coin.price)) {
    await alertsRepository.markTriggered(alert.id);
    return { ...alert, triggered: true };
  }

  return alert;
}

export async function removeAlert(alertId: string): Promise<void> {
  return alertsRepository.removeAlert(alertId);
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
  return alertsRepository.getAlertsByUser(userId);
}

function isTriggered(alert: Alert, currentPrice: number): boolean {
  return alert.type === "above" ? currentPrice >= alert.target_price : currentPrice <= alert.target_price;
}

/**
 * Cron-triggered: compares cached prices against all untriggered alert thresholds
 * and flips `triggered` for any that now match.
 */
export async function evaluateAlerts(): Promise<{ checked: number; triggered: number }> {
  const alerts = await alertsRepository.getUntriggeredAlerts();
  const coinsById = await coinsRepository.getCoinsByIds(alerts.map((a) => a.coin_id));

  let triggeredCount = 0;
  for (const alert of alerts) {
    const coin = coinsById.get(alert.coin_id);
    if (!coin) continue;

    if (isTriggered(alert, coin.price)) {
      await alertsRepository.markTriggered(alert.id);
      triggeredCount += 1;
    }
  }

  return { checked: alerts.length, triggered: triggeredCount };
}
