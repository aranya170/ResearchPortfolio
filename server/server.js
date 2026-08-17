const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { initDatabase } = require("./db/initDb");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static files for uploads & public assets
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

// API router
app.use("/api", apiRoutes);

// Root healthcheck
app.get("/", (req, res) => {
  res.json({
    name: "Aranya Kishor Das Portfolio Backend",
    status: "online",
    documentation: "/api/health",
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 Portfolio Backend Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🛠️  Healthcheck:  http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);

  // Initialize DB tables and seed data if reachable
  try {
    await initDatabase(false);
  } catch (err) {
    console.error("Auto DB initialization notice:", err.message);
  }
});
