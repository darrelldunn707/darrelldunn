# Darrell Dunn Portfolio Demo

This repo contains a Next.js portfolio demo for a Product Engagement Specialist role. The main work sample is a fictional Product Readiness OS that demonstrates launch readiness, support readiness, risk tracking, feedback classification, routing, routed follow-up work, and product/engineering insights.

This is a fictional work sample. It is not an OpenAI internal tool and should not use confidential OpenAI branding or internal terminology.

## Demo Purpose

Product Readiness OS shows how a Product Engagement Specialist could coordinate a launch across product, engineering, support, partner, and operations teams. The demo emphasizes readiness tracking, feedback intake, deterministic classification, duplicate cluster detection, routed follow-up work, and reviewer-friendly role mapping.

The main route is [`/product-readiness-os`](http://localhost:3000/product-readiness-os).

## Reviewer Path

1. Open `/product-readiness-os` and scan the stakeholder view links.
2. In OpenLoop Feedback Router, click `Seed Sample Launch Feedback`.
3. Review the metrics, duplicate cluster summary, routed tasks, and feedback log.
4. Complete one routed task and confirm the signal cards update while the static readiness, risk, support, and insight data remains unchanged.

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npm run build
```

## Project Structure

- `src/app/` - Next.js app routes and page entry points.
- `src/components/product-readiness-os/` - Product Readiness OS UI components.
- `src/components/product-readiness-os/openloop/` - OpenLoop provider, hook, and Feedback Router cards.
- `src/data/product-readiness-os/` - Local demo data.
- `src/lib/product-readiness-os/` - Demo logic and helpers.
- `src/types/` - Shared TypeScript types.
- `sql/product-readiness-os/` - Optional SQLite practice scripts based on the demo data model.

## Demo Data And Persistence

- Baseline demo content lives in local TypeScript data files.
- The OpenLoop Feedback Router stores live demo session records in browser `localStorage` under `openloopFeedbackSession`.
- OpenLoop task completion state is stored separately in browser `localStorage` under `openloopTaskSession`.
- `localStorage` is demo-only persistence for the live browser session. It is not a backend, database, or production data layer.
- Preset examples and custom feedback ingestion update browser-local session records, metrics, duplicate clusters, routed tasks, and the feedback log.
- Routed tasks are generated from duplicate feedback clusters, not from every individual feedback item.
- Completing a routed task means the operational follow-up was completed inside OpenLoop. It does not mean the underlying product issue was fixed.
- Reset demo data clears the browser-local session.
- No backend, database, authentication, or external API powers the live page.
- The SQLite files under `sql/product-readiness-os/` are local learning and practice scripts only. They are not connected to the live Next.js demo.

## Documentation Map

Current docs:

- `README.md` - Project overview, local commands, structure, and documentation map.
- `AGENTS.md` - Agent/workspace instructions, including Next.js version guidance.
- `BRAND.md` - Current color palette, UI color roles, and brand usage notes.
- `CODEX.md` - Engineering, product, content, and design constraints for Codex work.
- `PORTFOLIO_NOTES.md` - Role target, capability framing, demo concept, and positioning notes.
- `SPEC.md` - Product/demo spec: audience, scope, routes, views, data assumptions, non-goals, and success criteria.
- `CONTENT.md` - Public copy rules: voice, wording boundaries, positioning, role alignment, and claims to avoid.
- `DECISIONS.md` - Accepted project decisions: durable constraints such as local TypeScript data, browser-local demo session state, no auth, no backend in version 1, and no external APIs.
- `TODO.md` - Active work only: current next steps, bugs, and polish tasks.
- `CHANGELOG.md` - Completed work and phase history.
- `DOC_CHECKLIST.md` - Repeatable documentation review workflow for code, content, and demo changes.
- `sql/product-readiness-os/README.md` - Optional SQLite practice database notes and script order.

No additional documentation folders are needed right now. Keep these files at the repo root until the docs become large enough to justify a dedicated `docs/` directory.

## Development Notes

- Read `AGENTS.md` and `CODEX.md` before making code or content changes.
- Use local TypeScript data files for baseline demo content.
- Keep interactive demo state browser-local unless a later phase explicitly introduces a different persistence layer.
- Do not add backend complexity, authentication, or external APIs unless explicitly requested.
- Keep the demo polished, job-aligned, and clear to a non-technical reviewer.
