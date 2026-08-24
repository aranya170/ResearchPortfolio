const PROD_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const normalizeApiUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "http://localhost:5000/api";
  let clean = rawUrl.trim().replace(/\/+$/, "");
  if (!clean.endsWith("/api")) {
    clean = `${clean}/api`;
  }
  return clean;
};

export const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("admin_custom_api_url");
    if (custom && custom.trim()) {
      return normalizeApiUrl(custom);
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      return normalizeApiUrl(process.env.REACT_APP_LOCAL_API_URL || "http://localhost:5000/api");
    }

    if (process.env.REACT_APP_API_URL) {
      return normalizeApiUrl(process.env.REACT_APP_API_URL);
    }

    // On hosted domains (e.g. Vercel / Firebase), default to same origin "/api"
    return `${window.location.origin}/api`;
  }

  if (process.env.REACT_APP_API_URL) {
    return normalizeApiUrl(process.env.REACT_APP_API_URL);
  }

  return normalizeApiUrl(PROD_API_URL);
};

export const getAssetUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  let formatted = trimmed;
  if (!formatted.startsWith("/") && !formatted.startsWith(".")) {
    formatted = `/${formatted}`;
  }

  // If it's an uploaded asset from backend (/uploads/...)
  if (formatted.startsWith("/uploads/")) {
    const apiBase = getApiBaseUrl().replace(/\/api\/?$/, "");
    return `${apiBase}${encodeURI(formatted)}`;
  }

  return encodeURI(formatted);
};

function getAuthHeader() {
  const token = localStorage.getItem("portfolio_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Token expired / invalid
        if (endpoint.startsWith("/admin") || endpoint.startsWith("/auth/me")) {
          localStorage.removeItem("portfolio_admin_token");
          localStorage.removeItem("portfolio_admin_user");
        }
      }
      throw new Error((data && data.message) || `HTTP Error ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API request failed [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Public Portfolio API
  getHealth: () => request("/health"),
  getPortfolio: () => request("/portfolio"),
  sendContactMessage: (msg) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(msg),
    }),

  // Auth API
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMe: () => request("/auth/me"),
  changePassword: (passwords) =>
    request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwords),
    }),

  // Admin Stats & Control
  getAdminStats: () => request("/admin/stats"),
  reseedDatabase: () => request("/admin/reseed", { method: "POST" }),

  // Sector 1: Intro
  updateIntro: (profile) =>
    request("/admin/intro", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),

  // Sector 2: About
  updateAbout: (about) =>
    request("/admin/about", {
      method: "PUT",
      body: JSON.stringify(about),
    }),

  // Sector 3: Projects
  getProjects: () => request("/admin/projects"),
  createProject: (project) =>
    request("/admin/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),
  updateProject: (id, project) =>
    request(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    }),
  reorderProjects: (items) =>
    request("/admin/projects/reorder", {
      method: "PUT",
      body: JSON.stringify({ items }),
    }),
  deleteProject: (id) =>
    request(`/admin/projects/${id}`, {
      method: "DELETE",
    }),

  // Sector 4: Experience
  getExperiences: () => request("/admin/experiences"),
  createExperience: (exp) =>
    request("/admin/experiences", {
      method: "POST",
      body: JSON.stringify(exp),
    }),
  updateExperience: (id, exp) =>
    request(`/admin/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(exp),
    }),
  deleteExperience: (id) =>
    request(`/admin/experiences/${id}`, {
      method: "DELETE",
    }),

  // Sector 5: Timeline
  getTimeline: () => request("/admin/timeline"),
  createTimelineEvent: (event) =>
    request("/admin/timeline", {
      method: "POST",
      body: JSON.stringify(event),
    }),
  updateTimelineEvent: (id, event) =>
    request(`/admin/timeline/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),
  deleteTimelineEvent: (id) =>
    request(`/admin/timeline/${id}`, {
      method: "DELETE",
    }),

  // Sector 6: Tech Stack
  getTechStack: () => request("/admin/techstack"),
  createTechStackItem: (tech) =>
    request("/admin/techstack", {
      method: "POST",
      body: JSON.stringify(tech),
    }),
  updateTechStackItem: (id, tech) =>
    request(`/admin/techstack/${id}`, {
      method: "PUT",
      body: JSON.stringify(tech),
    }),
  deleteTechStackItem: (id) =>
    request(`/admin/techstack/${id}`, {
      method: "DELETE",
    }),

  // Sector 7: Messages
  getMessages: () => request("/admin/messages"),
  markMessageRead: (id, isRead) =>
    request(`/admin/messages/${id}/read`, {
      method: "PUT",
      body: JSON.stringify({ is_read: isRead }),
    }),
  deleteMessage: (id) =>
    request(`/admin/messages/${id}`, {
      method: "DELETE",
    }),
  testEmailDelivery: () =>
    request("/admin/test-email", {
      method: "POST",
    }),

  // Sector 8: Settings
  getSettings: () => request("/admin/settings"),
  updateSettings: (settings) =>
    request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    }),

  // Media & Video discovery
  getMediaVideos: () => request("/admin/media/videos"),

  // Upload Asset (Image, PDF, or Video)
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/admin/upload", {
      method: "POST",
      body: formData,
    });
  },
};

export default api;
