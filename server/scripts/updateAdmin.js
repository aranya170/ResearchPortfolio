const bcrypt = require("bcryptjs");
const { pool, testConnection } = require("../config/db");

async function updateAdmin() {
  const isConnected = await testConnection();
  if (!isConnected || !pool) {
    console.error("Database connection failed.");
    process.exit(1);
  }

  // Usage: ADMIN_USERNAME=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/updateAdmin.js
  const { ADMIN_USERNAME: username, ADMIN_EMAIL: email, ADMIN_PASSWORD: newPassword } = process.env;
  if (!username || !email || !newPassword || newPassword.length < 12) {
    console.error("Set ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD (12+ chars) in the environment or server/.env.");
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);

  // Update existing admin or insert new
  const existing = await pool.query("SELECT * FROM admin_users LIMIT 1");
  if (existing.rows.length > 0) {
    await pool.query(
      "UPDATE admin_users SET username = $1, email = $2, password_hash = $3, updated_at = NOW() WHERE id = $4",
      [username, email, passwordHash, existing.rows[0].id]
    );
    console.log(`✅ Admin updated in Neon DB: username='${username}'`);
  } else {
    await pool.query(
      "INSERT INTO admin_users (username, email, password_hash) VALUES ($1, $2, $3)",
      [username, email, passwordHash]
    );
    console.log(`✅ Admin inserted in Neon DB: username='${username}'`);
  }

  process.exit(0);
}

updateAdmin();
