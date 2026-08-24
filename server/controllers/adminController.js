const { pool, getFallbackStore, saveFallbackStore, testConnection, getConnectionStatus } = require("../config/db");
const { initDatabase } = require("../db/initDb");

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
    return res.json({ success, message: success ? "Database successfully reseeded!" : "Failed to reseed database." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ==================== 1. SITE PROFILE / INTRO SECTOR ====================
exports.updateSiteProfile = async (req, res) => {
  const { greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars } = req.body;
  try {
    if (pool && (await testConnection())) {
      const check = await pool.query("SELECT id FROM site_profile LIMIT 1");
      if (check.rows.length > 0) {
        await pool.query(
          `UPDATE site_profile 
           SET greeting = $1, name = $2, subtitle = $3, subtitle_suffix = $4, description = $5, 
               cv_url = $6, show_robot = $7, show_stars = $8, updated_at = NOW() 
           WHERE id = $9`,
          [greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars, check.rows[0].id]
        );
      } else {
        await pool.query(
          `INSERT INTO site_profile (greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars]
        );
      }
    }

    // Always keep fallback updated
    const store = getFallbackStore();
    store.siteProfile = { greeting, name, subtitle, subtitle_suffix, description, cv_url, show_robot, show_stars };
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
    const parasJson = JSON.stringify(paragraphs || []);
    const pillarsJson = JSON.stringify(pillars || []);

    if (pool && (await testConnection())) {
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

      const check = await pool.query("SELECT id FROM about_section LIMIT 1");
      if (check.rows.length > 0) {
        await pool.query(
          `UPDATE about_section 
           SET title = $1, profile_image = $2, name = $3, role = $4, affiliation = $5, core_focus = $6, location = $7, paragraphs = $8::jsonb, pillars = $9::jsonb, timeline_link_text = $10, contact_button_text = $11, updated_at = NOW() 
           WHERE id = $12`,
          [
            title || "Academic Profile & Focus",
            profile_image || "/assets/Aranya Kishor Das.png",
            name || "Aranya Kishor Das",
            role || "Undergraduate Researcher & Club President",
            affiliation || "United International University",
            core_focus || "Deep Learning, Autonomous Robotics, Kinematics",
            location || "Dhaka, Bangladesh",
            parasJson,
            pillarsJson,
            timeline_link_text || "View my timeline",
            contact_button_text || "Get in Touch",
            check.rows[0].id,
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO about_section (title, profile_image, name, role, affiliation, core_focus, location, paragraphs, pillars, timeline_link_text, contact_button_text)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10, $11)`,
          [
            title || "Academic Profile & Focus",
            profile_image || "/assets/Aranya Kishor Das.png",
            name || "Aranya Kishor Das",
            role || "Undergraduate Researcher & Club President",
            affiliation || "United International University",
            core_focus || "Deep Learning, Autonomous Robotics, Kinematics",
            location || "Dhaka, Bangladesh",
            parasJson,
            pillarsJson,
            timeline_link_text || "View my timeline",
            contact_button_text || "Get in Touch",
          ]
        );
      }
    }

    const store = getFallbackStore();
    store.about = {
      title,
      profile_image,
      name,
      role,
      affiliation,
      core_focus,
      location,
      paragraphs: paragraphs || [],
      pillars: pillars || [],
      timeline_link_text,
      contact_button_text,
    };
    saveFallbackStore(store);

    return res.json({ success: true, message: "About section updated successfully", data: store.about });
  } catch (err) {
    console.error("Update about error:", err);
    return res.status(500).json({ success: false, message: "Failed to update about section" });
  }
};

// ==================== 3. PROJECTS CRUD ====================
exports.getProjects = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
      const result = await pool.query(`
        SELECT p.*,
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
               ) AS files
        FROM projects p
        LEFT JOIN project_files f ON p.id = f.project_id
        GROUP BY p.id
        ORDER BY p.category ASC, p.sort_order ASC, p.id ASC
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
  const projectVideo = video || video_url || "";
  try {
    const tagsJson = JSON.stringify(tags || []);
    let newProject = null;

    if (pool && (await testConnection())) {
      await pool.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS video VARCHAR(500)").catch(() => {});

      const projRes = await pool.query(
        `INSERT INTO projects (category, name, image, video, github, website, medium, tableau, dataset, tags, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
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
          tagsJson,
          sort_order || 0,
        ]
      );
      newProject = projRes.rows[0];

      if (files && Array.isArray(files) && files.length > 0) {
        for (const file of files) {
          await pool.query(
            `INSERT INTO project_files (project_id, name, type, content, language, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              newProject.id,
              file.name,
              file.type || "info",
              file.content || "",
              file.language || "markdown",
              file.sort_order || 0,
            ]
          );
        }
      }
    }

    // Fallback store
    const store = getFallbackStore();
    if (!Array.isArray(store.projects)) {
      store.projects = Object.values(store.projects || {}).flat();
    }
    const fallbackItem = {
      id: newProject ? newProject.id : Date.now(),
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
      sort_order: sort_order || store.projects.length + 1,
      files: files || [{ name: "README.md", type: "info", content: "Project description" }],
    };
    store.projects.push(fallbackItem);
    saveFallbackStore(store);

    return res.json({ success: true, message: "Project created successfully", data: newProject || fallbackItem });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ success: false, message: "Failed to create project" });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  if (id === "reorder") {
    return exports.reorderProjects(req, res);
  }
  const { category, name, image, video, video_url, github, website, medium, tableau, dataset, tags, sort_order, files } = req.body;
  const projectVideo = video !== undefined ? video : (video_url !== undefined ? video_url : "");

  try {
    const tagsJson = JSON.stringify(tags || []);

    if (pool && (await testConnection())) {
      await pool.query("ALTER TABLE projects ADD COLUMN IF NOT EXISTS video VARCHAR(500)").catch(() => {});

      await pool.query(
        `UPDATE projects 
         SET category = $1, name = $2, image = $3, video = $4, github = $5, website = $6, medium = $7, tableau = $8, dataset = $9, tags = $10, sort_order = $11, updated_at = NOW() 
         WHERE id = $12`,
        [category, name, image, projectVideo, github, website, medium || "", tableau || "", dataset || "", tagsJson, sort_order || 0, id]
      );

      // Re-sync files if provided
      if (files && Array.isArray(files)) {
        await pool.query("DELETE FROM project_files WHERE project_id = $1", [id]);
        for (const file of files) {
          await pool.query(
            `INSERT INTO project_files (project_id, name, type, content, language, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [id, file.name, file.type || "info", file.content || "", file.language || "markdown", file.sort_order || 0]
          );
        }
      }
    }

    const store = getFallbackStore();
    let projs = Array.isArray(store.projects) ? store.projects : Object.values(store.projects || {}).flat();
    const idx = projs.findIndex((p) => String(p.id) === String(id));
    if (idx !== -1) {
      projs[idx] = { ...projs[idx], category, name, image, video: projectVideo, github, website, medium, tableau, dataset, tags, sort_order, files };
      store.projects = projs;
      saveFallbackStore(store);
    }

    return res.json({ success: true, message: "Project updated successfully" });
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

  try {
    const isDbConnected = await testConnection();

    if (isDbConnected && pool) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const id = typeof item === "object" && item.id !== undefined ? item.id : item;
          const sortOrder = typeof item === "object" && item.sort_order !== undefined ? item.sort_order : i + 1;
          await client.query("UPDATE projects SET sort_order = $1, updated_at = NOW() WHERE id = $2", [sortOrder, id]);
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      } finally {
        client.release();
      }
    }

    // Update fallback store
    const store = getFallbackStore();
    if (Array.isArray(store.projects)) {
      items.forEach((item, i) => {
        const id = typeof item === "object" && item.id !== undefined ? item.id : item;
        const sortOrder = typeof item === "object" && item.sort_order !== undefined ? item.sort_order : i + 1;
        const found = store.projects.find((p) => String(p.id) === String(id));
        if (found) {
          found.sort_order = sortOrder;
        }
      });
      store.projects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      saveFallbackStore(store);
    }

    return res.json({ success: true, message: "Projects reordered successfully" });
  } catch (err) {
    console.error("Reorder projects error:", err);
    return res.status(500).json({ success: false, message: "Failed to reorder projects: " + err.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool && (await testConnection())) {
      await pool.query("DELETE FROM projects WHERE id = $1", [id]);
    }

    const store = getFallbackStore();
    let projs = Array.isArray(store.projects) ? store.projects : Object.values(store.projects || {}).flat();
    store.projects = projs.filter((p) => String(p.id) !== String(id));
    saveFallbackStore(store);

    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};

// ==================== 4. EXPERIENCE CRUD ====================
exports.getExperiences = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
      const result = await pool.query("SELECT * FROM experiences ORDER BY sort_order ASC, id ASC");
      return res.json({ success: true, data: result.rows });
    }
    const store = getFallbackStore();
    return res.json({ success: true, data: store.experiences || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch experience" });
  }
};

exports.createExperience = async (req, res) => {
  const { company, job_title, duration, descriptions, sort_order } = req.body;
  try {
    const descsJson = JSON.stringify(descriptions || []);
    let newExp = null;

    if (pool && (await testConnection())) {
      const resExp = await pool.query(
        `INSERT INTO experiences (company, job_title, duration, descriptions, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [company, job_title, duration, descsJson, sort_order || 0]
      );
      newExp = resExp.rows[0];
    }

    const store = getFallbackStore();
    if (!store.experiences) store.experiences = [];
    const fallbackItem = {
      id: newExp ? newExp.id : Date.now(),
      company,
      job_title,
      duration,
      descriptions: descriptions || [],
      sort_order: sort_order || store.experiences.length + 1,
    };
    store.experiences.push(fallbackItem);
    saveFallbackStore(store);

    return res.json({ success: true, message: "Experience added successfully", data: newExp || fallbackItem });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create experience" });
  }
};

exports.updateExperience = async (req, res) => {
  const { id } = req.params;
  const { company, job_title, duration, descriptions, sort_order } = req.body;
  try {
    const descsJson = JSON.stringify(descriptions || []);
    if (pool && (await testConnection())) {
      await pool.query(
        `UPDATE experiences 
         SET company = $1, job_title = $2, duration = $3, descriptions = $4, sort_order = $5, updated_at = NOW() 
         WHERE id = $6`,
        [company, job_title, duration, descsJson, sort_order || 0, id]
      );
    }

    const store = getFallbackStore();
    if (store.experiences) {
      const idx = store.experiences.findIndex((e) => String(e.id) === String(id));
      if (idx !== -1) {
        store.experiences[idx] = { ...store.experiences[idx], company, job_title, duration, descriptions, sort_order };
        saveFallbackStore(store);
      }
    }

    return res.json({ success: true, message: "Experience updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update experience" });
  }
};

exports.deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool && (await testConnection())) {
      await pool.query("DELETE FROM experiences WHERE id = $1", [id]);
    }
    const store = getFallbackStore();
    if (store.experiences) {
      store.experiences = store.experiences.filter((e) => String(e.id) !== String(id));
      saveFallbackStore(store);
    }
    return res.json({ success: true, message: "Experience deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete experience" });
  }
};

// ==================== 5. TIMELINE CRUD ====================
exports.getTimeline = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
      const result = await pool.query("SELECT * FROM timeline_events ORDER BY sort_order ASC, id ASC");
      return res.json({ success: true, data: result.rows });
    }
    const store = getFallbackStore();
    return res.json({ success: true, data: store.timeline || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch timeline" });
  }
};

exports.createTimelineEvent = async (req, res) => {
  const { title, description, year, type, sort_order } = req.body;
  try {
    let newItem = null;
    if (pool && (await testConnection())) {
      const resItem = await pool.query(
        `INSERT INTO timeline_events (title, description, year, type, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, description, year, type || "startup", sort_order || 0]
      );
      newItem = resItem.rows[0];
    }
    const store = getFallbackStore();
    if (!store.timeline) store.timeline = [];
    const fallbackItem = {
      id: newItem ? newItem.id : Date.now(),
      title,
      description,
      year,
      type: type || "startup",
      sort_order: sort_order || store.timeline.length + 1,
    };
    store.timeline.push(fallbackItem);
    saveFallbackStore(store);

    return res.json({ success: true, message: "Timeline milestone created", data: newItem || fallbackItem });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to create milestone" });
  }
};

exports.updateTimelineEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, year, type, sort_order } = req.body;
  try {
    if (pool && (await testConnection())) {
      await pool.query(
        `UPDATE timeline_events 
         SET title = $1, description = $2, year = $3, type = $4, sort_order = $5, updated_at = NOW() 
         WHERE id = $6`,
        [title, description, year, type, sort_order || 0, id]
      );
    }
    const store = getFallbackStore();
    if (store.timeline) {
      const idx = store.timeline.findIndex((t) => String(t.id) === String(id));
      if (idx !== -1) {
        store.timeline[idx] = { ...store.timeline[idx], title, description, year, type, sort_order };
        saveFallbackStore(store);
      }
    }
    return res.json({ success: true, message: "Milestone updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update milestone" });
  }
};

exports.deleteTimelineEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool && (await testConnection())) {
      await pool.query("DELETE FROM timeline_events WHERE id = $1", [id]);
    }
    const store = getFallbackStore();
    if (store.timeline) {
      store.timeline = store.timeline.filter((t) => String(t.id) !== String(id));
      saveFallbackStore(store);
    }
    return res.json({ success: true, message: "Milestone deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete milestone" });
  }
};

// ==================== 6. TECH STACK CRUD ====================
exports.getTechStack = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
      const result = await pool.query("SELECT * FROM tech_stack ORDER BY sort_order ASC, id ASC");
      return res.json({ success: true, data: result.rows });
    }
    const store = getFallbackStore();
    return res.json({ success: true, data: store.techStack || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to fetch tech stack" });
  }
};

exports.createTechStackItem = async (req, res) => {
  const { name, category, icon_name, color, sort_order } = req.body;
  try {
    let newItem = null;
    if (pool && (await testConnection())) {
      const resItem = await pool.query(
        `INSERT INTO tech_stack (name, category, icon_name, color, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, category || "General", icon_name, color || "#64D98A", sort_order || 0]
      );
      newItem = resItem.rows[0];
    }
    const store = getFallbackStore();
    if (!store.techStack) store.techStack = [];
    const fallbackItem = {
      id: newItem ? newItem.id : Date.now(),
      name,
      category: category || "General",
      icon_name,
      color: color || "#64D98A",
      sort_order: sort_order || store.techStack.length + 1,
    };
    store.techStack.push(fallbackItem);
    saveFallbackStore(store);

    return res.json({ success: true, message: "Tech tool added successfully", data: newItem || fallbackItem });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to add tech tool" });
  }
};

exports.updateTechStackItem = async (req, res) => {
  const { id } = req.params;
  const { name, category, icon_name, color, sort_order } = req.body;
  try {
    if (pool && (await testConnection())) {
      await pool.query(
        `UPDATE tech_stack 
         SET name = $1, category = $2, icon_name = $3, color = $4, sort_order = $5 
         WHERE id = $6`,
        [name, category, icon_name, color, sort_order || 0, id]
      );
    }
    const store = getFallbackStore();
    if (store.techStack) {
      const idx = store.techStack.findIndex((t) => String(t.id) === String(id));
      if (idx !== -1) {
        store.techStack[idx] = { ...store.techStack[idx], name, category, icon_name, color, sort_order };
        saveFallbackStore(store);
      }
    }
    return res.json({ success: true, message: "Tech tool updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update tech tool" });
  }
};

exports.deleteTechStackItem = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool && (await testConnection())) {
      await pool.query("DELETE FROM tech_stack WHERE id = $1", [id]);
    }
    const store = getFallbackStore();
    if (store.techStack) {
      store.techStack = store.techStack.filter((t) => String(t.id) !== String(id));
      saveFallbackStore(store);
    }
    return res.json({ success: true, message: "Tech tool deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete tech tool" });
  }
};

// ==================== 7. MESSAGES CRUD ====================
exports.getMessages = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
      const result = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
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
  const { is_read } = req.body;
  try {
    if (pool && (await testConnection())) {
      await pool.query("UPDATE contact_messages SET is_read = $1 WHERE id = $2", [is_read !== false, id]);
    }
    const store = getFallbackStore();
    if (store.messages) {
      const idx = store.messages.findIndex((m) => String(m.id) === String(id));
      if (idx !== -1) {
        store.messages[idx].is_read = is_read !== false;
        saveFallbackStore(store);
      }
    }
    return res.json({ success: true, message: "Message status updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update message" });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool && (await testConnection())) {
      await pool.query("DELETE FROM contact_messages WHERE id = $1", [id]);
    }
    const store = getFallbackStore();
    if (store.messages) {
      store.messages = store.messages.filter((m) => String(m.id) !== String(id));
      saveFallbackStore(store);
    }
    return res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to delete message" });
  }
};

// ==================== 8. SITE SETTINGS ====================
exports.getSettings = async (req, res) => {
  try {
    if (pool && (await testConnection())) {
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
  try {
    if (pool && (await testConnection())) {
      for (const [key, value] of Object.entries(settings || {})) {
        await pool.query(
          `INSERT INTO site_settings (setting_key, setting_value, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (setting_key) DO UPDATE 
           SET setting_value = $2, updated_at = NOW()`,
          [key, JSON.stringify(value)]
        );
      }
    }
    const store = getFallbackStore();
    store.settings = { ...(store.settings || {}), ...settings };
    saveFallbackStore(store);

    return res.json({ success: true, message: "Settings saved successfully", data: store.settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};
