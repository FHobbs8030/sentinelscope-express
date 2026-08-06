import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";
import corsMiddleware from "./config/cors.js";
import errorHandler from "./middleware/errorHandler.js";

import scansRouter from "./routes/scans.routes.js";
import missionsRouter from "./routes/missions.routes.js";
import telemetryRouter from "./routes/telemetry.routes.js";
import alertsRouter from "./routes/alerts.routes.js";
import findingsRouter from "./routes/findings.routes.js";

const app = express();

app.use(helmet());

app.use(corsMiddleware);

app.use(express.json());

app.use(morgan(env.isProduction ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.set("Cache-Control", "no-store");

  res.status(200).json({
    status: "online",
    service: "SentinelScope Backend",
  });
});

app.use("/api/scans", scansRouter);

app.use("/api/missions", missionsRouter);

app.use("/api/telemetry", telemetryRouter);

app.use("/api/alerts", alertsRouter);

app.use("/api/findings", findingsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

export default app;
