# Documentation Checklist

Use this checklist after code, content, design, or demo behavior changes.

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

## Architecture or Data Flow Changed?

Update or review:

- `SPEC.md`
- `DECISIONS.md`
- `README.md`

Check for:

- New persistence behavior
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

Review:

- `TODO.md`

Check for:

- Completed phase work still listed as active
- Partial work that should be marked planned or deferred
- Follow-up work that belongs in backlog

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
