import cors from "cors";

import env from "./env.js";

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error(`CORS blocked request from origin: ${origin}`);
    error.statusCode = 403;

    callback(error);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
