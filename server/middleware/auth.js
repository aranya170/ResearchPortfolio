const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Never fall back to a hardcoded secret: anyone reading the repo could forge admin tokens.
// In development, a random per-process secret is used (tokens reset on restart).
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set to a random string of at least 32 characters in production.");
  }
  console.warn("⚠️  JWT_SECRET missing or too short; using a random development secret.");
  JWT_SECRET = crypto.randomBytes(48).toString("hex");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
