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

Before coding, identify whether the task is likely to affect documentation. If product behavior, user-facing copy, demo phase status, data flow, state persistence, metrics, architecture, setup, validation, visual design, or role positioning may change, include the likely documentation updates in the implementation plan.

## Documentation Update Requirement

When an implementation changes product behavior, user-visible copy, demo phase status, data flow, state persistence, metrics, or architecture, update the relevant documentation in the same pass unless the prompt explicitly says not to edit docs.

When the required documentation update is obvious and small, make the update directly.

Use recommendations only when:
- the documentation impact is uncertain,
- the update would require product judgment,
- the user explicitly requested code-only changes,
- or the documentation change is large enough to deserve a separate pass.

## Mandatory Documentation Triggers

Update `CHANGELOG.md` when:
- a phase, milestone, or named feature is completed,
- a meaningful user-visible behavior ships,
- a refactor materially improves public repo quality,
- metrics, workflows, or demo interactions change.

Update `SPEC.md` when:
- product behavior changes,
- metrics are added or redefined,
- localStorage/session behavior changes,
- routing, clustering, review, task, or completion logic changes,
- acceptance criteria or demo scope changes.

Update `DECISIONS.md` when:
- a durable architecture choice is made,
- a non-goal is established,
- a product meaning needs to stay consistent,
- a future assistant should not casually reverse a decision.

Update `TODO.md` when:
- a phase is completed,
- an active work item becomes done,
- a backlog item becomes active,
- or a planned item is intentionally deferred.

Update `README.md` when:
- setup changes,
- the project structure changes materially,
- the public demo scope changes,
- or a reviewer needs new orientation to understand the repo.

Update `CONTENT.md` when:
- public-facing claims, labels, section wording, or positioning rules change.

Update `BRAND.md` when:
- visual system, color roles, layout conventions, or reusable UI patterns change.

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
- If a named phase, pass, milestone, or public-readiness slice is completed, update `CHANGELOG.md` and reconcile `TODO.md` in the same implementation task.
- If the completed phase changes behavior, metrics, persistence keys, state ownership, data flow, architecture, or demo scope, review and update `SPEC.md` and `DECISIONS.md` as needed in the same task.

## Implementation Closeout

When implementation changes pass validation, update phase-tracking docs before finalizing the task:

- Add completed implementation work to `CHANGELOG.md`.
- Add new or changed product behavior, metrics, state, persistence keys, and scope boundaries to `SPEC.md`.
- Move planned, deferred, or still-open work to `TODO.md`.
- Remove completed work from `TODO.md`.
- Update `DECISIONS.md` when wording like "planned," "future," or "when this is added" no longer matches implemented behavior.
- Update `DECISIONS.md` when a durable boundary is introduced, such as separating session state types or clarifying what an action does not mean.
- Do this as part of the implementation patch, not only as a final recommendation.
- Recommendations are still allowed when docs are explicitly deferred, the documentation impact is uncertain, the update requires product judgment, or the documentation change is large enough to deserve a separate pass.

## Final Response Requirements

Every implementation response must include:

1. Files changed
2. Behavior changed
3. Validation run
4. Documentation follow-through

Documentation follow-through must use:

- Updated: docs changed in this pass
- Recommended: docs that still need review, with why
- Not needed: docs reviewed and why no update was needed

If documentation should have changed but was not changed because the prompt prohibited it, say that explicitly.
