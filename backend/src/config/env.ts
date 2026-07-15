import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 3000),
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
    privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
  },
  coingecko: {
    apiBase: process.env.COINGECKO_API_BASE ?? "https://api.coingecko.com/api/v3",
  },
  trackedCoinIds: (process.env.TRACKED_COIN_IDS ?? "bitcoin,ethereum")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  cronSchedule: process.env.CRON_SCHEDULE ?? "0 3 * * *",
};
