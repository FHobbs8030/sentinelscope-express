import mongoose from "mongoose";

import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";

let server;
let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`
=================================
 SentinelScope Shutting Down
=================================
 Signal      : ${signal}
=================================
  `);

  const forceShutdownTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await mongoose.connection.close();

    clearTimeout(forceShutdownTimer);

    console.log(`
=================================
 SentinelScope Shutdown Complete
=================================
    `);

    process.exit(0);
  } catch (error) {
    clearTimeout(forceShutdownTimer);

    console.error("Graceful shutdown failed:", error.message);

    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`
=================================
 SentinelScope Backend Online
=================================
 Environment : ${env.nodeEnv}
 Port        : ${env.port}
=================================
    `);
  });

  server.on("error", (error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
};

void startServer();
