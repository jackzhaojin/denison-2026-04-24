# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A one-session demo app for **Denison University CS 271 (Data Structures)**: twenty animated algorithm visualizations plus a "how this was built" meta page, all driven from a single prompt chain. The Vite + shadcn app lives under `web/`; course research and the Denison brand system live under `ai-docs/`.

## Layout

```
/                        root (git repo, jackzhaojin/denison-2026-04-24)
├── CLAUDE.md            this file
├── ai-docs/             research + design references (read but do not edit casually)
│   ├── cs-271-topic-breakdown.md          20-topic curriculum reference
│   └── denison-deck-design-system.md      Big-Red palette + type system
├── web/                 Vite + React 19 + TS + Tailwind v4 + shadcn/ui app
└── .agents/skills/shadcn/                 local shadcn skill (read for component rules)
```

`ai-docs/denison-deck-design-system.md` is load-bearing for any UI work — the app is explicitly **red-dominant** (red background, cream cards, gold accents). Follow `src/index.css` tokens; never introduce raw hex literals in component markup.

## Commands (run from `web/`)

| Task                   | Command               |
| ---------------------- | --------------------- |
| Dev server             | `npm run dev`         |
| Typecheck only         | `npx tsc --noEmit`    |
| Build for prod         | `npm run build`       |
| Preview prod build     | `npm run preview`     |
| Lint                   | `npm run lint`        |
| Format                 | `npm run format`      |

No test runner is wired up; verification is done via Playwright (see below).

## Architecture

- **Routing**: React Router v6 (`src/App.tsx`). Three surfaces: `/` home, `/how-this-was-built` meta, `/topic/:slug` live visualization. Topic pages are lazy-loaded via `import.meta.glob("./topics/*.tsx")` in `src/pages/TopicPage.tsx` — **adding a new topic file to `src/pages/topics/<slug>.tsx` is enough for routing to pick it up**, provided the slug exists in `src/data/topics.ts`.
- **Topic pages** each default-export a component that wraps their content in `<VizFrame>` from `@/components/VizFrame`. That file also exports `<VizControls>` (Play/Pause/Step/Reset/speed), a `useStepRunner` hook (interval-driven auto-advance), and a `DENISON` palette object. All twenty visualizations follow the same state-machine pattern: a pre-computed SCRIPT or trace is stepped through by either the Step button or the auto-runner; SVG renders the frame with `motion/react` for transitions.
- **Theme**: `src/index.css` is the single source of color truth. It rewrites every shadcn CSS variable so `--background = deep red`, `--card = warm stone`, `--primary = Denison red`, `--accent = tassel gold`. The `<body>` inherits red; shadcn `<Card>` is cream, which is why content and charts live inside Cards.
- **Shadcn components** live under `src/components/ui/`; when adding, use `npx shadcn@latest add <name>` from `web/` and the project's nova preset is automatic. The `Button` `outline` variant here is overridden to `bg-transparent` (not `bg-background`) so red-dominant layouts don't hide button text.
- **Motion / React 19 compatibility**: `vite.config.ts` has `resolve.dedupe: ["react", "react-dom"]` and `optimizeDeps.include: [..., "motion/react"]`. If you see "Invalid hook call" from `motion`, re-check that this config is intact.

## Playwright artifact hygiene

Two paths for browser automation; **keep their artifacts in separate folders** (both gitignored):

- **MCP Playwright** (used during live Claude Code sessions via `mcp__playwright__*`): dumps screenshots, accessibility snapshots, and console logs into `.playwright-mcp/` at repo root.
- **Playwright CLI / tests** (if added later via `@playwright/test`): config should write into `.playwright/` and `playwright-report/` / `test-results/`.

Never mix the two. `.gitignore` already excludes `.playwright-mcp/`, `.playwright/`, `playwright-report/`, and `test-results/`. Screenshots generated during a session must stay in `.playwright-mcp/` — do not commit them.

## Working conventions

- **Never commit or push unless explicitly asked.** This is a hard rule carried from user-level instructions.
- **Twenty topics** are authored, do not reshuffle slugs or IDs in `src/data/topics.ts` without reviewing the sidebar + router + meta page together.
- **Per-topic code** should not import new npm packages. All animations are SVG + `motion/react`; state is plain `useState` + the shared `useStepRunner`.
- **Design tokens**: use `DENISON.*` constants for SVG fills, and Tailwind semantic classes (`bg-card`, `text-foreground`, `text-gold`, `font-display`, `font-eyebrow`) for DOM styling.
- **Font roles** (from `ai-docs/denison-deck-design-system.md`): `font-display` (Lora) for headlines, `font-section` (Crimson Pro) for section titles, `font-eyebrow` (Oswald) for all-caps labels, `font-body` (Open Sans) for body copy.
