# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Agent Operating Rules

This repo uses a human-led, multi-agent workflow.

Agents should not free-roam, invent features, or make broad product decisions unless explicitly asked. Work should move through clear task statuses, handoffs, verification, and documentation follow-through.

## Coordination and Reference Files

### Primary coordination files

These files control agent workflow and task handoff:

- `AGENTS.md` — root agent rules, workflow, documentation requirements, and response requirements
- `TASKS.md` — active task queue, statuses, owners, acceptance criteria, and next agent cues
- `HANDOFF.md` — latest handoff from one agent to the next

### Project source-of-truth docs

Agents should check these when the task affects product behavior, architecture, scope, setup, or completed work:

- `README.md` — project overview, setup, route structure, docs map, and reviewer path
- `SPEC.md` — product/demo behavior, scope, data model, metrics, and success criteria
- `DECISIONS.md` — durable architecture, non-goals, boundaries, and positioning decisions
- `TODO.md` — open, planned, active, or deferred work only
- `CHANGELOG.md` — completed work, shipped phases, milestones, and public-readiness slices
- `DOC_CHECKLIST.md` — repeatable documentation review workflow

### Public-facing and presentation docs

Agents should check these when the task affects copy, branding, visual design, role framing, or public-facing positioning:

- `CONTENT.md` — public-facing wording, claims, labels, tone, and role framing
- `BRAND.md` — visual design, palette, typography, UI color roles, and reusable visual patterns
- `PORTFOLIO_NOTES.md` — portfolio framing, role alignment, and public positioning

### Agent/tool-specific docs

Agents should check these when relevant to implementation rules, Codex behavior, protected files, or repo-specific automation:

- `CODEX.md` — Codex-specific rules, protected files, tool expectations, and implementation boundaries

## Agent Roles

### Human / Product Owner

The human is the final decision-maker.

Responsibilities:

- Approves product direction, scope, and tradeoffs.
- Resolves ambiguity around business logic, role positioning, public claims, or user-facing behavior.
- Approves major architecture changes, durable non-goals, and feature scope changes.
- Decides when a task is important enough to become a named phase, pass, milestone, or public-readiness slice.

Agents should ask before changing product direction, public positioning, durable architecture, or major demo behavior.

### Spec Agent

Use for planning before implementation.

Responsibilities:

- Convert rough feature requests into clear build specs.
- Identify affected files, behavior, data/state changes, metrics, docs, and validation.
- Define acceptance criteria.
- Define non-goals.
- Update `TASKS.md` status to `READY_FOR_BUILD` only when the task is build-ready.
- Write a concise handoff in `HANDOFF.md`.

Restrictions:

- Do not implement code unless explicitly asked.
- Do not change public positioning or durable architecture without approval.

### Builder Agent

Use for implementation.

Responsibilities:

- Start only on tasks marked `READY_FOR_BUILD`.
- Implement the approved task only.
- Keep changes minimal and aligned with existing project patterns.
- Preserve existing section names, route structure, state ownership, and visual hierarchy unless the task explicitly changes them.
- Update relevant docs in the same pass when documentation triggers apply.
- Update `TASKS.md` to `READY_FOR_QA` when complete.
- Update `HANDOFF.md` with changed files, behavior, validation, docs, risks, and next recommended agent.

Restrictions:

- Do not add unrelated improvements.
- Do not rename sections, routes, files, or concepts unless explicitly requested.
- Do not introduce new dependencies without approval.
- Do not mark a task `DONE`; QA/docs completion closes the loop.

### QA / Verifier Agent

Use after implementation.

Responsibilities:

- Start only on tasks marked `READY_FOR_QA`.
- Verify implementation against acceptance criteria.
- Check for regressions, layout drift, behavior mismatches, broken state, stale docs, and unnecessary complexity.
- Run or recommend appropriate validation.
- Mark the task `QA_PASSED` or `QA_FAILED`.
- If failed, list specific required fixes.
- Update `HANDOFF.md` with QA results.

Restrictions:

- Do not add new features.
- Do not refactor unless explicitly asked.
- Do not silently “fix” product behavior without saying what changed.

### Fix Agent

Use only after QA failure.

Responsibilities:

- Start only on tasks marked `QA_FAILED` or `READY_FOR_FIX`.
- Fix only the issues listed in the QA report.
- Avoid opportunistic refactors.
- Update `TASKS.md` back to `READY_FOR_QA`.
- Update `HANDOFF.md` with fix summary, changed files, validation, and remaining risks.

Restrictions:

- Do not expand task scope.
- Do not reinterpret the original feature unless the QA report reveals a real ambiguity.

### Docs Agent

Use after QA passes or when documentation needs focused cleanup.

Responsibilities:

- Start on tasks marked `QA_PASSED` or `READY_FOR_DOCS`.
- Update required docs based on documentation triggers.
- Keep `TODO.md` focused on open work.
- Keep `CHANGELOG.md` focused on completed work.
- Mark task `DONE` only when docs are reconciled and no implementation follow-up is required.

Restrictions:

- Do not change app behavior.
- Do not invent completed work.
- Do not remove TODO items unless they are completed, deferred, duplicated, or no longer active.

## Task Status Workflow

Use these statuses in `TASKS.md`:

- `BACKLOG` — captured but not ready
- `READY_FOR_SPEC` — needs planning/specification
- `SPEC_IN_PROGRESS` — spec agent is working
- `READY_FOR_BUILD` — approved and ready for implementation
- `BUILD_IN_PROGRESS` — builder agent is working
- `READY_FOR_QA` — implementation complete and ready for verification
- `QA_IN_PROGRESS` — verifier agent is reviewing
- `QA_FAILED` — verifier found issues
- `READY_FOR_FIX` — fix agent can begin
- `QA_PASSED` — verifier approved behavior
- `READY_FOR_DOCS` — docs need final reconciliation
- `DONE` — task is complete, validated, and documented
- `BLOCKED` — cannot continue without human decision

Default flow:

```txt
READY_FOR_SPEC
→ SPEC_IN_PROGRESS
→ READY_FOR_BUILD
→ BUILD_IN_PROGRESS
→ READY_FOR_QA
→ QA_IN_PROGRESS
→ QA_PASSED or QA_FAILED
→ READY_FOR_DOCS
→ DONE
```

If QA fails:

```txt
QA_FAILED
→ READY_FOR_FIX
→ READY_FOR_QA
→ QA_IN_PROGRESS
```

## Start Rules

Before beginning any work, every agent must:

1. Read `AGENTS.md`.
2. Read `TASKS.md`.
3. Read `HANDOFF.md` if the task is not brand new.
4. Read relevant docs based on the task type.
5. Identify the first task matching the agent role and status.
6. Confirm scope, affected files, documentation impact, and validation plan.
7. Ask the human if product behavior, public claims, architecture, or scope is unclear.

Do not begin implementation if the task is vague.

## Handoff Rules

Every agent must update `HANDOFF.md` before ending work.

A handoff must include:

- Current status
- Agent role completed
- Task ID and task name
- Files changed
- Behavior changed
- Behavior intentionally not changed
- Validation run
- Documentation follow-through
- Risks / open questions
- Next recommended agent

The next agent should use `HANDOFF.md` as the starting point.

Agents do not automatically know when another agent is done. The cue is the task status in `TASKS.md` and the latest handoff in `HANDOFF.md`.

## Scope Control

Agents must stay inside the approved task.

Do not:

- Add “while I was here” improvements.
- Rename sections or concepts without approval.
- Add new packages without approval.
- Change public claims without approval.
- Convert demo persistence or state ownership without approval.
- Move sections, alter routes, or restructure files unless explicitly required.
- Create large abstractions before the existing behavior justifies them.
- Remove comments, docs, or TODOs unless they are clearly obsolete and explained.

When in doubt, ask.

## Protected Behavior Defaults

Unless a task explicitly says otherwise:

- Preserve existing route structure.
- Preserve existing section names.
- Preserve existing user-facing labels.
- Preserve existing visual hierarchy.
- Preserve existing localStorage/session behavior.
- Preserve existing demo phase boundaries.
- Preserve existing docs map and project structure.
- Do not add task completion behavior.
- Do not introduce a real database if the current demo behavior is local/session-based.
- Do not use the visible UI term “database” unless already approved.

## Validation Defaults

Use validation appropriate to the task.

Common validation examples:

- `npm run build`
- `npm run lint`
- route/page smoke test
- local manual browser test
- state persistence reset/reload test
- preset data ingestion test
- duplicate-entry behavior test
- SQL/query validation where relevant
- docs-only review when no code changed

If validation cannot be run, say why and recommend the exact command or manual check.

## Documentation Follow-Through

After any code or content change, check whether documentation should be updated.

## Documentation Preflight

Before implementation, identify whether the change is likely to affect:
- product behavior,
- user-facing copy,
- data model or persistence,
- metrics,
- phase history,
- architecture,
- public repo positioning.

If yes, plan the documentation update as part of the implementation unless the user explicitly asks for code-only work.

## Documentation Update Requirement

When an implementation changes product behavior, user-visible copy, demo phase status, data flow, state persistence, metrics, or architecture, update the relevant documentation in the same pass unless the prompt explicitly says not to edit docs.

When the required documentation update is obvious and small, make the update directly.

Use recommendations only when:
- the documentation impact is uncertain,
- the update would require product judgment,
- the user explicitly requested code-only changes,
- or the documentation change is large enough to deserve a separate pass.

Mandatory documentation triggers:

- Update `CHANGELOG.md` when completed work ships, especially named phases, passes, milestones, or public-readiness slices.
- Update `SPEC.md` when behavior, metrics, persistence keys, state ownership, data assumptions, demo scope, or success criteria change.
- Update `DECISIONS.md` when a durable boundary, non-goal, architecture constraint, or positioning rule changes.
- Update `TODO.md` when work is completed, deferred, added, removed, or no longer active.
- Update `README.md` when setup, route structure, project structure, reviewer path, or docs map changes.
- Update `CONTENT.md` when public-facing wording, claims, tone, labels, or role framing changes.
- Update `BRAND.md` when visual design, palette usage, UI color roles, or reusable visual patterns change.

When a named phase is completed, update `CHANGELOG.md` and reconcile `TODO.md`; review `SPEC.md` and `DECISIONS.md` if behavior or architecture changed.

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


Do not silently skip documentation review after implementation work.

## Implementation Documentation Gate

For any code, content, UI, data, SQL, or public-readiness implementation, documentation follow-through must happen before the task is considered complete.

If the implementation is named as a phase, pass, milestone, or public-readiness slice, update `CHANGELOG.md` in the same task. Do not leave that update as a recommendation unless the user explicitly requested code-only or docs-deferred work.

After implementation and before the final response:

1. Review `DOC_CHECKLIST.md`.
2. Update docs in the same task when the implementation changes completed behavior, public copy, route structure, data flow, setup, validation, phase status, or public-readiness posture.
3. Always reconcile when triggered:
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
