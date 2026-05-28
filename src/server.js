import app from "./app.js";

import env from "./config/env.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`
=================================
 SentinelScope Backend Online
=================================
 Environment : ${env.nodeEnv}
 Port        : ${env.port}
=================================
    `);
  });
};

startServer();
