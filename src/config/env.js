import dotenv from "dotenv";

dotenv.config();

const allowedNodeEnvironments = new Set(["development", "test", "production"]);

const nodeEnv = process.env.NODE_ENV?.trim() || "development";

if (!allowedNodeEnvironments.has(nodeEnv)) {
  throw new Error("NODE_ENV must be development, test, or production");
}

const isProduction = nodeEnv === "production";

const getRequiredEnv = (name, developmentFallback) => {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (!isProduction && developmentFallback) {
    return developmentFallback;
  }

  throw new Error(`Missing required environment variable: ${name}`);
};

const port = Number.parseInt(process.env.PORT?.trim() || "3001", 10);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const clientUrls = getRequiredEnv("CLIENT_URL", "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

if (clientUrls.length === 0) {
  throw new Error("CLIENT_URL must contain at least one frontend URL");
}

clientUrls.forEach((clientUrl) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(clientUrl);
  } catch {
    throw new Error(`CLIENT_URL contains an invalid URL: ${clientUrl}`);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`CLIENT_URL must use HTTP or HTTPS: ${clientUrl}`);
  }
});

const jwtSecret = getRequiredEnv(
  "JWT_SECRET",
  "development_only_change_this_secret",
);

if (isProduction && jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters in production");
}

const env = {
  port,

  nodeEnv,

  isProduction,

  mongoUri: getRequiredEnv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017/sentinelscope",
  ),

  clientUrl: clientUrls[0],

  clientUrls,

  jwtSecret,
};

export default env;
