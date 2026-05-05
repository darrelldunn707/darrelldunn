<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Documentation Follow-Through

After any code or content change, check whether documentation should be updated.

At minimum, review these files when relevant:

- `README.md` - project overview, docs map, setup, and structure
- `SPEC.md` - product/demo behavior, scope, data model, and success criteria
- `DECISIONS.md` - durable direction and constraints
- `TODO.md` - active or upcoming work only
- `CHANGELOG.md` - completed work and phase history
- `BRAND.md` - visual design, palette, and UI color roles
- `CONTENT.md` - public copy rules and wording boundaries
- `PORTFOLIO_NOTES.md` - role framing and positioning
- `DOC_CHECKLIST.md` - repeatable documentation review workflow

When code changes pass validation, include a Documentation Recommendations section in the final response.

Use this format:

- Updated: files changed during this task
- Recommended: docs that should be updated next, with why
- Not needed: when no documentation update is required

Do not silently skip documentation review after implementation work.

## Implementation Documentation Gate

For any code, content, UI, data, SQL, or public-readiness implementation, documentation follow-through must happen before the task is considered complete.

If the implementation is named as a phase, pass, milestone, or public-readiness slice, update `CHANGELOG.md` in the same task. Do not leave that update as a recommendation unless the user explicitly requested code-only or docs-deferred work.

After implementation and before the final response:

1. Review `DOC_CHECKLIST.md`.
2. Update docs in the same task when the implementation changes completed behavior, public copy, route structure, data flow, setup, validation, phase status, or public-readiness posture.
3. Always reconcile:
   - `CHANGELOG.md` for completed work shipped in this task.
   - `TODO.md` for work that remains open, planned, deferred, or no longer active.
   - `DECISIONS.md` when the implementation settles or changes a durable constraint.
   - `SPEC.md` when behavior, metrics, persistence keys, state ownership, or demo scope changes.
4. Do not leave completed implementation work only as a recommendation when the docs are already known to be stale.
5. If docs truly do not need changes, say what was reviewed and why no update was needed.

## Collaboration Defaults

- Before coding, summarize relevant existing behavior and identify affected files.
- Keep changes minimal and aligned with existing project patterns.
- If business logic, public claims, brand direction, or role positioning is unclear, ask before changing it.
- Keep `TODO.md` focused on open work and `CHANGELOG.md` focused on completed work.
