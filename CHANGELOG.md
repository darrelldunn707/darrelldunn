# Changelog

This file tracks completed Product Readiness OS demo work. Keep `TODO.md` focused on active and upcoming work.

## Unreleased

### Phase 7A - Human Review Queue

- Added a visible Human Review Queue after Routing Decision Trail and before Dedupe + Trend Cluster.
- Added localStorage-backed human review status under `openloopHumanReviewSession`.
- Kept human review status separate from feedback records and task completion records.
- Added Mark Reviewed behavior so pending review items can move out of the queue without pretending the classification was corrected.
- Added Human Review Rate to show the historical share of ingested feedback that requires review.
- Kept Human Review Rate independent from reviewed status so marking an item reviewed does not lower the historical intake-quality metric.
- Added simple 24-hour review-rate trend logic for Improving, Stable, Rising, or Insufficient data.
- Preserved the boundary that human review is where automation stops and human judgment takes over.

### Public GitHub Readiness

- Refactored OpenLoop Feedback Router logic into focused helper modules for session storage, cluster aggregation, routed task generation, seed data, and metrics.
- Split OpenLoop Feedback Router UI cards into smaller presentational components under `src/components/product-readiness-os/openloop/`.
- Kept `FeedbackClassifier.tsx` as the state and layout orchestrator without changing the visible demo experience.
- Isolated `localStorage` access behind OpenLoop session helper functions so browser-local persistence can be replaced later without changing UI components.
- Clarified public-readiness documentation for OpenLoop architecture, browser-local persistence, cluster-based tasks, Phase 5 boundaries, and optional SQLite practice scripts.
- Added a reviewer path to `README.md`.
- Removed inactive header contact text from the Product Readiness OS demo.
- Removed unused starter static assets from `public/`.
- Added a destructive-reset warning to the SQLite practice README.
- Split SQL practice queries so `Sev 1` / `Sev 2` feedback and `Critical` / `High` risks are reviewed separately.
- Strengthened implementation documentation rules in `AGENTS.md`, `CODEX.md`, and `DOC_CHECKLIST.md` so phase-tracking updates happen as part of implementation closeout.

### Phase 5B Pass 1 - OpenLoop Provider Boundary

- Added `OpenLoopProvider` and `useOpenLoop` as the shared OpenLoop state boundary.
- Moved OpenLoop state, handlers, derived metrics, cluster summaries, routed tasks, seed/reset, ingestion, and task completion handlers out of `FeedbackClassifier.tsx`.
- Kept `FeedbackClassifier.tsx` as the OpenLoop UI composer with no visible layout or behavior changes.
- Wrapped the one-page operating surface in `OpenLoopProvider` so sibling sections can later consume OpenLoop-derived state without reading `localStorage` directly.

### Phase 5B Pass 2 - Section Signal Cards

- Added compact OpenLoop-derived signal cards to Launch Readiness, Risks, Support Hub, and Product / Engineering Insights.
- Kept static readiness score, readiness checklist items, risk statuses, support playbook content, and product insight source data unchanged.
- Used task completion language focused on operational follow-up, monitoring, and future reports rather than product issue resolution.
- Kept sibling sections on `useOpenLoop` and avoided direct `localStorage` reads.

### Phase 5C - OpenLoop Readiness and Support Notes

- Added reusable `OpenLoopNote` UI treatment.
- Added OpenLoop secondary notes to Launch Readiness metric cards.
- Added OpenLoop secondary notes to Support Hub panels.
- Kept primary readiness values and static support content unchanged.
- Preserved the distinction between operational follow-up and product issue resolution.

### Phase 5A - OpenLoop Complete Task Loop

- Added localStorage-backed task completion state under `openloopTaskSession`.
- Kept task completion state separate from feedback records under `openloopFeedbackSession`.
- Added deterministic routed task IDs based on linked cluster and department.
- Added Complete Task controls inside the Routed Tasks card.
- Updated Open Tasks and Completed Tasks metrics from active routed tasks plus task completion state.
- Split cluster metrics into Detected Clusters for all valid duplicate clusters and Open Clusters for unresolved clusters without completed linked routed tasks.
- Added OpenLoop-only cluster operational status and Dashboard Impact Preview updates for completed follow-up.
- Completing a task means the operational follow-up was completed, not that the underlying product work is complete.

### Phase 4 - Routed Tasks

- Added cluster-derived routed tasks.
- Added the Routed Tasks card between Dedupe + Trend Cluster and Dashboard Impact Preview.
- Updated the Open Tasks metric from generated routed tasks.
- Kept task completion out of scope.

### Phase 3 - Cluster Aggregation + Trend Detection

- Updated Dedupe + Trend Cluster to show the top 5 clusters from live session records.
- Added cluster aggregation from browser-local OpenLoop session records.
- Added deterministic trend labels based on report volume, severe-impact count, and recent activity.
- Fixed seed data coherence so clusters, owners, categories, customer segments, and priority signals align.

### Phase 2 - Feedback Log

- Added the collapsible Feedback Log to show recent live demo session records.
- Included session record fields such as ID, source, segment, category, severity, cluster, owner, and status.
- Implemented this during the live demo session work, even though it was originally planned as a separate phase.

### Phase 1 - OpenLoop Feedback Router + Live Demo Session

- Upgraded Feedback Router into OpenLoop Feedback Router.
- Added browser-local OpenLoop session records using `localStorage`.
- Added preset ingestion and custom feedback ingestion through Classify & Ingest Feedback.
- Added Total Ingested Feedback and derived OpenLoop metrics.
- Added seed and reset controls.
- Added normalized feedback records, confidence score, severity, routing fields, duplicate cluster fields, and dashboard impact preview.

### Phase 0 - Product Readiness OS Baseline

- Built the one-page Product Readiness OS demo structure.
- Added Overview, Feedback Router, Launch Readiness, Risks, Support Hub, Partner View, Insights, and Role Mapping sections.
- Established local TypeScript demo data and deterministic feedback classification.

### Notes

- The demo remains one route at `/product-readiness-os`.
- The OpenLoop session is front-end only and stored in `localStorage`.
- Routed tasks are generated from duplicate clusters, not individual feedback records.
- No backend, database, authentication, or external API calls have been added.
