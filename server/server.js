const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { initDatabase } = require("./db/initDb");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

// Render sits behind a proxy; trust it so rate limiting sees the real client IP
app.set("trust proxy", 1);

// CORS: only the deployed frontend (plus localhost outside production) may call the API.
// Extra origins can be added via FRONTEND_URL as a comma-separated list.
const allowedOrigins = [
  "https://aranyaportfolio.web.app",
  "https://aranyaportfolio.firebaseapp.com",
  "https://aranyakishordas.vercel.app",
  ...(process.env.FRONTEND_URL || "").split(",").map((o) => o.trim()),
].filter(Boolean);
const devOrigin = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header means a same-origin or non-browser request; CORS doesn't apply
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== "production" && devOrigin.test(origin)) return callback(null, true);
      return callback(null, false);
    },
  })
);

// Rate limiting
const jsonLimitMessage = (message) => ({ success: false, message });
app.use(
  "/api",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false })
);
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: jsonLimitMessage("Too many login attempts. Try again in 15 minutes."),
  })
);
app.use(
  "/api/contact",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: jsonLimitMessage("Too many messages sent. Please try again later."),
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Static files for uploads & public assets with cross-origin headers
const staticOptions = {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
};

// User-uploaded files are served inert: no MIME sniffing, no script execution
const uploadsStaticOptions = {
  setHeaders: (res) => {
    staticOptions.setHeaders(res);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; sandbox"
    );
  },
};

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads"), uploadsStaticOptions));
app.use("/assets", express.static(path.join(__dirname, "../public/assets"), staticOptions));

// API router
app.use("/api", apiRoutes);

// Serve React frontend production build if index.html exists
const buildPath = path.join(__dirname, "../build");
const indexPath = path.join(buildPath, "index.html");
const fs = require("fs");

if (fs.existsSync(indexPath)) {
  app.use(express.static(buildPath));
  app.get("*", (req, res, next) => {
    if (/^\/(api|uploads|assets)(\/|$)/.test(req.path)) return next();
    res.sendFile(indexPath);
  });
} else {
  // Root healthcheck fallback when production build is not present (e.g. running React dev server on :3000)
  app.get("/", (req, res) => {
    res.json({
      name: "Aranya Kishor Das Portfolio Backend",
      status: "online",
      documentation: "/api/health",
      message: "Backend API is active. React frontend is running on http://localhost:3000 in dev mode.",
    });
  });
}

// Unmatched API / static asset paths get a JSON 404 instead of hanging
app.use(["/api", "/uploads", "/assets"], (req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
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
