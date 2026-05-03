# Decisions

This file records accepted project decisions that should remain stable unless the project direction changes explicitly.

## Active Decisions

### 001. The demo is fictional

Product Readiness OS is a fictional portfolio work sample. It should not be described as an internal OpenAI tool or as a production system.

### 002. Version 1 uses local TypeScript data plus browser-local session state

The demo should use local TypeScript data files for baseline content. Interactive OpenLoop demo records may use browser-local `localStorage` so the front-end can show ingestion, clustering, routed tasks, and feedback logs without adding backend complexity. Do not add a backend, database, or external API integration unless explicitly requested.

### 003. No authentication in version 1

The demo is a public portfolio work sample. Authentication is out of scope for version 1.

### 004. No confidential branding or internal terminology

The demo may be role-aligned with product engagement work, but it must avoid confidential branding, internal terminology, and claims about private systems.

### 005. The target role is Product Engagement Specialist

Feature, content, and design decisions should support that target role. The demo should emphasize launch readiness, support enablement, partner readiness, risk tracking, feedback classification, routing, and product/engineering insight loops.

### 006. Clear operational UI over flashy animation

The experience should feel modern, warm, professional, and polished. It should prioritize readable operational surfaces over distracting motion or decorative effects.

### 007. Keep documentation at the repo root for now

Root-level Markdown files are enough while the documentation set is small. Add a `docs/` directory only when the root docs become hard to scan or maintain.

### 008. Track completed demo phases in CHANGELOG.md

`TODO.md` should stay focused on active and upcoming work. Completed Product Readiness OS phases should move into `CHANGELOG.md` so the project history remains visible without cluttering active planning.

### 009. Routed tasks are cluster-based

Routed tasks should be generated from meaningful duplicate clusters, not from every individual feedback record. This keeps the demo focused on operational signal management instead of ticket volume.

### 010. Task completion means operational follow-up

When Phase 5 adds task completion, completing a task should mean the assigned follow-up work was completed. It should not imply that the underlying product issue, launch risk, or customer problem is automatically resolved.

### 011. SQLite is a practice artifact until explicitly connected

SQL files under `sql/product-readiness-os/` may be used for local SQLite learning and practice. They are not part of the live Product Readiness OS route and should not be treated as a backend integration unless explicitly promoted later.

### 012. Task completion state stays separate from feedback records

OpenLoop task completion should be stored separately from feedback session records. Feedback records represent ingested feedback. Task completion records represent operational follow-up state for cluster-derived routed tasks.

### 013. OpenLoop provider is the page-wide state boundary

OpenLoop state should flow through `OpenLoopProvider` and `useOpenLoop`, not through direct `localStorage` reads in sibling sections. This keeps browser-local persistence isolated and prepares Launch Readiness, Risks, Support Hub, and Insights for later OpenLoop-derived signal cards.

## Superseded Decisions

None yet.
