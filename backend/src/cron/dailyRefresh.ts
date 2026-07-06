import cron from "node-cron";
import { env } from "../config/env";
import { refreshCacheAndAlerts } from "../services/cacheRefreshService";

export function scheduleDailyRefresh(): void {
  cron.schedule(env.cronSchedule, async () => {
    try {
      await refreshCacheAndAlerts();
      console.log(`[cron] cache + alerts refreshed at ${new Date().toISOString()}`);
    } catch (err) {
      console.error("[cron] refresh failed", err);
    }
  });
}
