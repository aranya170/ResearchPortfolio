# Aranya Kishor Das — Portfolio

Personal portfolio site with an admin console for editing content.

- **Frontend:** React 18 + Vite, plain CSS with design tokens (light/dark themes) — hosted on Firebase Hosting
- **Backend:** Express + PostgreSQL (Neon) in `server/` — hosted on Render
- **Live:** https://aranyaportfolio.web.app/

## Local development

```bash
npm install
npm install --prefix server
cp server/.env.example server/.env   # then fill in the values
npm run server                       # API on http://localhost:5000
npm start                            # site on http://localhost:3000
```

The production API URL (`https://researchportfolio.onrender.com/api`) is set in `src/services/api.js`; on `localhost` the frontend talks to `http://localhost:5000/api` instead. Note that if `server/.env` points `DATABASE_URL` at the production database, admin edits made locally change the live site.

## Content

All content (projects, experience, timeline, tech stack) lives in the database and is edited at `/admin`.
`src/data/defaultPortfolio.json` is a snapshot of `/api/portfolio` that the page renders instantly while the API wakes up; refresh it after significant content changes:

```bash
curl -s http://localhost:5000/api/portfolio | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>require('fs').writeFileSync('src/data/defaultPortfolio.json',JSON.stringify(JSON.parse(s).data,null,2)))"
```

Tech stack icons are bundled from `src/data/techIcons.js`; add a `react-icons/si` name there when you use a new one.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Vite dev server |
| `npm run build` | Production build into `build/` (deployed by CI) |
| `npm run lint` | ESLint |
| `npm run check --prefix server` | Syntax/require check for the backend |

## Deployment

Pushing to `main` lints, checks the backend, builds and deploys to Firebase Hosting (`.github/workflows`). Render deploys `server/` separately and needs `JWT_SECRET` (32+ random chars), `DATABASE_URL`, `GMAIL_USER`, `GMAIL_PASS` and `NODE_ENV=production`.
