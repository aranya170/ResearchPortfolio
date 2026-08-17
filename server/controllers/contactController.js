const { pool, getFallbackStore, saveFallbackStore, testConnection } = require("../config/db");

exports.submitContactMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required" });
  }

  try {
    let savedMessage = null;
    if (pool && (await testConnection())) {
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, message, is_read)
         VALUES ($1, $2, $3, false) RETURNING *`,
        [name, email, message]
      );
      savedMessage = result.rows[0];
    }

    // Always keep fallback storage updated
    const store = getFallbackStore();
    if (!store.messages) store.messages = [];
    const fallbackItem = {
      id: savedMessage ? savedMessage.id : Date.now(),
      name,
      email,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    store.messages.unshift(fallbackItem);
    saveFallbackStore(store);

    console.log(`[Contact Form Received] From: ${name} (${email}) - Length: ${message.length} chars`);
    return res.json({
      success: true,
      message: "Message received successfully. Thank you for reaching out!",
      data: savedMessage || fallbackItem,
    });
  } catch (err) {
    console.error("Submit contact message error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit message" });
  }
};
