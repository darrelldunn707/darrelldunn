# TODO

This file tracks active work only. Completed work should be removed or moved to `CHANGELOG.md`.

## Current

- Finalize `SPEC.md` against the live demo after the main UI is stable.
- Review public-facing copy for Product Engagement Specialist alignment.
- Confirm every demo view clearly maps to one of the four intended perspectives:
  - External Partner View
  - Support Team View
  - Launch Readiness
  - Product & Engineering View
- Check responsive behavior across desktop and mobile viewports.
- Run `npm run lint` before sharing the demo.
- Run `npm run build` before deployment.

## Backlog

- Phase 5: Add the Complete Task loop after the routed task model is ready to update Open Tasks, Completed Tasks, cluster status, risk status, launch readiness impact, Support Hub updates, and Product / Engineering Insight updates.
- Consider extracting OpenLoop session, cluster, and routed task helpers from `FeedbackClassifier.tsx` into `src/lib/product-readiness-os/` before Phase 5 grows the state model.
- Consider screenshots or a short walkthrough only if they help reviewers understand the demo faster.
- Revisit whether a `docs/` directory is needed after the documentation set grows.
