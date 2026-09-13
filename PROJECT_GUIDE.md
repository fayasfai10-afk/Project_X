# JharSetu — Complete Project Understanding Guide

> Read this once and you'll understand **every aspect** of the project: what it does, how every file works, how data flows, how the design system works, and how to explain it in a pitch. Written for you (the project owner), in plain language.

---

## Part 1 — The Big Picture (2-minute version)

**The problem (SIH 26043):** Citizens complain about civic problems (bad water, broken roads…). Complaints go into a government portal, get a ticket number, and die. Nobody connects them to the people who could actually *solve* them — university researchers, students, and industry.

**JharSetu's idea:** Build a *bridge* with 4 stops:

```
Citizen report → AI structures it → Matched to University + Faculty + Industry
      ↑                                        ↓
Government scales it   ←   Project workspace builds & measures a solution
```

**One-line pitch:** *"A complaint should be the beginning, not the end."* — that exact sentence is on the landing page.

**Important honesty note (already in the code):** This is a **demo-first MVP**. All data is hardcoded mock data. AI analysis, matching scores, heatmaps — all are simulated for the hackathon pitch. The README documents the real production stack (Django + PostgreSQL/PostGIS + pgvector) as a future target.

---

## Part 2 — Tech Stack (and why each piece was chosen)

| Tech | Version | What it does here |
|---|---|---|
| **Next.js** (App Router) | 15.x | The framework. Pages live in `app/` as folders; each `page.tsx` becomes a route automatically. Also gives the dev server (`npm run dev`). |
| **React** | 19 | Renders the UI. Every page is a React component (`'use client'` at top means it runs in the browser). |
| **TypeScript** | 5.7 | Types for `Challenge` and `Partner` live in `lib/types.ts`, so typos in data get caught at compile time. |
| **framer-motion** | 11 | All animations: scroll-in reveals (`Reveal`), card hover lift (`whileHover={{y:-5}}`), pulsing map blobs, breathing AI hub circle. |
| **lucide-react** | — | All icons (`Bot`, `MapPin`, `ShieldCheck`, `Rocket`…). Imported per-page. |
| **recharts** | 2.15 | Installed for charting but the current dashboard uses CSS/HTML bars instead. |
| **Plain CSS** (`globals.css`) | — | The whole design system: colors as CSS variables (`--accent-2` etc.), card styles, grid layouts, the fake heatmap. No Tailwind, no Bootstrap. |

**Commands:**
```bash
npm install      # install deps
npm run dev      # dev server → http://localhost:3000
npm run build    # production build
npm run lint     # lint (verify: npm run lint)
```

⚠️ On this machine, `npm`/`node` aren't on PATH by default — use:
```powershell
$env:Path += ";C:\Program Files\nodejs"; npm run dev
```

---

## Part 3 — File-by-File Walkthrough

### 3.1 `lib/types.ts` — the vocabulary of the app
Two types define everything:

- **`Challenge`** — one civic problem. Fields: `id` (like `CH-1042`), `title`, `summary`, `domain` (Water/Infrastructure/Agriculture/Education/Environment), `subcategory`, `district` + `location` + `lat/lng` (geo data for the map story), `status` (the 7 lifecycle stages), `priority` (Critical→Low), `impactScore` (0–100), `affectedPeople`, `reports` (how many citizens reported — used for dedup/trust), `verified`, `submittedBy`, `createdAt`, `expertise[]` (skills needed to solve it), `tags[]`.
- **`Partner`** — a potential solver. `kind` is `'University' | 'Industry' | 'Faculty'`, `match` is a 0–100 score, `reason[]` is the **explainable** part (e.g. "Water quality research", "IoT prototyping lab") — this explainability is a key selling point in the pitch.

### 3.2 `lib/mockData.ts` — the demo dataset
- **5 challenges**, each in a real Jharkhand district, deliberately covering all 5 domains and a range of impact scores (91 → 69):
  - `CH-1042` Dumka — drinking water quality (the "star" challenge used everywhere in the demo)
  - `CH-1038` Ranchi — road access to health centres
  - `CH-1024` Hazaribagh — agriculture / biomass
  - `CH-1018` West Singhbhum — education / offline computing
  - `CH-1007` Bokaro — waste management / computer vision
- **Partner lists**: `universityPartners` (BIT Mesra 94%, CUJ 89%, Ranchi University 83%), `facultyPartners` (Dr. Ananya Sen 92%, Dr. R. Kumar 86%), `industryPartners` (AquaSense Labs 91%, GramTech 86%, Metrica 79%). Match percentages are hand-set — in production pgvector similarity would compute them.

### 3.3 `components/ui.tsx` — the reusable toolbox
| Component | What it renders | Where used |
|---|---|---|
| `Reveal` | Scroll-triggered fade+slide (framer-motion `whileInView`, fires once) | Every page's sections |
| `SiteNav` | Top nav; links and 2 CTAs → `/dashboard` and `/report` | Every page |
| `PriorityBadge` | Colored pill from priority string (CSS class = lowercase name: `.critical`, `.high`…) | Cards, detail pages |
| `StatKpi` | Big-number KPI card with label + delta caption | Dashboard |
| `ChallengeCard` | Animated card: priority, id, title, summary, district/impact/reports chips, status footer + arrow link | `/challenges`, home |
| `MatchList` | Panel titled e.g. "University matching"; rows with name, capability chips, joined reasons, big % score | Challenge detail, project workspace |
| `Lifecycle` | Row of 7 lifecycle steps; `active={n}` highlights progress | Detail, dashboard, project |
| `Toast` | Small confirmation popup controlled by a boolean state | `/report`, project workspace |
| `TrustStrip` | Trust messaging (community validation) | Report form |

### 3.4 Pages (in narrative order = the demo flow)

**1. `/` — Landing (`app/page.tsx`)**
Hero → "the missing bridge" section with an **orbit diagram**: a pulsing central "AI Problem Intelligence" hub (`motion.div` scale animation) with 4 orbiting nodes (Citizen/University/Industry/Government) — the visual thesis of the product. Then 4 numbered feature panels: (01) AI problem intelligence with a mock analysis of CH-1042 (Water · Critical · 91/100 · 4 likely duplicates), (02) intelligent matching chain, (03) 6-step lifecycle grid, (04) outcome registry (41 pilots, 12 patents, 8 startups).

**2. `/report` — Citizen intake (`app/report/page.tsx`)**
The entry point. A form pre-filled with the water scenario: title, free-text description (a `useState`-controlled textarea — the only truly interactive input), location + map-pin button, people affected, urgency select, optional category, mocked evidence upload dropzone. `TrustStrip` + the disclaimer line *"AI recommendations are advisory until a human validator approves them"* (important for judges — shows responsible AI thinking). The submit button just flips `submitted` state — no backend.

**3. `/challenges` — Challenge network (`app/challenges/page.tsx`)**
"The problem map." A filter bar (search input, Priority/District/Domain buttons — **visual only, not wired up**) and a responsive grid of all 5 `ChallengeCard`s. Clicking a card → its detail page.

**4. `/challenges/[id]` — Challenge detail (`app/challenges/[id]/page.tsx`)**
Dynamic route: reads `id` from `useParams()`, finds the challenge (`challenges.find(...) || challenges[0]` — falls back to CH-1042 for unknown ids). Two columns:
- Left: full brief + dark-green **AI analysis box** (domain, subcategory, impact /100, "12% new duplicate probability", expertise tags)
- Right: lifecycle position ("Matched · waiting for university acceptance") + three `MatchList`s (University / Faculty / Industry) — the explainable matching showcase.

Below: evidence & trust cards + CTA button → `/projects/PR-21`.

**5. `/dashboard` — Government command centre (`app/dashboard/page.tsx`)**
The "see the system" view. 4 KPIs (74 critical, 28 universities, 117 industry offers, 63 implemented) → **animated heatmap**: CSS blobs (`b1`–`b4`) pulsing over a grid background with district labels (Ranchi 301, Bokaro 206, Hazaribagh 174, Dumka 118) — a stylised map, not real GIS. Then AI policy signals (3 emerging systemic issues), partner capacity grid (28 unis / 146 faculty / 47 industry / 11 incubators), the **lifecycle funnel** (progress bars: 1284 submitted → 934 → 612 → 312 → 142 → 41 → 63 implemented — shows "where innovation gets stuck"), impact registry (1.8M reached, −38% response time, 87% evidence, 4.4/5 satisfaction), and a recent queue with mini lifecycles.

**6. `/projects/PR-21` — Project workspace (`app/projects/[id]/page.tsx`)**
The delivery side: "JharWater Pilot" (born from CH-1042). Lifecycle at stage 4 (Pilot). Team pod (3 CSE + 2 ECE students, 1 Environment faculty), 5 milestones (3 done: validated/proposal/prototype; pending: field pilot, impact review), evidence pack (photos/test report/community feedback buttons), partner matches, 3 progress bars for impact targets (households 650/900, incidents −61%, satisfaction 4.4/5), and a dark "Request pilot review" action card whose button fires a `Toast` — one of the few interactive moments.

### 3.5 `app/layout.tsx` + `app/globals.css`
Layout is minimal: imports `globals.css`, sets metadata (title/description), wraps children in `<html><body>`. **All styling lives in `globals.css`**: design tokens (colors, the cream/dark-green palette, lime `--accent-2`), `.card`, `.panel`, `.soft-card`, `.eyebrow` (small caps labels), `.btn` variants, `.kpi-grid`, `.dashboard-grid`, `.split`, `.challenge-grid`, `.heatmap` + `.blob` + `.map-label`, `.match-row`, `.progress`, `.orbit`/`.hub`/`.node`, plus responsive breakpoints for mobile.

---

## Part 4 — Data Flow (how a "story" moves through the app)

1. Citizen story starts at `/report` (form).
2. In the real product, AI would classify/dedup/score it; in the demo, the result is **pre-baked in `lib/mockData.ts`** as CH-1042.
3. `/challenges` lists it; `/challenges/CH-1042` shows its AI brief + matches (hand-set scores from `mockData.ts`).
4. Clicking through lands on `/projects/PR-21` where a team executes it.
5. `/dashboard` shows the aggregate picture (all numbers hardcoded in the page).

**State management:** none beyond local `useState` (report form text, toast booleans). No context, no store, no API calls. Data is imported statically wherever needed.

---

## Part 5 — Design System Cheat-Sheet

- **Palette:** warm cream background, deep forest green panels (AI boxes, next-action card: `#18372d`), lime-green accent (`#b9e86e`, `--accent-2`) — an "editorial civic-innovation" look.
- **Typography:** tight letter-spacing on big headings (`letterSpacing:'-.06em'`), small-caps "eyebrow" labels (`01 · AI problem intelligence`), DM Mono for tiny numerals.
- **Motion language:** everything fades up on scroll (once), cards lift on hover with a spring, blobs and the AI hub pulse continuously — "alive but subtle".
- **Numbered sections** (`01 ·`, `02 ·`…) give the pitch a narrative rhythm.

---

## Part 6 — Known Limitations (be ready for judge Q&A)

1. **Filters/search on `/challenges` are decorative** — not wired to state.
2. **Map is stylised CSS**, not a real map library (production: PostGIS + real tiles).
3. **AI scores are hardcoded** (`match: 94`, `impactScore: 91`) — production: pgvector similarity + ML scoring.
4. **No auth/roles** — citizen vs university vs govt views are all public.
5. **Project page is a single hardcoded project** (`PR-21`); the `[id]` param isn't used to look anything up.
6. `/report` submission doesn't persist or navigate anywhere — intentionally mocked.
7. Minor code-quality notes: very long single-line JSX, `c: any` in `ChallengeCard`, unused `d` variable in milestone map.

---

## Part 7 — 30-Second Pitch Script (for SIH)

> "In Jharkhand, lakhs of civic complaints die in ticket queues. JharSetu turns each complaint into a structured challenge brief using AI — with a human validator before anything is routed. The platform then matches it, *explainably*, to the right university, faculty and industry partner. Teams work in a project workspace with milestones and evidence packs, and the government command centre tracks the full lifecycle from 1,284 submissions to 63 implemented solutions — measuring real impact. We built a working MVP; production runs on Django, PostGIS and pgvector."

---

## Maintenance

This guide describes the code as of the verification run (all 6 routes return 200; `tsc --noEmit` clean). **When you change code, update:** Part 3 (files/pages), Part 4 (data flow), Part 6 (limitations), and the status table in `DOCUMENTATION.md` §7. Ask me in any session and I'll re-verify and refresh both docs after changes.
