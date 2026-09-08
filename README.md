# SkillSetGo — Frontend

React + Vite + Tailwind CSS frontend for SkillSetGo, an AI-powered career readiness platform.

## Run it

```bash
npm install
npm run dev
```

## Backend

Edit `src/config.js` to change `API_BASE` (defaults to `http://localhost:8000`).
Every API call in `src/lib/api.js` automatically falls back to realistic mock
data (in `src/lib/mockData.js`) if the backend isn't reachable yet, so you can
build/demo the frontend independently and swap in the real backend later
with no UI changes.

## Structure

- `src/pages/` — one file per screen (Landing, Dashboard, ResumeAnalysis, EnglishCoach, TechnicalInterview, BehavioralInterview, Roadmap)
- `src/components/` — shared UI (Button, Card, ScoreRing, Sidebar, AppShell, EmptyState, ...)
- `src/context/AppContext.jsx` — in-memory session state (session_id, analysis, scores) — not localStorage, per the ground rules
- `src/lib/api.js` — fetch wrappers matching every backend endpoint in the build brief
