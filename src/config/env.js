import dotenv from "dotenv";

dotenv.config();

const env = {
  port: process.env.PORT || 3001,

  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sentinelscope",

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  jwtSecret: process.env.JWT_SECRET || "change_this_to_a_secure_secret",
};

export default env;
