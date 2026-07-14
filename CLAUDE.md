# velm — AI Running Coach (RuFlo V3 Integrated)

## Project Overview

**velm** is an AI-powered running coach PWA with 4 specialized AI agents.

### Structure

```
aspireflow/                — frontend repo (this one)
  dashboard.html          — Frontend SPA (mobile-first PWA, ~10 000 lines, 5 views + check-in overlay)
  index.html              — Onboarding / registration (~4 000 lines, multilingual pl/en/fr/es/de)
  sw.js                   — Service worker (network-first HTML, cache-first assets)
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
- Run `node --check` after every .js file change
- Prefer editing existing files over creating new ones

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
