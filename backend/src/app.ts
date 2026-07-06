import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import coinsRoutes from "./routes/coinsRoutes";
import watchlistRoutes from "./routes/watchlistRoutes";
import alertsRoutes from "./routes/alertsRoutes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/coins", coinsRoutes);
  app.use("/watchlist", watchlistRoutes);
  app.use("/alerts", alertsRoutes);

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
