import cors from "cors";
import env from "./env.js";

const corsOptions = {
  origin: env.clientUrl,

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
