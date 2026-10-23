const nodemailer = require("nodemailer");
const { pool, getFallbackStore, saveFallbackStore, testConnection } = require("../config/db");

// Helper to create mail transporter
function createTransporter() {
  const user = (process.env.GMAIL_USER || process.env.EMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4, // Force IPv4 to prevent ENETUNREACH IPv6 routing errors on cloud hosts like Render
      auth: {
        user,
        pass,
      },
    });
  }

  return null;
}

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

exports.submitContactMessage = async (req, res) => {
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email, and message are required" });
  }
  if (name.length > 100) {
    return res.status(400).json({ success: false, message: "Name must be 100 characters or fewer" });
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address" });
  }
  if (message.length > 5000) {
    return res.status(400).json({ success: false, message: "Message must be 5000 characters or fewer" });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const displayName = name.replace(/[\r\n"'\\<>]/g, "").trim() || "Visitor";

  try {
    let savedMessage = null;
    if (pool && (await testConnection())) {
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, message, is_read)
         VALUES ($1, $2, $3, false) RETURNING *`,
        [name, email, message]
      );
      savedMessage = result.rows[0];
    } else {
      // Postgres offline: keep the message in the local fallback store instead
      const store = getFallbackStore();
      if (!store.messages) store.messages = [];
      savedMessage = {
        id: Date.now(),
        name,
        email,
        message,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      store.messages.unshift(savedMessage);
      saveFallbackStore(store);
    }

    console.log(`[Contact Form Received] From: ${name} (${email}) - Length: ${message.length} chars`);

    // ── SEND EMAIL NOTIFICATION TO GMAIL ──
    const receiver = (process.env.RECEIVER_EMAIL || process.env.GMAIL_USER || "aranya.akd@gmail.com").trim();
    const transporter = createTransporter();
    let emailStatus = { sent: false, error: null };

    if (transporter) {
      const senderUser = (process.env.GMAIL_USER || process.env.EMAIL_USER || receiver).trim();
      const mailOptions = {
        from: `"${displayName} (Portfolio)" <${senderUser}>`,
        to: receiver,
        replyTo: email,
        subject: `[Portfolio Inquiry] Message from ${displayName}`,
        text: `You received a new inquiry from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nDate: ${new Date().toLocaleString()}\n\nMessage:\n${message}\n`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2ddd3; border-radius: 8px; overflow: hidden;">
            <div style="background: #1E4334; color: #ffffff; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">New Portfolio Inquiry</h2>
              <div style="font-size: 13px; opacity: 0.85; margin-top: 4px;">Received via portfolio contact form</div>
            </div>
            
            <div style="padding: 24px;">
              <div style="margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid #f0ede6;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #666666; text-transform: uppercase; letter-spacing: 0.04em;">Sender Details</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #111111;">${safeName}</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #1E4334;">
                  <a href="mailto:${safeEmail}" style="color: #1E4334; text-decoration: underline;">${safeEmail}</a>
                </p>
              </div>

              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #666666; text-transform: uppercase; letter-spacing: 0.04em;">Message Content</p>
                <div style="background: #f7f5f0; padding: 16px; border-radius: 6px; border: 1px solid #e8e4da; font-size: 14.5px; line-height: 1.6; color: #222222; white-space: pre-wrap;">${safeMessage}</div>
              </div>

              <div style="font-size: 12px; color: #888888; border-top: 1px solid #f0ede6; padding-top: 14px;">
                💡 You can reply directly to this email to respond to <strong>${safeEmail}</strong>.
              </div>
            </div>
          </div>
        `,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email successfully forwarded to Gmail:", info.messageId);
        emailStatus.sent = true;
      } catch (mailErr) {
        console.error("⚠️ Nodemailer failed to send email to Gmail:", mailErr.message);
        emailStatus.error = mailErr.message;
      }
    } else {
      console.warn("⚠️ Nodemailer: GMAIL_USER and/or GMAIL_PASS environment variables are not set on this server.");
      emailStatus.error = "GMAIL_USER / GMAIL_PASS not configured in server environment variables";
    }

    return res.json({
      success: true,
      message: "Your message has been sent successfully. Thank you for reaching out!",
      email_sent: emailStatus.sent,
      email_error: emailStatus.error,
      data: savedMessage,
    });
  } catch (err) {
    console.error("Submit contact message error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit message" });
  }
};
