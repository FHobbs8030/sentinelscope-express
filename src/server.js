import app from "./app.js";

import env from "./config/env.js";
import connectDB, { disconnectDB } from "./config/db.js";

let server = null;
let isShuttingDown = false;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(`
=================================
 SentinelScope Backend Online
=================================
 Environment : ${env.nodeEnv}
 Port        : ${env.port}
=================================
      `);
    });
  } catch (error) {
    console.error(`SentinelScope failed to start: ${error.message}`);

    process.exit(1);
  }
};

const shutdownServer = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down SentinelScope...`);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out. Forcing process exit.");

    process.exit(1);
  }, 10000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }

    await disconnectDB();

    clearTimeout(forceShutdownTimer);

    console.log("SentinelScope shutdown completed.");

    process.exit(0);
  } catch (error) {
    console.error(`SentinelScope shutdown failed: ${error.message}`);

    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  void shutdownServer("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdownServer("SIGINT");
});

void startServer();
