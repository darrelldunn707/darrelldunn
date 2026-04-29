# Darrell Dunn Portfolio Demo

This repo contains a Next.js portfolio demo for a Product Engagement Specialist role. The main work sample is a fictional Product Readiness OS that demonstrates launch readiness, support readiness, risk tracking, feedback classification, routing, routed follow-up work, and product/engineering insights.

This is a fictional work sample. It is not an OpenAI internal tool and should not use confidential OpenAI branding or internal terminology.

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
- `src/data/product-readiness-os/` - Local demo data.
- `src/lib/product-readiness-os/` - Demo logic and helpers.
- `src/types/` - Shared TypeScript types.
- `public/` - Static assets.

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

No additional documentation folders are needed right now. Keep these files at the repo root until the docs become large enough to justify a dedicated `docs/` directory.

## Development Notes

- Read `AGENTS.md` and `CODEX.md` before making code or content changes.
- Use local TypeScript data files for baseline demo content.
- Keep interactive demo state browser-local unless a later phase explicitly introduces a different persistence layer.
- Do not add backend complexity, authentication, or external APIs unless explicitly requested.
- Keep the demo polished, job-aligned, and clear to a non-technical reviewer.
