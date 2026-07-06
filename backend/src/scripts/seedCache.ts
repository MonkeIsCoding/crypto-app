import { refreshCacheAndAlerts } from "../services/cacheRefreshService";

refreshCacheAndAlerts()
  .then(() => {
    console.log("Cache refreshed.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Cache refresh failed:", err);
    process.exit(1);
  });
