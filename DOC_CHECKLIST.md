# Documentation Checklist

Use this checklist before and after code, content, design, or demo behavior changes.

## Documentation Preflight

Before coding, identify whether the task is likely to affect:

- Product behavior, metrics, or demo scope
- User-facing copy, labels, public claims, or role framing
- Demo phase status, completed work, deferred work, or backlog
- Data flow, state ownership, persistence keys, or architecture
- Setup, validation commands, reviewer path, routes, or project structure
- Visual design, palette usage, UI color roles, or reusable visual patterns

If any item applies and the prompt does not explicitly defer docs, plan the relevant documentation updates as part of the implementation.

Use recommendations instead of direct updates only when the prompt says not to edit docs, the impact is uncertain, the update requires product judgment, or the change is large enough to deserve a separate pass.

## Mandatory Documentation Triggers

Update:

- `CHANGELOG.md` when completed implementation work ships, especially named phases, passes, milestones, or public-readiness slices.
- `SPEC.md` when product behavior, metrics, persistence keys, state ownership, data assumptions, demo scope, success criteria, or route behavior changes.
- `DECISIONS.md` when durable constraints, non-goals, accepted direction, role-positioning rules, or architecture boundaries change.
- `TODO.md` when active work, backlog, deferred work, phase status, or completed work tracking changes.
- `README.md` when setup, validation commands, project structure, route structure, reviewer path, documentation map, or public orientation changes.
- `CONTENT.md` when user-facing copy, labels, public claims, tone, role framing, or wording boundaries change.
- `BRAND.md` when visual design, palette usage, UI color roles, layout patterns, or reusable visual treatments change.

## Product Behavior Changed?

Update or review:

- `SPEC.md`
- `CHANGELOG.md`
- `TODO.md`

Check for:

- New or changed demo behavior
- Changed metrics, labels, sections, or interactions
- Changes that affect phase history, session persistence, routed task generation, or task completion meaning
- Completed work that should move out of `TODO.md`
- Named phases, passes, or milestones that must be added to `CHANGELOG.md` in the same task

## Architecture or Data Flow Changed?

Update or review:

- `SPEC.md`
- `DECISIONS.md`
- `README.md`

Check for:

- New persistence behavior
- New or changed `localStorage` keys
- New data sources or data ownership
- New local state or browser-local session behavior
- Any change that affects setup, scope, or constraints

## UI Labels, Navigation, or Sections Changed?

Update or review:

- `SPEC.md`
- `CONTENT.md`
- `CHANGELOG.md`

Check for:

- Navigation labels
- Section ids and visible section names
- Public-facing wording
- Role alignment and reviewer clarity

## Visual Design Changed?

Update or review:

- `BRAND.md`
- `CHANGELOG.md`

Check for:

- Color usage
- Card, table, layout, or section styling
- New visual patterns that should become reusable guidance

## Completed Phase or Milestone?

Update:

- `CHANGELOG.md`
- `TODO.md`

Review:

- `SPEC.md`
- `DECISIONS.md`

Check for:

- Completed phase work still listed as active
- Partial work that should be marked planned or deferred
- Follow-up work that belongs in backlog
- Completed named phase work missing from `CHANGELOG.md`
- Behavior, metrics, persistence, state ownership, data flow, or architecture changes that belong in `SPEC.md` or `DECISIONS.md`

Before final response, verify:

- Completed work from this task is recorded in `CHANGELOG.md`.
- New behavior, metrics, persistence keys, state ownership, or demo-scope changes are recorded in `SPEC.md`.
- Future or deferred work is in `TODO.md`, not `CHANGELOG.md`.
- `TODO.md` does not still list work completed by this task.
- `DECISIONS.md` does not describe implemented behavior as future/planned.

## New Boundary or Constraint?

Update:

- `DECISIONS.md`
- `CODEX.md`

Check for:

- New non-goals
- New implementation boundaries
- New wording or positioning rules
- Any decision future assistants should not revisit casually

## Final Response Documentation Review

After implementation work, include:

- Updated: docs changed during this task
- Recommended: docs to consider next, with why
- Not needed: docs reviewed that do not need changes

If no documentation update is needed, say so clearly instead of skipping the review.
