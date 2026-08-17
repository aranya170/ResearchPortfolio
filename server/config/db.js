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

const config = connectionString
  ? {
      connectionString,
      ssl: isNeonOrSsl ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "portfolio",
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
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
    const seedData = require("../db/seedData");
    fs.writeFileSync(fallbackDataPath, JSON.stringify(seedData, null, 2), "utf8");
    return JSON.parse(JSON.stringify(seedData));
  }
  try {
    return JSON.parse(fs.readFileSync(fallbackDataPath, "utf8"));
  } catch (e) {
    const seedData = require("../db/seedData");
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
      host: config.host || (connectionString ? "Neon / Remote (DATABASE_URL)" : "localhost"),
      database: config.database || "portfolio",
      user: config.user || "postgres",
      ssl: Boolean(config.ssl),
    },
  }),
  getFallbackStore,
  saveFallbackStore,
};
