# TASKS.md

This file is the active task queue for the repo.

Agents should use this file to determine what to work on next. Do not start implementation unless a task is marked `READY_FOR_BUILD`. Do not mark a task `DONE` until implementation, QA, and documentation follow-through are complete.

## Status Legend

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

## Task Selection Rule

Agents should work on the first task in `Active Task Queue` that matches their role and current status.

Agents should not pull from `Backlog` unless the human explicitly promotes a backlog item into the active queue.

---

## Active Task Queue

### T-001 — Agent Workflow Smoke Test

Status: `READY_FOR_QA`

Owner: `QA / Verifier Agent`

Priority: High

Project area: Repo workflow

Selected smoke-test task:

Add a short `Agent Workflow Quick Start` section to `README.md` that tells future agents how to use `AGENTS.md`, `TASKS.md`, and `HANDOFF.md` before starting work. Also update the README documentation map so `TASKS.md` and `HANDOFF.md` are discoverable alongside `AGENTS.md`.

Purpose:

Verify that the repo workflow can move one small, documentation-only change through:

`Spec Agent → Builder Agent → QA / Verifier Agent → Docs Agent`

Relevant existing behavior:

- `AGENTS.md` defines role responsibilities, status flow, start rules, handoff rules, scope control, validation defaults, and documentation follow-through.
- `TASKS.md` is the active status board and currently keeps Human Review Learning Loop v1 in backlog.
- `HANDOFF.md` is the latest baton pass between agents.
- `README.md` has a documentation map, but it does not yet list `TASKS.md` or `HANDOFF.md`.
- `README.md` development notes currently mention reading `AGENTS.md` and `CODEX.md`, but not the task/handoff loop.

Affected files:

- `README.md` — Builder should add the small workflow quick-start and add `TASKS.md` / `HANDOFF.md` to the documentation map.
- `TASKS.md` — Builder should update `T-001` to `BUILD_IN_PROGRESS` when starting and `READY_FOR_QA` when the README update is complete.
- `HANDOFF.md` — Builder must update the current handoff before ending work.

Acceptance criteria:

- `README.md` includes a concise `Agent Workflow Quick Start` section.
- The new README section tells agents to read `AGENTS.md`, use `TASKS.md` for the first matching active task/status cue, and use `HANDOFF.md` for the latest baton pass.
- The README documentation map includes `TASKS.md` and `HANDOFF.md`.
- The wording preserves the human-led workflow: the human/product owner chooses direction and agents do not pull from backlog without promotion.
- No app code, route behavior, UI, persistence, SQL, dependencies, or public product claims are changed.
- `TASKS.md` and `HANDOFF.md` are updated with the correct Builder status and handoff.
- Human Review Learning Loop v1 remains in backlog.

Non-goals:

- Do not implement Human Review Learning Loop v1.
- Do not change app behavior.
- Do not edit Product Readiness OS UI, data, routes, SQL, or `localStorage` behavior.
- Do not add dependencies or automation/orchestration scripts.
- Do not rename routes, sections, files, statuses, agent roles, or product concepts.
- Do not move documentation into a `docs/` directory.
- Do not change public positioning, role framing, visual design, or demo claims.

Validation expected:

- Builder: docs-only review of `README.md`, `TASKS.md`, and `HANDOFF.md`.
- Builder: run `git diff --check -- README.md TASKS.md HANDOFF.md`.
- QA / Verifier Agent: confirm README changes satisfy acceptance criteria, status flow is correct, handoff is complete, and no out-of-scope files were changed by the smoke-test task.
- Docs Agent: after QA passes, review `DOC_CHECKLIST.md`, reconcile documentation follow-through, and mark `T-001` `DONE` only if no implementation follow-up remains.

Documentation impact:

- `README.md` must be updated because the change affects project documentation orientation and workflow discoverability.
- `TASKS.md` must be updated as the task moves through statuses.
- `HANDOFF.md` must be updated after each agent step.
- `DOC_CHECKLIST.md` should be reviewed by the Docs Agent before closeout.
- `CHANGELOG.md` is not required for the Builder step because no app behavior or named product phase ships; Docs Agent may decide whether a small workflow/process entry is useful before marking `DONE`.
- `SPEC.md`, `DECISIONS.md`, `CONTENT.md`, `BRAND.md`, and `PORTFOLIO_NOTES.md` should not need updates unless the Builder changes scope beyond this README workflow note.

Open questions:

- None blocking. This task is intentionally small and documentation-only.

Next agent:

- QA / Verifier Agent

---

## Backlog

### B-001 — Human Review Learning Loop v1

Status: `BACKLOG`

Project area: Product Readiness OS / OpenLoop Feedback Router

Goal:

Add a visible Human Review Learning Loop section that shows how low-confidence, severe, or review-recommended feedback enters human review and how approved overrides can influence future similar feedback.

Notes:

- Desired placement: after `Routing Decision Trail` and before `Dedupe + Trend Cluster`.
- Human review rate should be visible as a metric.
- Duplicate or similar manual entries should be able to reflect changed behavior after an override.
- Keep this as demo behavior unless explicitly approved as a full admin workflow.

Potential acceptance criteria:

- Human Review section appears in the approved location.
- Review-needed feedback is calculated from approved review rules.
- Review rate updates from ingested feedback.
- Manual override can influence future similar feedback.
- Duplicate/similar entry behavior can be demonstrated.
- No task completion behavior is added.
- No unrelated layout changes are introduced.
- Documentation is updated if behavior, metrics, persistence, or phase status changes.

Potential non-goals:

- Do not build a full production moderation/admin system.
- Do not add complex permissions.
- Do not introduce a real database if the current demo remains local/session-based.
- Do not rename existing sections unless approved.

Needs human/spec decision:

- Exact review rules.
- Exact override behavior.
- Whether override persistence should survive reset.
- Whether this should be a named phase or smaller build slice.

---

## Completed Tasks

No completed tasks yet.
