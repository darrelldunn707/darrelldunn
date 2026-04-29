# Codex Instructions

This project is a personal portfolio demo for a Product Engagement Specialist role.

## Priorities

1. Keep the demo polished and job-aligned.
2. Use local TypeScript data files for baseline demo content and browser-local state for approved live demo behavior.
3. Do not add backend complexity unless explicitly asked.
4. Do not add authentication.
5. Do not use external APIs in version 1.
6. Do not claim this is an OpenAI internal tool.
7. Do not use confidential OpenAI branding or internal terminology.
8. Do not mention AI workflow consulting.
9. Prefer clear operational UI over flashy animation.
10. Keep components organized and reusable.

## Design Direction

- Modern
- Warm
- Professional
- Full-width sections
- Card-based dashboard layout
- Common sans-serif font
- No distracting animations
- No robot imagery
- Avoid navy/gray-heavy styling

## Product Direction

The demo should show:

- Launch readiness
- Support readiness
- Risk tracking
- Feedback taxonomy
- Severity classification
- Routing to owners
- Cluster-derived routed tasks
- Product and engineering insights
- External partner view vs internal team view

## Documentation Rules

Keep documentation aligned with the live demo.

Update or recommend updates when changes affect:

- Navigation labels or section names
- Product behavior
- Data model or persistence
- Demo phases
- User-facing copy
- Visual design system
- Scope boundaries
- Role positioning
- Local setup or validation commands

Use this ownership map:

- `README.md` - orientation, setup, project structure, and documentation map
- `SPEC.md` - current product behavior, demo scope, data assumptions, and success criteria
- `DECISIONS.md` - durable choices that should not drift casually
- `TODO.md` - active work and backlog only
- `CHANGELOG.md` - completed phases and notable shipped changes
- `BRAND.md` - colors, visual roles, and design language
- `CONTENT.md` - wording, claims, tone, and public-facing constraints
- `PORTFOLIO_NOTES.md` - role alignment and portfolio strategy
- `DOC_CHECKLIST.md` - repeatable documentation review checklist for implementation passes

## Phase Tracking

- Use `CHANGELOG.md` for completed phases.
- Use `TODO.md` for active and future phases.
- Do not leave completed work in `TODO.md`.
- If a phase is partially implemented, document it clearly as partial, planned, or deferred.

## Documentation Response Format

After implementation work, include documentation follow-through in the final response:

- Updated: documentation changed in the task
- Recommended: documentation updates that should be considered next
- Not needed: documentation areas reviewed that do not need changes
