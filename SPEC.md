# Product Readiness OS Spec

## Purpose

Product Readiness OS is a fictional portfolio work sample for a Product Engagement Specialist role. It shows how launch readiness, support enablement, risk tracking, feedback routing, and product/engineering insight workflows can fit together in one operating surface.

The demo should make the role capabilities visible to a reviewer without requiring private context, external systems, or live customer data.

## Audience

- Hiring teams evaluating product engagement, product operations, support readiness, and cross-functional launch coordination skills.
- Non-technical reviewers who need to understand the operating model quickly.
- Technical reviewers who may inspect the implementation quality.

## Scenario

- Product: Product Readiness OS
- Fictional launch: Enterprise Knowledge Connector Beta
- Launch phase: Beta readiness review
- Launch date in demo data: May 21, 2026
- Target audience in demo data: Enterprise admins, partner success teams, and pilot support teams

This is a fictional work sample. It is not an OpenAI internal tool.

## Routes

- `/` - Portfolio entry page with a short description and link to the demo.
- `/product-readiness-os` - Main Product Readiness OS work sample.

## Main Views

1. External Partner View
2. Support Team View
3. Launch Readiness
4. Product & Engineering View
5. Role Mapping

## Capabilities To Demonstrate

- Coordinate product launches across internal and external teams.
- Build scalable readiness mechanisms.
- Create playbooks, operating procedures, dashboards, taxonomies, and routing.
- Prototype lightweight operational tools.
- Build feedback loops from support and partner signals.
- Normalize feedback into categories and severity.
- Route insights to Product and Engineering owners.
- Convert recurring feedback clusters into department-owned follow-up work.
- Identify launch risks early.
- Report readiness and feedback-loop performance.
- Map demo surfaces to the Product Engagement Specialist role.

## Data Model

Version 1 uses local TypeScript data for baseline demo content and browser-local `localStorage` state for the OpenLoop live demo session, routed-task completion state, and human review state.

Current data areas:

- Launch scenario
- Readiness checklist groups and items
- Risk register
- Support playbook
- Feedback samples and classifications
- OpenLoop session records
- Duplicate cluster summaries
- Routed tasks derived from active clusters
- Routed task completion records
- Human review records
- Product insights
- Partner readiness

The OpenLoop session is front-end only. It persists in the browser so preset clicks, custom feedback ingestion, seeded sample feedback, cluster summaries, routed tasks, task completion, human review status, and the feedback log can visibly update across refreshes.

## OpenLoop Architecture

OpenLoop is implemented as a front-end-only demo module:

- `src/components/product-readiness-os/openloop/OpenLoopProvider.tsx` owns OpenLoop state, event handlers, derived metrics, cluster summaries, routed tasks, and browser-local session synchronization.
- `FeedbackClassifier.tsx` consumes `useOpenLoop` and remains the OpenLoop UI composer for the existing card layout.
- `src/components/product-readiness-os/openloop/` contains the OpenLoop provider, hook, and Feedback Router cards for metrics, feedback input, classification, normalized records, routing decisions, human review, dedupe, routed tasks, dashboard impact, and feedback log.
- `src/lib/product-readiness-os/openloop-session.ts` isolates browser-local feedback session storage and task completion storage.
- `src/lib/product-readiness-os/openloop-human-review.ts` isolates browser-local human review storage and derives pending queue items, review reasons, Human Review Rate, and review-rate trend.
- `src/lib/product-readiness-os/openloop-clusters.ts` groups meaningful duplicate clusters and calculates trend labels.
- `src/lib/product-readiness-os/openloop-routed-tasks.ts` generates routed tasks from cluster summaries, not from every individual feedback record.
- `src/lib/product-readiness-os/openloop-seed-data.ts` creates coherent sample launch feedback records for the live demo session.
- `src/lib/product-readiness-os/openloop-metrics.ts` derives Total Ingested Feedback, Detected Clusters, Open Clusters, Open Tasks, Human Review Queue, Human Review Rate, and Completed Tasks from feedback records, task completion records, and human review records.

The optional SQLite scripts in `sql/product-readiness-os/` are a local practice artifact for learning SQL against a similar product-operations model. They are not connected to the live route.

## Phase 5 Behavior

Phase 5 adds a Complete Task loop and OpenLoop-derived page signals without changing the front-end-only scope.

Current behavior:

- Completing a routed task should update Open Tasks and Completed Tasks.
- Detected Clusters should count all valid duplicate clusters in the current live demo session.
- Open Clusters should count valid duplicate clusters that do not have a completed linked routed task.
- Task completion updates OpenLoop cluster operational status and Dashboard Impact Preview.
- Launch Readiness, Risks, Support Hub, and Product / Engineering Insights show compact OpenLoop-derived signal cards.
- Those signal cards summarize operational follow-up, monitoring clusters, open clusters, and owner follow-up without mutating the static source data.
- A completed task means the operational follow-up was completed, not that the underlying product work is complete.
- Routed tasks should remain cluster-based rather than one task per feedback record.

### OpenLoop Secondary Notes

Launch Readiness and Support Hub display OpenLoop-derived secondary notes based on session metrics, routed tasks, completed follow-ups, and cluster summaries.

These notes provide operational context only. They do not mutate static readiness data, change base readiness scores, close risks, change static support content, or imply that product issues are fixed.

## Phase 7A Human Review Behavior

Phase 7A adds a visible Human Review Queue so the demo shows where deterministic automation stops and human judgment takes over.

Current behavior:

- Records enter the Human Review Queue when they are low-confidence, unclear, high-severity, marked as needing human review, or classified as needing triage.
- Mark Reviewed removes a record from the pending queue without changing the original feedback record or pretending the classification was corrected.
- Human review status is stored separately from feedback records under `openloopHumanReviewSession`.
- Reset demo data clears feedback records, task completion records, and human review records.
- Human Review Queue counts only pending, unreviewed records requiring review.
- Human Review Rate is calculated from all ingested records that require review divided by Total Ingested Feedback.
- Human Review Rate is a historical intake-quality metric, so it does not decrease just because a pending item was marked reviewed.
- Human Review Queue displays a simple 24-hour trend comparing the current review rate to the previous 24-hour window.

Phase 7A deferred behavior:

- Human review does not include override controls yet.
- Human review does not add behavioral learning logic yet.
- Human review does not automatically correct classifications, routes, clusters, severity, or priority.

Still deferred behavior:

- Static readiness checklist status, base readiness score, risk register status, support playbook content, and product insight source data are not mutated by OpenLoop task completion.
- A later phase may deepen page-wide synchronization after the signal-card pattern is reviewed.

## Non-Goals

- No backend service in version 1.
- No authentication in version 1.
- No external APIs in version 1.
- No live SQLite connection in version 1.
- No live customer data.
- No confidential company branding or internal terminology.
- No claim that the demo is an internal OpenAI tool.
- No AI workflow consulting positioning.

## Success Criteria

- The demo is polished, job-aligned, and easy to understand.
- The experience clearly shows external partner, support, launch readiness, and product/engineering perspectives.
- Content reads like a credible fictional operating system, not a generic template.
- The UI favors clear operational information over flashy animation.
- The implementation remains simple enough for a portfolio reviewer to inspect.
