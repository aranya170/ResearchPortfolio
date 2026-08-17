# Portfolio Backend & PostgreSQL Admin Portal

This backend powers the dynamic content and administrative control panel for Aranya Kishor Das's portfolio website.

## 🚀 Key Features
- **PostgreSQL Database**: Complete relational schema storing all portfolio sectors (Hero/Intro, About Me, Projects & Attached Files, Experience, Timeline, Tech Stack, Inbound Contact Messages, Global Settings, and Admin Authentication).
- **Auto-Seeding**: Automatically seeds all existing portfolio data into PostgreSQL on first run so no information is lost.
- **Resilient Fallback**: Operates smoothly with local fallback cache if PostgreSQL is offline during development, seamlessly syncing to PostgreSQL when connection credentials are supplied.
- **Secure Admin Panel**: Accessible at `/admin` with bcrypt password hashing and JWT authentication.
- **RESTful Endpoints**: Unified payload endpoint `/api/portfolio` for instantaneous frontend rendering.

---

## 🛠️ Configuration & Database Setup

1. Copy `.env.example` to `.env` inside `server/`:
   ```bash
   cp server/.env.example server/.env
   ```

2. Configure your PostgreSQL connection in `server/.env`:
   - **Option A (Full Connection String - Recommended for Neon, Supabase, Railway, Render)**:
     ```env
     DATABASE_URL=postgresql://user:password@your-postgres-host:5432/portfolio_db
     ```
   - **Option B (Individual Parameters - Local PostgreSQL)**:
     ```env
     PGHOST=localhost
     PGPORT=5432
     PGUSER=postgres
     PGPASSWORD=your_password
     PGDATABASE=portfolio
     ```

3. Start the backend:
   ```bash
   # From root directory:
   npm run server
   
   # Or from server directory:
   cd server && npm start
   ```

4. Access the Admin Dashboard:
   - Navigate to `http://localhost:3000/admin`
   - Default login: `admin` / `admin`

---

## 📂 API Endpoints Reference

### Public Endpoints
- `GET /api/health` - Database connection and server status.
- `GET /api/portfolio` - Complete aggregated portfolio payload.
- `POST /api/contact` - Submit contact inquiry directly into PostgreSQL.

### Authentication
- `POST /api/auth/login` - Authenticate admin & receive JWT.
- `POST /api/auth/register` - Create admin account.
- `GET /api/auth/me` - Verify token.
- `POST /api/auth/change-password` - Update admin password.

### Admin CRUD Endpoints (Protected with JWT)
- `GET /api/admin/stats` - Metric counts and connection health.
- `POST /api/admin/reseed` - Reset & re-seed all tables with default portfolio data.
- `PUT /api/admin/intro` - Update Hero & Intro sector.
- `PUT /api/admin/about` - Update About sector & bio paragraphs.
- `GET/POST/PUT/DELETE /api/admin/projects` - Manage projects and attached code files.
- `GET/POST/PUT/DELETE /api/admin/experiences` - Manage work experience.
- `GET/POST/PUT/DELETE /api/admin/timeline` - Manage milestones.
- `GET/POST/PUT/DELETE /api/admin/techstack` - Manage technologies and brand colors.
- `GET/PUT/DELETE /api/admin/messages` - Manage contact form messages.
- `GET/PUT /api/admin/settings` - Update socials, email, and copyright.
- `POST /api/admin/upload` - Upload PDF CVs or project screenshots.
