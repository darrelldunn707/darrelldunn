# Changelog

This file tracks completed Product Readiness OS demo work. Keep `TODO.md` focused on active and upcoming work.

## Unreleased

### Phase 5 - Complete Task Loop

Planned, not implemented yet.

- Will add a complete-task loop after the routed task model is ready.
- Expected updates include Open Tasks, Completed Tasks, cluster status, risk status, launch readiness impact, Support Hub updates, and Product / Engineering Insight updates.
- Task completion is intentionally out of scope for the current demo.

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
- No backend, database, authentication, or external API calls have been added.
