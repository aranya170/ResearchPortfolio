const { pool, getFallbackStore, saveFallbackStore, testConnection, getConnectionStatus } = require("../config/db");
const { initDatabase } = require("../db/initDb");

// Postgres is the source of truth whenever it is reachable; the JSON fallback store
// is only read and written while the database is offline.
const isDbReady = async () => Boolean(pool) && (await testConnection());

const notFound = (res, what) => res.status(404).json({ success: false, message: `${what} not found` });

// ==================== DASHBOARD STATS & STATUS ====================
exports.getStats = async (req, res) => {
  try {
    const isDbConnected = await testConnection();
    let stats = {
      dbConnected: isDbConnected,
      dbStatus: getConnectionStatus(),
      projectsCount: 0,
      experienceCount: 0,
      timelineCount: 0,
      techStackCount: 0,
      unreadMessagesCount: 0,
      totalMessagesCount: 0,
    };

    if (isDbConnected && pool) {
      const pCount = await pool.query("SELECT COUNT(*) FROM projects");
      const eCount = await pool.query("SELECT COUNT(*) FROM experiences");
      const tCount = await pool.query("SELECT COUNT(*) FROM timeline_events");
      const sCount = await pool.query("SELECT COUNT(*) FROM tech_stack");
      const uCount = await pool.query("SELECT COUNT(*) FROM contact_messages WHERE is_read = false");
      const mCount = await pool.query("SELECT COUNT(*) FROM contact_messages");

      stats.projectsCount = parseInt(pCount.rows[0].count, 10);
      stats.experienceCount = parseInt(eCount.rows[0].count, 10);
      stats.timelineCount = parseInt(tCount.rows[0].count, 10);
      stats.techStackCount = parseInt(sCount.rows[0].count, 10);
      stats.unreadMessagesCount = parseInt(uCount.rows[0].count, 10);
      stats.totalMessagesCount = parseInt(mCount.rows[0].count, 10);
    } else {
      const store = getFallbackStore();
      stats.projectsCount = Array.isArray(store.projects)
        ? store.projects.length
        : Object.values(store.projects || {}).flat().length;
      stats.experienceCount = (store.experiences || []).length;
      stats.timelineCount = (store.timeline || []).length;
      stats.techStackCount = (store.techStack || []).length;
      stats.unreadMessagesCount = (store.messages || []).filter((m) => !m.is_read).length;
      stats.totalMessagesCount = (store.messages || []).length;
    }

    return res.json({ success: true, data: stats });
  } catch (err) {
    console.error("Get stats error:", err);
    return res.status(500).json({ success: false, message: "Failed to get stats" });
  }
};

exports.reseedDatabase = async (req, res) => {
  try {
    const success = await initDatabase(true);
    return res
      .status(success ? 200 : 503)
      .json({ success, message: success ? "Database successfully reseeded!" : "Failed to reseed database (is PostgreSQL reachable?)." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.testEmailDelivery = async (req, res) => {
  const nodemailer = require("nodemailer");
  const user = (process.env.GMAIL_USER || process.env.EMAIL_USER || "").trim();
  const pass = (process.env.GMAIL_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  const receiver = (process.env.RECEIVER_EMAIL || user || "aranya.akd@gmail.com").trim();

  if (!user || !pass) {
    return res.status(400).json({
      success: false,
      message: "GMAIL_USER and GMAIL_PASS environment variables are not configured on this server.",
      debug: {
        hasUser: Boolean(user),
        hasPass: Boolean(pass),
      },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      family: 4, // Force IPv4 to prevent ENETUNREACH on cloud environments like Render
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: `"${user} (Portfolio System)" <${user}>`,
      to: receiver,
      subject: "✅ Test Email: Portfolio Gmail Notification Working",
      text: `Hello! This is a test email sent from your portfolio backend server.\n\nTime: ${new Date().toISOString()}\nSender: ${user}\nRecipient: ${receiver}\n\nGmail notification system is fully operational!`,
    });

    return res.json({
      success: true,
      message: `Test email successfully sent to ${receiver}!`,
      messageId: info.messageId,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Failed to send test email: ${err.message}`,
    });
  }
};

// Request bodies may omit fields; undefined becomes NULL so `COALESCE($n, column)` keeps the stored value.
const keep = (value) => (value === undefined ? null : value);
const keepJson = (value) => (value === undefined ? null : JSON.stringify(Array.isArray(value) ? value : []));
const toSortOrder = (value) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
};

// ==================== 1. SITE PROFILE / INTRO SECTOR ====================
exports.updateSiteProfile = async (req, res) => {
  const { greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars } = req.body;
  const profile = { greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars };
  try {
    if (await isDbReady()) {
      const params = [
        keep(greeting),
        keep(name),
        keep(subtitle),
        keep(subtitle_suffix),
        keep(description),
        keep(cv_url),
        typeof show_robot === "boolean" ? show_robot : null,
        typeof show_stars === "boolean" ? show_stars : null,
      ];
      const check = await pool.query("SELECT id FROM site_profile ORDER BY id LIMIT 1");
      let result;
      if (check.rows.length > 0) {
        result = await pool.query(
          `UPDATE site_profile
           SET greeting = COALESCE($1, greeting), name = COALESCE($2, name), subtitle = COALESCE($3, subtitle),
               subtitle_suffix = COALESCE($4, subtitle_suffix), description = COALESCE($5, description),
               cv_url = COALESCE($6, cv_url), show_robot = COALESCE($7, show_robot), show_stars = COALESCE($8, show_stars),
               updated_at = NOW()
           WHERE id = $9 RETURNING *`,
          [...params, check.rows[0].id]
        );
      } else {
        result = await pool.query(
          `INSERT INTO site_profile (greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars)
           VALUES (COALESCE($1, 'Hi there! I''m'), COALESCE($2, 'Aranya Kishor Das'), $3, $4, $5, $6, COALESCE($7, TRUE), COALESCE($8, TRUE))
           RETURNING *`,
          params
        );
      }
      return res.json({ success: true, message: "Intro profile updated successfully", data: result.rows[0] });
    }

    const store = getFallbackStore();
    store.siteProfile = { ...(store.siteProfile || {}), ...profile };
    saveFallbackStore(store);
    return res.json({ success: true, message: "Intro profile updated successfully", data: store.siteProfile });
  } catch (err) {
    console.error("Update site profile error:", err);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// ==================== 2. ABOUT SECTOR ====================
exports.updateAbout = async (req, res) => {
  const {
    title,
    profile_image,
    name,
    role,
    affiliation,
    core_focus,
    location,
    paragraphs,
    pillars,
    timeline_link_text,
    contact_button_text,
  } = req.body;

  try {
    const parasJson = JSON.stringify(Array.isArray(paragraphs) ? paragraphs : []);
    const pillarsJson = JSON.stringify(Array.isArray(pillars) ? pillars : []);

    if (await isDbReady()) {
      // Ensure columns exist
      await pool.query(`
        ALTER TABLE about_section
        ADD COLUMN IF NOT EXISTS name VARCHAR(150) DEFAULT 'Aranya Kishor Das',
        ADD COLUMN IF NOT EXISTS role VARCHAR(255) DEFAULT 'Undergraduate Researcher & Club President',
        ADD COLUMN IF NOT EXISTS affiliation VARCHAR(255) DEFAULT 'United International University',
        ADD COLUMN IF NOT EXISTS core_focus VARCHAR(255) DEFAULT 'Deep Learning, Autonomous Robotics, Kinematics',
        ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Dhaka, Bangladesh',
        ADD COLUMN IF NOT EXISTS pillars JSONB DEFAULT '[]'::jsonb;
      `).catch(() => {});

      const params = [
        title || "Academic Profile & Focus",
        profile_image || "/assets/Aranya Kishor Das.png",
        name || "Aranya Kishor Das",
        role || "Undergraduate Researcher & Club President",
        affiliation || "United International University",
        core_focus || "Deep Learning, Autonomous Robotics, Kinematics",
        location || "Dhaka, Bangladesh",
        parasJson,
        pillarsJson,
        // Not edited in every client: keep the stored text when omitted
        timeline_link_text || null,
        contact_button_text || null,
      ];

      const check = await pool.query("SELECT id FROM about_section ORDER BY id LIMIT 1");
      let result;
      if (check.rows.length > 0) {
        result = await pool.query(
          `UPDATE about_section
           SET title = $1, profile_image = $2, name = $3, role = $4, affiliation = $5, core_focus = $6, location = $7,
               paragraphs = $8::jsonb, pillars = $9::jsonb,
               timeline_link_text = COALESCE($10, timeline_link_text), contact_button_text = COALESCE($11, contact_button_text),
               updated_at = NOW()
           WHERE id = $12 RETURNING *`,
          [...params, check.rows[0].id]
        );
      } else {
        result = await pool.query(
          `INSERT INTO about_section (title, profile_image, name, role, affiliation, core_focus, location, paragraphs, pillars, timeline_link_text, contact_button_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, COALESCE($10, 'View my timeline'), COALESCE($11, 'Get in Touch'))
           RETURNING *`,
          params
        );
      }
      return res.json({ success: true, message: "About section updated successfully", data: result.rows[0] });
    }

    const store = getFallbackStore();
    const prev = store.about || {};
    store.about = {
      ...prev,
      title,
      profile_image,
      name,
      role,
      affiliation,
      core_focus,
      location,
      paragraphs: Array.isArray(paragraphs) ? paragraphs : [],
      pillars: Array.isArray(pillars) ? pillars : [],
      timeline_link_text: timeline_link_text || prev.timeline_link_text,
      contact_button_text: contact_button_text || prev.contact_button_text,
    };
    saveFallbackStore(store);

    return res.json({ success: true, message: "About section updated successfully", data: store.about });
  } catch (err) {
    console.error("Update about error:", err);
    return res.status(500).json({ success: false, message: "Failed to update about section" });
  }
};

// ==================== 3. PROJECTS CRUD ====================
const PROJECT_FILES_AGG = `
  COALESCE(
    json_agg(
      json_build_object(
        'id', f.id,
        'name', f.name,
        'type', f.type,
        'content', f.content,
        'language', f.language,
        'sort_order', f.sort_order
      ) ORDER BY f.sort_order ASC, f.id ASC
    ) FILTER (WHERE f.id IS NOT NULL), '[]'
  ) AS files`;

async function insertProjectFiles(client, projectId, files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i] || {};
    await client.query(
      `INSERT INTO project_files (project_id, name, type, content, language, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        projectId,
        (file.name || "").trim() || `file_${i + 1}`,
        file.type || "info",
        file.content || "",
        file.language || "markdown",
        toSortOrder(file.sort_order) ?? i + 1,
      ]
    );
  }
}

async function fetchProjectWithFiles(client, id) {
  const result = await client.query(
    `SELECT p.*, ${PROJECT_FILES_AGG}
     FROM projects p
     LEFT JOIN project_files f ON p.id = f.project_id
     WHERE p.id = $1
     GROUP BY p.id`,
    [id]
  );
  return result.rows[0] || null;
}

exports.getProjects = async (req, res) => {
  try {
    if (await isDbReady()) {
      // Same ordering as the public /portfolio payload so drag & drop order matches the site
      const result = await pool.query(`
        SELECT p.*, ${PROJECT_FILES_AGG}
        FROM projects p
        LEFT JOIN project_files f ON p.id = f.project_id
        GROUP BY p.id
        ORDER BY p.sort_order ASC, p.id ASC
      `);
      return res.json({ success: true, data: result.rows });
    }

    const store = getFallbackStore();
    let flatProjects = [];
    if (Array.isArray(store.projects)) {
      flatProjects = store.projects;
    } else {
      Object.keys(store.projects || {}).forEach((cat) => {
        flatProjects.push(...(store.projects[cat] || []));
      });
    }
    return res.json({ success: true, data: flatProjects });
  } catch (err) {
    console.error("Get projects error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

exports.createProject = async (req, res) => {
  const { category, name, image, video, video_url, github, website, medium, tableau, dataset, tags, sort_order, files } = req.body;
  if (!name || !String(name).trim()) {
    return res.status(400).json({ success: false, message: "Project name is required" });
  }
  const projectVideo = video || video_url || "";
  const projectFiles = Array.isArray(files) ? files : [];
  try {
    if (await isDbReady()) {
      await pool.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS video VARCHAR(500)").catch(() => {});

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const projRes = await client.query(
          `INSERT INTO projects (category, name, image, video, github, website, medium, tableau, dataset, tags, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
          [
            category || "Software",
            name,
            image || "",
            projectVideo,
            github || "",
            website || "",
            medium || "",
            tableau || "",
            dataset || "",
            JSON.stringify(Array.isArray(tags) ? tags : []),
            toSortOrder(sort_order) ?? 0,
          ]
        );
        const projectId = projRes.rows[0].id;
        await insertProjectFiles(client, projectId, projectFiles);
        await client.query("COMMIT");
        const created = await fetchProjectWithFiles(client, projectId);
        return res.status(201).json({ success: true, message: "Project created successfully", data: created });
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }

    // Fallback store
    const store = getFallbackStore();
    if (!Array.isArray(store.projects)) {
      store.projects = Object.values(store.projects || {}).flat();
    }
    const fallbackItem = {
      id: Date.now(),
      category: category || "Software",
      name,
      image,
      video: projectVideo,
      github,
      website,
      medium,
      tableau,
      dataset,
      tags: tags || [],
      sort_order: toSortOrder(sort_order) ?? store.projects.length + 1,
      files: projectFiles,
    };
    store.projects.push(fallbackItem);
    saveFallbackStore(store);

    return res.status(201).json({ success: true, message: "Project created successfully", data: fallbackItem });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ success: false, message: "Failed to create project" });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { category, name, image, video, video_url, github, website, medium, tableau, dataset, tags, sort_order, files } = req.body;
  const projectVideo = video !== undefined ? video : video_url;

  try {
    if (await isDbReady()) {
      await pool.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS video VARCHAR(500)").catch(() => {});

      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await client.query(
          `UPDATE projects
           SET category = COALESCE($1, category), name = COALESCE($2, name), image = COALESCE($3, image),
               video = COALESCE($4, video), github = COALESCE($5, github), website = COALESCE($6, website),
               medium = COALESCE($7, medium), tableau = COALESCE($8, tableau), dataset = COALESCE($9, dataset),
               tags = COALESCE($10::jsonb, tags), sort_order = COALESCE($11, sort_order), updated_at = NOW()
           WHERE id = $12`,
          [
            category || null,
            name || null,
            keep(image),
            keep(projectVideo),
            keep(github),
            keep(website),
            keep(medium),
            keep(tableau),
            keep(dataset),
            keepJson(tags),
            toSortOrder(sort_order),
            id,
          ]
        );
        if (result.rowCount === 0) {
          await client.query("ROLLBACK");
          return notFound(res, "Project");
        }

        // Re-sync files if provided
        if (Array.isArray(files)) {
          await client.query("DELETE FROM project_files WHERE project_id = $1", [id]);
          await insertProjectFiles(client, id, files);
        }
        await client.query("COMMIT");
        const updated = await fetchProjectWithFiles(client, id);
        return res.json({ success: true, message: "Project updated successfully", data: updated });
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }

    const store = getFallbackStore();
    let projs = Array.isArray(store.projects) ? store.projects : Object.values(store.projects || {}).flat();
    const idx = projs.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return notFound(res, "Project");
    const changes = { category, name, image, video: projectVideo, github, website, medium, tableau, dataset, tags, files };
    Object.keys(changes).forEach((k) => changes[k] === undefined && delete changes[k]);
    if (toSortOrder(sort_order) !== null) changes.sort_order = toSortOrder(sort_order);
    projs[idx] = { ...projs[idx], ...changes };
    store.projects = projs;
    saveFallbackStore(store);

    return res.json({ success: true, message: "Project updated successfully", data: projs[idx] });
  } catch (err) {
    console.error("Update project error:", err);
    return res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

exports.reorderProjects = async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ success: false, message: "Invalid items array for reordering" });
  }
  const order = items.map((item, i) => ({
    id: typeof item === "object" && item !== null && item.id !== undefined ? item.id : item,
    sortOrder:
      typeof item === "object" && item !== null && toSortOrder(item.sort_order) !== null ? toSortOrder(item.sort_order) : i + 1,
  }));

  try {
    if (await isDbReady()) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (const { id, sortOrder } of order) {
          await client.query("UPDATE projects SET sort_order = $1, updated_at = NOW() WHERE id = $2", [sortOrder, id]);
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
      return res.json({ success: true, message: "Projects reordered successfully" });
    }

    // Update fallback store
    const store = getFallbackStore();
    if (!Array.isArray(store.projects)) {
      store.projects = Object.values(store.projects || {}).flat();
    }
    order.forEach(({ id, sortOrder }) => {
      const found = store.projects.find((p) => String(p.id) === String(id));
      if (found) found.sort_order = sortOrder;
    });
    store.projects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    saveFallbackStore(store);

    return res.json({ success: true, message: "Projects reordered successfully" });
  } catch (err) {
    console.error("Reorder projects error:", err);
    return res.status(500).json({ success: false, message: "Failed to reorder projects" });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    if (await isDbReady()) {
      const result = await pool.query("DELETE FROM projects WHERE id = $1", [id]);
      if (result.rowCount === 0) return notFound(res, "Project");
      return res.json({ success: true, message: "Project deleted successfully" });
    }

    const store = getFallbackStore();
    let projs = Array.isArray(store.projects) ? store.projects : Object.values(store.projects || {}).flat();
    store.projects = projs.filter((p) => String(p.id) !== String(id));
    if (store.projects.length === projs.length) return notFound(res, "Project");
    saveFallbackStore(store);

    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};

// ==================== GENERIC LIST CRUD (experience, timeline, tech stack) ====================
// Each resource maps to a Postgres table and a fallback-store key. `required` fields must be
// present on create; `jsonFields` are stored as JSONB arrays; `defaults` apply on create only.
function listCrud({ table, storeKey, label, fields, required = [], jsonFields = [], defaults = {}, hasUpdatedAt = true }) {
  const missing = (body) => required.filter((f) => body[f] === undefined || body[f] === null || String(body[f]).trim() === "");
  const createValue = (body, f) => {
    if (f === "sort_order") return toSortOrder(body.sort_order) ?? 0;
    if (jsonFields.includes(f)) return JSON.stringify(Array.isArray(body[f]) ? body[f] : []);
    const v = body[f];
    return v === undefined || v === "" ? (defaults[f] !== undefined ? defaults[f] : v === "" ? "" : null) : v;
  };
  const updateValue = (body, f) => {
    if (f === "sort_order") return toSortOrder(body.sort_order);
    if (jsonFields.includes(f)) return keepJson(body[f]);
    return keep(body[f]);
  };

  return {
    list: async (req, res) => {
      try {
        if (await isDbReady()) {
          const result = await pool.query(`SELECT * FROM ${table} ORDER BY sort_order ASC, id ASC`);
          return res.json({ success: true, data: result.rows });
        }
        const store = getFallbackStore();
        return res.json({ success: true, data: store[storeKey] || [] });
      } catch (err) {
        console.error(`Get ${table} error:`, err);
        return res.status(500).json({ success: false, message: `Failed to fetch ${label}` });
      }
    },

    create: async (req, res) => {
      const body = req.body || {};
      const absent = missing(body);
      if (absent.length) {
        return res.status(400).json({ success: false, message: `Missing required field(s): ${absent.join(", ")}` });
      }
      try {
        if (await isDbReady()) {
          const cols = fields.join(", ");
          const placeholders = fields.map((f, i) => (jsonFields.includes(f) ? `$${i + 1}::jsonb` : `$${i + 1}`)).join(", ");
          const result = await pool.query(
            `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`,
            fields.map((f) => createValue(body, f))
          );
          return res.status(201).json({ success: true, message: `${label} created successfully`, data: result.rows[0] });
        }

        const store = getFallbackStore();
        if (!store[storeKey]) store[storeKey] = [];
        const item = { id: Date.now() };
        fields.forEach((f) => {
          item[f] = jsonFields.includes(f) ? (Array.isArray(body[f]) ? body[f] : []) : createValue(body, f);
        });
        if (toSortOrder(body.sort_order) === null) item.sort_order = store[storeKey].length + 1;
        store[storeKey].push(item);
        saveFallbackStore(store);
        return res.status(201).json({ success: true, message: `${label} created successfully`, data: item });
      } catch (err) {
        console.error(`Create ${table} error:`, err);
        return res.status(500).json({ success: false, message: `Failed to create ${label.toLowerCase()}` });
      }
    },

    update: async (req, res) => {
      const { id } = req.params;
      const body = req.body || {};
      try {
        if (await isDbReady()) {
          const sets = fields.map((f, i) => `${f} = COALESCE($${i + 1}${jsonFields.includes(f) ? "::jsonb" : ""}, ${f})`);
          if (hasUpdatedAt) sets.push("updated_at = NOW()");
          const result = await pool.query(
            `UPDATE ${table} SET ${sets.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`,
            [...fields.map((f) => updateValue(body, f)), id]
          );
          if (result.rowCount === 0) return notFound(res, label);
          return res.json({ success: true, message: `${label} updated successfully`, data: result.rows[0] });
        }

        const store = getFallbackStore();
        const items = store[storeKey] || [];
        const idx = items.findIndex((t) => String(t.id) === String(id));
        if (idx === -1) return notFound(res, label);
        fields.forEach((f) => {
          const v = f === "sort_order" ? toSortOrder(body.sort_order) : body[f];
          if (v !== undefined && v !== null) items[idx][f] = v;
        });
        saveFallbackStore(store);
        return res.json({ success: true, message: `${label} updated successfully`, data: items[idx] });
      } catch (err) {
        console.error(`Update ${table} error:`, err);
        return res.status(500).json({ success: false, message: `Failed to update ${label.toLowerCase()}` });
      }
    },

    remove: async (req, res) => {
      const { id } = req.params;
      try {
        if (await isDbReady()) {
          const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
          if (result.rowCount === 0) return notFound(res, label);
          return res.json({ success: true, message: `${label} deleted successfully` });
        }
        const store = getFallbackStore();
        const items = store[storeKey] || [];
        store[storeKey] = items.filter((t) => String(t.id) !== String(id));
        if (store[storeKey].length === items.length) return notFound(res, label);
        saveFallbackStore(store);
        return res.json({ success: true, message: `${label} deleted successfully` });
      } catch (err) {
        console.error(`Delete ${table} error:`, err);
        return res.status(500).json({ success: false, message: `Failed to delete ${label.toLowerCase()}` });
      }
    },
  };
}

// ==================== 4. EXPERIENCE CRUD ====================
const experienceCrud = listCrud({
  table: "experiences",
  storeKey: "experiences",
  label: "Experience",
  fields: ["company", "job_title", "duration", "descriptions", "sort_order"],
  required: ["company", "job_title", "duration"],
  jsonFields: ["descriptions"],
});
exports.getExperiences = experienceCrud.list;
exports.createExperience = experienceCrud.create;
exports.updateExperience = experienceCrud.update;
exports.deleteExperience = experienceCrud.remove;

// ==================== 5. TIMELINE CRUD ====================
const timelineCrud = listCrud({
  table: "timeline_events",
  storeKey: "timeline",
  label: "Milestone",
  fields: ["title", "description", "year", "type", "sort_order"],
  required: ["title", "description", "year"],
  defaults: { type: "startup" },
});
exports.getTimeline = timelineCrud.list;
exports.createTimelineEvent = timelineCrud.create;
exports.updateTimelineEvent = timelineCrud.update;
exports.deleteTimelineEvent = timelineCrud.remove;

// ==================== 6. TECH STACK CRUD ====================
const techStackCrud = listCrud({
  table: "tech_stack",
  storeKey: "techStack",
  label: "Tech tool",
  fields: ["name", "category", "icon_name", "color", "sort_order"],
  required: ["name", "icon_name"],
  defaults: { category: "General", color: "#64D98A" },
  hasUpdatedAt: false,
});
exports.getTechStack = techStackCrud.list;
exports.createTechStackItem = techStackCrud.create;
exports.updateTechStackItem = techStackCrud.update;
exports.deleteTechStackItem = techStackCrud.remove;

// ==================== 7. MESSAGES CRUD ====================
exports.getMessages = async (req, res) => {
  try {
    if (await isDbReady()) {
      const result = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC");
      return res.json({ success: true, data: result.rows });
    }
    const store = getFallbackStore();
    return res.json({ success: true, data: store.messages || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

exports.markMessageRead = async (req, res) => {
  const { id } = req.params;
  const isRead = req.body.is_read !== false;
  try {
    if (await isDbReady()) {
      const result = await pool.query("UPDATE contact_messages SET is_read = $1 WHERE id = $2", [isRead, id]);
      if (result.rowCount === 0) return notFound(res, "Message");
      return res.json({ success: true, message: "Message status updated", data: { id: Number(id), is_read: isRead } });
    }
    const store = getFallbackStore();
    const msg = (store.messages || []).find((m) => String(m.id) === String(id));
    if (!msg) return notFound(res, "Message");
    msg.is_read = isRead;
    saveFallbackStore(store);
    return res.json({ success: true, message: "Message status updated", data: { id: msg.id, is_read: isRead } });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update message" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    if (await isDbReady()) {
      const result = await pool.query("DELETE FROM contact_messages WHERE id = $1", [id]);
      if (result.rowCount === 0) return notFound(res, "Message");
      return res.json({ success: true, message: "Message deleted" });
    }
    const store = getFallbackStore();
    const before = (store.messages || []).length;
    store.messages = (store.messages || []).filter((m) => String(m.id) !== String(id));
    if (store.messages.length === before) return notFound(res, "Message");
    saveFallbackStore(store);
    return res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete message" });
  }
};

// ==================== 8. SITE SETTINGS ====================
exports.getSettings = async (req, res) => {
  try {
    if (await isDbReady()) {
      const result = await pool.query("SELECT * FROM site_settings");
      const settings = {};
      result.rows.forEach((r) => {
        let val = r.setting_value;
        if (typeof val === "string") {
          try { val = JSON.parse(val); } catch (e) {}
        }
        settings[r.setting_key] = val;
      });
      return res.json({ success: true, data: settings });
    }
    const store = getFallbackStore();
    return res.json({ success: true, data: store.settings || {} });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to get settings" });
  }
};

exports.updateSettings = async (req, res) => {
  const { settings } = req.body; // e.g. { socials: {}, footer: {}, features: {} }
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return res.status(400).json({ success: false, message: "Expected a { settings: { key: value } } object" });
  }
  try {
    if (await isDbReady()) {
      for (const [key, value] of Object.entries(settings)) {
        await pool.query(
          `INSERT INTO site_settings (setting_key, setting_value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (setting_key) DO UPDATE
           SET setting_value = $2, updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      }
      return exports.getSettings(req, res);
    }
    const store = getFallbackStore();
    store.settings = { ...(store.settings || {}), ...settings };
    saveFallbackStore(store);

    return res.json({ success: true, message: "Settings saved successfully", data: store.settings });
  } catch (err) {
    console.error("Update settings error:", err);
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};
