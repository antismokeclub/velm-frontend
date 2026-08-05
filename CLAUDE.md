# velm — AI Running Coach (RuFlo V3 Integrated)

## Project Overview

**velm** is an AI-powered running coach PWA with 4 specialized AI agents.

### Structure

```
aspireflow/                — frontend repo (this one)
  dashboard.html          — SPA markup only (~1 480 lines, 5 views + check-in overlay)
  index.html              — Onboarding markup only (~66 lines) + 2 inline scripts in <head>
  css/dashboard.css       — dashboard stylesheet   (~2 640 lines)
  css/index.css           — onboarding stylesheet  (~600 lines)
  js/index.js             — onboarding wizard      (~2 570 lines)
  js/dashboard/           — dashboard app, split into 21 files loaded IN ORDER:
      01-core.js          — auth guard, sanitizeHTML, tokens, apiFetch
      02-profil.js  03-rozmowy.js  04-home.js  05-kalendarz.js
      06-statystyki-wspolne.js  07-laboratorium.js  08-statystyki.js
      09-nawigacja.js  10-kreator-celu.js  11-ustawienia.js
      12-i18n.js (largest, ~1 700)  13-subskrypcja.js  14-integracje.js
      15-historia.js  16-narada.js  17-czat.js  18-dzis.js
      19-konto.js         — API_BASE, VELM_BUILD, login, bootstrap IIFE
      20-checkin.js (~1 350)  21-start.js — runs last
  sw.js                   — Service worker; STATIC_ASSETS must list every js/dashboard/* file
  manifest.json           — PWA manifest; capacitor.config.json — native wrapper
  velm-backend/           — SEPARATE git repo (github.com/antismokeclub/velm-backend), gitignored here
    server.js             — Express API server (port 3000) — all endpoints, middleware, cron
    db/queries.js         — All Supabase database queries
    agents/
      headtrainer.js      — Szef Sztabu: chat, weekly planning (narada), daily reports
      analityk.js         — Workout analysis, auto-analysis after each workout
      fizjo.js            — Injury management, recovery
      psycholog.js        — Mental coaching, motivation
    agent-skills/         — Markdown knowledge injected into agent prompts
    skills-loader.js      — Loads skill files at startup
```

### Stack
- **Backend**: Node.js + Express (CommonJS), hosted on Railway
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude API (Haiku for chat/auto-analysis, Sonnet for weekly planning)
- **Auth**: JWT access+refresh with token versioning; bcrypt passwords
- **Payments**: Stripe (checkout/portal/webhook — code complete, needs env config)
- **Integrations**: Strava OAuth+webhook (done), Garmin .fit import (done), Whoop (not started)
- **Frontend**: Vanilla HTML/CSS/JS single-file SPA, hosted on Vercel
- **Design**: Mobile-first, premium — white cards, #1A1A1A buttons, 20px radius

### Backend details
See `velm-backend/CLAUDE.md` for endpoints, DB tables, agent architecture, env vars.

## Build & Test

```bash
# Syntax validation (run after every backend change)
cd velm-backend && node --check server.js && node --check agents/headtrainer.js && node --check agents/analityk.js && node --check agents/fizjo.js && node --check agents/psycholog.js && node --check db/queries.js && echo "ALL OK"

# Start server
cd velm-backend && node server.js
```

## Behavioral Rules

- ALWAYS read a file before editing it
- NEVER commit .env files or secrets
- NEVER change Claude model without confirmation
- NEVER change Supabase schema without confirmation
- Run `node --check` after every .js file change (or `python tools/syntax_check.py`
  for the whole frontend — it walks `js/` recursively plus inline `<script>` blocks)
- Prefer editing existing files over creating new ones

### Frontend loading rules (breaking these takes the app down silently)
- `js/dashboard/*` are **classic scripts, loaded in numbered order, sharing one
  global scope**. Never add `defer` or `type="module"`: ~75 function names are
  called from inline `on*=""` attributes, and `defer` would move the auth guard
  in `01-core.js` after render.
- Function declarations hoist **within a file only**. Code that runs immediately
  sees only files numbered at or below its own. The fragile spot is the IIFE in
  `19-konto.js`, which calls `switchView('home')`.
- Renaming or adding a file in `js/dashboard/` means updating BOTH the script
  tags in `dashboard.html` and `STATIC_ASSETS` in `sw.js`. `cache.addAll` is
  atomic — one 404 silently drops the entire offline cache.
- Bump `VELM_BUILD` (`19-konto.js`) and `CACHE_VERSION` (`sw.js`) together.
- After deploying, curl production — `vercel.json` `builds` is a whitelist.

## Velm-Specific Agents (RuFlo)

| Agent | Role | Writes to |
|-------|------|-----------|
| `velm-planner` | Architect — designs features, decomposes tasks | Read-only |
| `velm-backend` | Backend developer — Express API, agents, DB queries | `velm-backend/**` |
| `velm-frontend` | Frontend developer — dashboard.html UI/UX | `dashboard.html`, `index.html` |
| `velm-tester` | Tester — syntax check, smoke tests, HTML validation | Read-only |

### Swarm flow: planner → backend + frontend (parallel) → tester

## Swarm Orchestration (RuFlo V3)

```bash
# Initialize swarm for velm
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

- Use hierarchical topology (planner leads backend + frontend workers)
- Max 8 agents for tight coordination
- ALWAYS spawn ALL agents in ONE message via Task tool
- ALWAYS use `run_in_background: true` for agent Task calls
- After spawning agents, STOP — wait for results

## Concurrency Rules

- All operations MUST be parallel in a single message
- Batch ALL file reads/writes/edits in ONE message
- Batch ALL Bash commands in ONE message
- NEVER poll agent status — trust them to return

## Security

- NEVER hardcode API keys or credentials
- Always validate user input at API boundaries
- Sanitize file paths

## Skill routing (gstack)

When the user's request matches an available skill, ALWAYS invoke it using the Skill tool as your FIRST action:

- Bugs, errors, "dlaczego nie działa", 500 errors → invoke `investigate`
- Ship, deploy, push, PR → invoke `ship`
- QA, test, sprawdź czy działa → invoke `qa`
- Code review, sprawdź kod → invoke `review`
- Design audit, popraw wygląd → invoke `design-review`
- Produkt, czy warto budować → invoke `office-hours`
