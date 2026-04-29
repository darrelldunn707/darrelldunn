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

## Collaboration Defaults

- Before coding, summarize relevant existing behavior and identify affected files.
- Keep changes minimal and aligned with existing project patterns.
- If business logic, public claims, brand direction, or role positioning is unclear, ask before changing it.
- Keep `TODO.md` focused on open work and `CHANGELOG.md` focused on completed work.
