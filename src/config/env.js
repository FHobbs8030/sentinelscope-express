import dotenv from "dotenv";

dotenv.config();

const SUPPORTED_NODE_ENVIRONMENTS = new Set([
  "development",
  "test",
  "production",
]);

const SUPPORTED_PROTOCOLS = new Set(["http:", "https:"]);

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

const nodeEnv = process.env.NODE_ENV?.trim() || "development";

if (!SUPPORTED_NODE_ENVIRONMENTS.has(nodeEnv)) {
  throw new Error(
    `NODE_ENV must be development, test, or production. Received: ${nodeEnv}`,
  );
}

const isProduction = nodeEnv === "production";

const getEnvironmentValue = (
  name,
  { developmentDefault, requiredInProduction = false } = {},
) => {
  const value = process.env[name]?.trim();

  if (value) {
    return value;
  }

  if (isProduction && requiredInProduction) {
    throw new Error(
      `Missing required production environment variable: ${name}`,
    );
  }

  return developmentDefault;
};

const parsePort = (value) => {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `PORT must be a valid number between 1 and 65535. Received: ${value}`,
    );
  }

  return port;
};

const validateClientUrl = (value) => {
  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error("CLIENT_URL must be a valid absolute URL.");
  }

  if (!SUPPORTED_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error("CLIENT_URL must use the HTTP or HTTPS protocol.");
  }

  const isLocalClient = LOCAL_HOSTNAMES.has(parsedUrl.hostname);

  if (isProduction && parsedUrl.protocol !== "https:" && !isLocalClient) {
    throw new Error("Production CLIENT_URL must use HTTPS.");
  }

  return parsedUrl.origin;
};

const env = Object.freeze({
  port: parsePort(
    getEnvironmentValue("PORT", {
      developmentDefault: "3001",
    }),
  ),

  nodeEnv,

  isProduction,

  mongoUri: getEnvironmentValue("MONGO_URI", {
    developmentDefault: "mongodb://127.0.0.1:27017/sentinelscope",
    requiredInProduction: true,
  }),

  clientUrl: validateClientUrl(
    getEnvironmentValue("CLIENT_URL", {
      developmentDefault: "http://localhost:5173",
      requiredInProduction: true,
    }),
  ),

  // Reserved for the authentication phase.
  // There is intentionally no insecure default.
  jwtSecret: process.env.JWT_SECRET?.trim() || null,
});

export default env;
