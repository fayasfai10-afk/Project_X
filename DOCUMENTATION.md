# JharSetu — Project Documentation

> SIH 26043 MVP · AI-powered societal innovation & collaboration platform for Jharkhand
> Last updated: 2026 (see "Keeping this doc current" at the bottom)

---

## 1. What JharSetu is

JharSetu is a **demo-first MVP** built for Smart India Hackathon problem statement **26043**. It solves one core idea:

> A citizen complaint should be the **beginning** of an innovation pipeline, not the end.

Citizens report civic problems → AI structures them into "challenge briefs" → challenges are matched to universities, faculty and industry partners → teams build solutions in project workspaces → the government tracks everything in a command centre until solutions are implemented and measured.

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | File-based routing, fast dev server, easy deployment |
| Language | **TypeScript 5.7** | Type-safe data models (`lib/types.ts`) |
| UI runtime | **React 19** | Component model, hooks |
| Animation | **framer-motion 11** | Scroll reveals, hover springs, animated blobs/hub |
| Icons | **lucide-react 0.468** | Consistent iconography |
| Charts (installed, sparsely used) | **recharts 2.15** | Available for dashboard visualisations |
| Styling | **Plain CSS + CSS variables + inline styles** (`app/globals.css`) | Custom editorial "civic-innovation" design system, zero CSS framework dependency |
| Data | **Static mock data** (`lib/mockData.ts`) | Intentional: demo uses client-side mock layer |
| Backend (planned) | Django REST + PostgreSQL/PostGIS + pgvector + Python AI services | Documented production target, not implemented |

**No auth, no database, no API routes** — every interaction is mocked client-side for the hackathon demo.

---

## 3. Project Structure

```
Project_X/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout, <html>/<body>, metadata
│   ├── globals.css               # Whole design system (CSS variables, cards, heatmap, buttons…)
│   ├── page.tsx                  # "/"  Landing page (hero, orbit diagram, AI showcase, lifecycle, outcomes)
│   ├── report/page.tsx           # "/report"  Citizen intake form (challenge submission)
│   ├── challenges/
│   │   ├── page.tsx              # "/challenges"  Challenge network / discovery grid
│   │   └── [id]/page.tsx         # "/challenges/CH-1042"  Dynamic challenge detail (AI analysis + matching)
│   ├── dashboard/page.tsx        # "/dashboard"  Government command centre (KPIs, heatmap, funnel)
│   └── projects/[id]/page.tsx    # "/projects/PR-21"  Project workspace (team, milestones, evidence)
├── components/
│   └── ui.tsx                    # Shared UI components (see §4)
├── lib/
│   ├── types.ts                  # Challenge, Partner, ChallengeStatus, Priority types
│   └── mockData.ts               # 5 seeded challenges + university/faculty/industry partner lists
├── next.config.ts / tsconfig.json / package.json
└── preview.html                  # Static preview artefact
```

**Path alias:** `@/*` → project root (e.g. `import { challenges } from '@/lib/mockData'`).

---

## 4. Shared Components (`components/ui.tsx`)

| Component | Purpose |
|---|---|
| `Reveal` | framer-motion wrapper — fades/slides content in on scroll (`whileInView`, once) |
| `SiteNav` | Top navigation bar with links + "Explore demo" / "Report challenge" CTAs |
| `PriorityBadge` | Colour-coded badge for Critical / High / Medium / Low (class = lowercase priority) |
| `StatKpi` | KPI card (label, big value, delta caption) |
| `ChallengeCard` | Animated card for the challenge grid — priority badge, id, title, district, impact score, report count, link to detail |
| `MatchList` | "Best-fit partners" panel — renders `Partner[]` with match % and explainable reasons |
| `Lifecycle` | Horizontal step indicator for the 7-stage lifecycle (Submitted → Implemented) with `active` index |
| `Toast` | Temporary confirmation message (e.g. "Review request sent") |
| `TrustStrip` | Trust/community-validation messaging on the report form |

---

## 5. Data Model (`lib/types.ts`)

### Challenge
`id, title, summary, domain, subcategory, district, location, lat, lng, status, priority, impactScore, affectedPeople, reports, verified, submittedBy, createdAt, expertise[], tags[]`

- **ChallengeStatus** (lifecycle order): `Submitted → Validated → Matched → University Accepted → Prototype → Pilot → Implemented`
- **Priority**: `Critical | High | Medium | Low`

### Partner
`id, name, kind ('University' | 'Industry' | 'Faculty'), match (0–100), reason[] (explainability), capabilities[]`

### Seed data (`lib/mockData.ts`)
- **5 challenges** across Jharkhand districts: Dumka (water, impact 91), Ranchi (infrastructure, 86), Hazaribagh (agriculture, 82), West Singhbhum (education, 76), Bokaro (environment, 69) — each with lat/lng for the map story.
- **3 university partners** (BIT Mesra, CUJ, Ranchi University), **2 faculty**, **3 industry** (AquaSense Labs, GramTech, Metrica) — all with % match and human-readable "why" reasons.

---

## 6. Pages — What Each Does

| Route | Role | Key elements |
|---|---|---|
| `/` | Public landing | Hero, "missing bridge" orbit diagram (Citizen/University/Industry/Government around AI hub), AI analysis showcase for CH-1042, matching explainer, 6-step lifecycle, outcome registry (41 pilots, 12 patents, 8 startups) |
| `/report` | Citizen intake | Title, free-text description, location + map button, people affected, urgency, optional category, evidence upload (mocked), trust strip, "AI is advisory until human validation" note |
| `/challenges` | Challenge network | Search + Priority/District/Domain filter bar (visual only), grid of `ChallengeCard`s |
| `/challenges/[id]` | Challenge detail | Full summary, AI analysis box (domain, subcategory, impact score, duplicate probability, expertise tags), lifecycle position, University/Faculty/Industry `MatchList`s, evidence & trust, CTA → project workspace |
| `/dashboard` | Govt command centre | 4 KPIs, animated district "heatmap" (Dumka 118 / Ranchi 301 / Bokaro 206 / Hazaribagh 174), AI policy signals (systemic issues), partner capacity counts, lifecycle funnel (1284 submitted → 63 implemented), impact registry, recent challenge queue |
| `/projects/PR-21` | Project workspace | "JharWater Pilot" born from CH-1042; lifecycle at stage 4; team pod (CSE/ECE/Environment), milestones checklist, evidence pack, partner matches, impact-target progress bars, "Send for review" action with toast |

---

## 7. Runtime Verification (2026)

Server: `npm run dev` (Next.js 15.5.25, ready in ~2.5 s, port 3000).

| Route | Status |
|---|---|
| `/` | 200 ✅ |
| `/challenges` | 200 ✅ |
| `/challenges/CH-1042` | 200 ✅ |
| `/dashboard` | 200 ✅ |
| `/projects/PR-21` | 200 ✅ (fixed — was 500) |
| `/report` | 200 ✅ (fixed — was 500) |

### Bug fix applied
`app/projects/[id]/page.tsx` was missing a closing `</div>` for the `<div className="container">` wrapper (a stray div in the impact-target block), causing `TS17008` and an HTTP 500 on both `/projects/PR-21` and `/report`. An extra `</div>` was added before `</main>`. `npx tsc --noEmit` now passes clean.

---

## 8. Production Roadmap (from README / repo intent)

Replace the mock layer with:
1. **Django REST Framework** API (challenges, partners, projects, validators)
2. **PostgreSQL + PostGIS** for geo queries (district heatmaps, proximity matching)
3. **pgvector** for AI embedding-based deduplication and semantic matching
4. **Python AI services** for classification, priority/impact scoring, duplicate detection
5. **Object storage** for evidence photos/videos

---

## Keeping this doc current

This documentation was generated from the codebase as of the run recorded in §7. Whenever code in `app/`, `components/`, or `lib/` changes, update §3–§7 accordingly (routes, components, data model, verification table).
