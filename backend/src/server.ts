import { createApp } from "./app";
import { env } from "./config/env";
import { scheduleDailyRefresh } from "./cron/dailyRefresh";

const app = createApp();

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
  scheduleDailyRefresh();
});
