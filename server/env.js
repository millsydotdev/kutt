require("dotenv").config();
const { cleanEnv, num, str, bool } = require("envalid");
const { readFileSync } = require("node:fs");
const { URL } = require("url");

const supportedDBClients = [
  "pg",
  "pg-native",
  "sqlite3",
  "better-sqlite3",
  "mysql",
  "mysql2"
];

// make sure custom alphabet is not empty
if (process.env.LINK_CUSTOM_ALPHABET === "") {
  delete process.env.LINK_CUSTOM_ALPHABET;
}

// make sure jwt secret is not empty
if (process.env.JWT_SECRET === "") {
  delete process.env.JWT_SECRET;
}

// if is started with the --production argument, then set NODE_ENV to production
if (process.argv.includes("--production")) {
  process.env.NODE_ENV = "production";
}

// Parse DATABASE_URL if provided (Railway, Heroku, etc.)
if (process.env.DATABASE_URL && !process.env.DB_HOST) {
  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    process.env.DB_CLIENT = process.env.DB_CLIENT || (dbUrl.protocol === "postgres:" || dbUrl.protocol === "postgresql:" ? "pg" : "mysql2");
    process.env.DB_HOST = dbUrl.hostname;
    process.env.DB_PORT = dbUrl.port || "5432";
    process.env.DB_NAME = dbUrl.pathname.slice(1); // Remove leading slash
    process.env.DB_USER = dbUrl.username;
    process.env.DB_PASSWORD = dbUrl.password;
    // Railway/Heroku Postgres requires SSL
    if (process.env.DB_SSL === undefined) {
      process.env.DB_SSL = "true";
    }
  } catch (error) {
    console.error("Failed to parse DATABASE_URL:", error.message);
  }
}

// Parse REDIS_URL if provided (Railway, Heroku, etc.)
if (process.env.REDIS_URL && !process.env.REDIS_HOST) {
  try {
    const redisUrl = new URL(process.env.REDIS_URL);
    process.env.REDIS_ENABLED = "true";
    process.env.REDIS_HOST = redisUrl.hostname;
    process.env.REDIS_PORT = redisUrl.port || "6379";
    process.env.REDIS_PASSWORD = redisUrl.password || "";
  } catch (error) {
    console.error("Failed to parse REDIS_URL:", error.message);
  }
}

const spec = {
  PORT: num({ default: 3000 }),
  SITE_NAME: str({ example: "Kutt", default: "Kutt" }),
  DEFAULT_DOMAIN: str({ example: "kutt.it", default: "localhost:3000" }),
  LINK_LENGTH: num({ default: 6 }),
  LINK_CUSTOM_ALPHABET: str({ default: "abcdefghkmnpqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ23456789" }),
  TRUST_PROXY: bool({ default: true }),
  DB_CLIENT: str({ choices: supportedDBClients, default: "better-sqlite3" }),
  DB_FILENAME: str({ default: "db/data" }),
  DB_HOST: str({ default: "localhost" }),
  DB_PORT: num({ default: 5432 }),
  DB_NAME: str({ default: "kutt" }),
  DB_USER: str({ default: "postgres" }),
  DB_PASSWORD: str({ default: "" }),
  DB_SSL: bool({ default: false }),
  DB_POOL_MIN: num({ default: 0 }),
  DB_POOL_MAX: num({ default: 10 }),
  REDIS_ENABLED: bool({ default: false }),
  REDIS_HOST: str({ default: "127.0.0.1" }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
  REDIS_DB: num({ default: 0 }),
  DISALLOW_ANONYMOUS_LINKS: bool({ default: true }),
  DISALLOW_REGISTRATION: bool({ default: true }),
  SERVER_IP_ADDRESS: str({ default: "" }),
  SERVER_CNAME_ADDRESS: str({ default: "" }),
  CUSTOM_DOMAIN_USE_HTTPS: bool({ default: false }),
  JWT_SECRET: str({ devDefault: "securekey" }),
  MAIL_ENABLED: bool({ default: false }),
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: num({ default: 25 }),
  MAIL_HOST: str({ default: "" }),
  MAIL_PORT: num({ default: 587 }),
  MAIL_SECURE: bool({ default: false }),
  MAIL_USER: str({ default: "" }),
  MAIL_FROM: str({ default: "", example: "Kutt <support@kutt.it>" }),
  MAIL_PASSWORD: str({ default: "" }),
  ENABLE_RATE_LIMIT: bool({ default: false }),
  REPORT_EMAIL: str({ default: "" }),
  CONTACT_EMAIL: str({ default: "" }),
  NODE_APP_INSTANCE: num({ default: 0 }),
};

for (const key in spec) {
  const file_key = key + "_FILE";
  if (!(file_key in process.env)) continue;
  try {
    process.env[key] = readFileSync(process.env[file_key], "utf8").trim();
  } catch {
    // on error, env_FILE just doesn't get applied.
  }
}

const env = cleanEnv(process.env, spec);

module.exports = env;
