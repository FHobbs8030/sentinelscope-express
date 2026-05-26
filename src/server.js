import app from "./app.js";
import env from "./config/env.js";

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
