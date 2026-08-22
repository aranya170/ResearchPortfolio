const { pool, getFallbackStore, testConnection } = require("../config/db");
const seedData = require("../db/seedData");

// Get all portfolio sectors in one clean payload
exports.getPortfolioData = async (req, res) => {
  try {
    const isDbConnected = await testConnection();

    if (isDbConnected && pool) {
      // 1. Site profile / Intro
      const profileRes = await pool.query("SELECT * FROM site_profile LIMIT 1");
      const profile = profileRes.rows[0] || seedData.siteProfile;

      // 2. About section
      const aboutRes = await pool.query("SELECT * FROM about_section LIMIT 1");
      let about = aboutRes.rows[0] || seedData.about;
      if (about) {
        if (typeof about.paragraphs === "string") {
          try {
            about.paragraphs = JSON.parse(about.paragraphs);
          } catch (e) {}
        }
        if (typeof about.pillars === "string") {
          try {
            about.pillars = JSON.parse(about.pillars);
          } catch (e) {}
        }
      }

      // 3. Projects with associated files
      const projectsRes = await pool.query(`
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
        ORDER BY p.sort_order ASC, p.id ASC
      `);

      // Group projects by category
      const projectsGrouped = {};

      projectsRes.rows.forEach((proj) => {
        const cat = proj.category || "Software";
        if (!projectsGrouped[cat]) {
          projectsGrouped[cat] = [];
        }
        let tags = proj.tags;
        if (typeof tags === "string") {
          try {
            tags = JSON.parse(tags);
          } catch (e) {
            tags = [];
          }
        }
        projectsGrouped[cat].push({
          id: proj.id,
          name: proj.name,
          category: proj.category,
          image: proj.image,
          github: proj.github,
          website: proj.website,
          medium: proj.medium,
          tableau: proj.tableau,
          dataset: proj.dataset,
          tags: tags || [],
          sort_order: proj.sort_order,
          files: proj.files || [],
        });
      });

      // 4. Experiences
      const expRes = await pool.query("SELECT * FROM experiences ORDER BY sort_order ASC, id ASC");
      const experiences = expRes.rows.map((e) => {
        let descs = e.descriptions;
        if (typeof descs === "string") {
          try {
            descs = JSON.parse(descs);
          } catch (err) {
            descs = [];
          }
        }
        return {
          id: e.id,
          company: e.company,
          job_title: e.job_title,
          duration: e.duration,
          descriptions: descs || [],
          sort_order: e.sort_order,
        };
      });

      // 5. Timeline events
      const timelineRes = await pool.query("SELECT * FROM timeline_events ORDER BY sort_order ASC, id ASC");
      const timeline = timelineRes.rows.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        year: t.year,
        type: t.type,
        sort_order: t.sort_order,
      }));

      // 6. Tech stack
      const techRes = await pool.query("SELECT * FROM tech_stack ORDER BY sort_order ASC, id ASC");
      const techStack = techRes.rows.map((ts) => ({
        id: ts.id,
        name: ts.name,
        category: ts.category,
        icon_name: ts.icon_name,
        color: ts.color,
        sort_order: ts.sort_order,
      }));

      // 7. Site settings
      const settingsRes = await pool.query("SELECT * FROM site_settings");
      const settings = {};
      settingsRes.rows.forEach((s) => {
        let val = s.setting_value;
        if (typeof val === "string") {
          try {
            val = JSON.parse(val);
          } catch (e) {}
        }
        settings[s.setting_key] = val;
      });

      return res.json({
        success: true,
        data: {
          siteProfile: profile,
          about,
          projects: Object.keys(projectsGrouped).length > 0 ? projectsGrouped : seedData.projects,
          experiences,
          timeline,
          techStack,
          settings: Object.keys(settings).length > 0 ? settings : seedData.settings,
        },
      });
    }

    // Fallback store
    const store = getFallbackStore();
    let grouped = {};
    const rawProjects = Array.isArray(store.projects) && store.projects.length > 0
      ? store.projects
      : seedData.projects;

    if (Array.isArray(rawProjects)) {
      rawProjects.forEach((p, idx) => {
        const cat = p.category || "Software";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({ id: p.id || idx + 1, ...p });
      });
    } else if (typeof rawProjects === "object") {
      grouped = rawProjects;
    }

    return res.json({
      success: true,
      data: {
        siteProfile: store.siteProfile || seedData.siteProfile,
        about: store.about || seedData.about,
        projects: grouped,
        experiences: store.experiences || seedData.experiences,
        timeline: store.timeline || seedData.timeline,
        techStack: store.techStack || seedData.techStack,
        settings: store.settings || seedData.settings,
      },
    });
  } catch (err) {
    console.error("Get portfolio data error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch portfolio data",
      data: seedData,
    });
  }
};
