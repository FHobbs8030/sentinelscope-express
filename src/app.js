import express from "express";
import telemetryRouter from "./routes/telemetry.routes.js";
import helmet from "helmet";
import morgan from "morgan";

import corsMiddleware from "./config/cors.js";
import scansRouter from "./routes/scans.routes.js";

const app = express();

app.use("/api/telemetry", telemetryRouter);

app.use(helmet());

app.use(corsMiddleware);

app.use(express.json());

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "sentinelscope-express",
    environment: "development",
  });
});

app.use("/api/scans", scansRouter);

export default app;
