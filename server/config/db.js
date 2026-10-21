const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

let pool = null;
let isConnected = false;
let connectionError = null;

// Determine connection config
const connectionString = process.env.DATABASE_URL;
const isNeonOrSsl =
  connectionString &&
  (connectionString.includes("neon.tech") ||
    connectionString.includes("sslmode=require") ||
    process.env.DB_SSL === "true");

// Verify server certificates by default; DB_SSL_INSECURE=true opts out (e.g. self-signed dev servers)
const sslOptions = { rejectUnauthorized: process.env.DB_SSL_INSECURE !== "true" };

// pg lets sslmode in the URL override the ssl option, so drop it when we set ssl explicitly
function withoutSslMode(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("sslmode");
    return parsed.toString();
  } catch (e) {
    return url;
  }
}

const config = connectionString
  ? {
      connectionString: isNeonOrSsl ? withoutSslMode(connectionString) : connectionString,
      ssl: isNeonOrSsl ? sslOptions : false,
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "portfolio",
      ssl: process.env.DB_SSL === "true" ? sslOptions : false,
    };

try {
  pool = new Pool(config);

  pool.on("error", (err) => {
    console.error("[PostgreSQL Pool Error]:", err.message);
    isConnected = false;
    connectionError = err.message;
  });
} catch (err) {
  console.error("[PostgreSQL Init Error]:", err.message);
  connectionError = err.message;
}

// Fallback in-memory / JSON store in case Postgres is offline during first launch
const fallbackDataPath = path.join(__dirname, "../db/fallback_store.json");

function getFallbackStore() {
  if (!fs.existsSync(fallbackDataPath)) {
    // Never persist seed admin credentials to disk.
    const { admin, ...seedData } = require("../db/seedData");
    fs.writeFileSync(fallbackDataPath, JSON.stringify(seedData, null, 2), "utf8");
    return JSON.parse(JSON.stringify(seedData));
  }
  try {
    return JSON.parse(fs.readFileSync(fallbackDataPath, "utf8"));
  } catch (e) {
    const { admin, ...seedData } = require("../db/seedData");
    return JSON.parse(JSON.stringify(seedData));
  }
}

function saveFallbackStore(data) {
  try {
    fs.writeFileSync(fallbackDataPath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("Failed to save fallback store:", e.message);
  }
}

// Non-secret parts of DATABASE_URL for the admin status panel (never the password)
function urlPart(part) {
  if (!connectionString) return "";
  try {
    return decodeURIComponent(new URL(connectionString)[part] || "");
  } catch (e) {
    return "";
  }
}

async function testConnection() {
  if (!pool) return false;
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    client.release();
    isConnected = true;
    connectionError = null;
    return true;
  } catch (err) {
    isConnected = false;
    connectionError = err.message;
    return false;
  }
}

module.exports = {
  pool,
  query: async (text, params) => {
    if (pool) {
      return pool.query(text, params);
    }
    throw new Error("Database pool is not initialized");
  },
  testConnection,
  getConnectionStatus: () => ({
    connected: isConnected,
    error: connectionError,
    config: {
      host: config.host || urlPart("hostname") || "localhost",
      database: config.database || urlPart("pathname").replace(/^\//, "") || "portfolio",
      user: config.user || urlPart("username") || "postgres",
      ssl: Boolean(config.ssl),
    },
  }),
  getFallbackStore,
  saveFallbackStore,
};
