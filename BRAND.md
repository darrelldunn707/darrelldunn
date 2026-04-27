# Brand Guide

This file documents the current visual palette used in the repo. The source of truth is the Tailwind classes in `src/app/page.tsx` and `src/components/product-readiness-os/`.

## Direction

The current brand feel is modern, warm, professional, and operational. The palette uses warm stone neutrals, teal primary actions, soft amber/emerald highlights, and rose/orange warning states.

Avoid shifting the UI toward a navy/gray-heavy palette. Keep the current warm, clear dashboard feel unless the visual direction changes explicitly.

## Core Palette

| Role | Current tokens | Notes |
| --- | --- | --- |
| Page background | `bg-stone-50` | Main app and homepage background. Keeps the demo warm and softer than pure gray. |
| Section background | `bg-white`, `bg-stone-50` | Alternates between white content sections and light stone bands. |
| Primary text | `text-stone-900`, `text-stone-950` | Headings, key labels, and primary navigation text. |
| Body text | `text-stone-700`, `text-stone-800` | Paragraphs, dashboard descriptions, table content, and supporting copy. |
| Muted text | `text-stone-500`, `text-stone-600` | Metadata, helper text, table headings, captions, and inactive navigation. |
| Borders | `border-stone-200`, `border-stone-300` | Cards, section dividers, form controls, tables, and subtle layout separation. |
| Cards | `bg-white`, `bg-stone-50`, `border-stone-200`, `shadow-sm` | Dashboard cards use quiet contrast and light borders rather than heavy filled surfaces. |

## Primary Action Color

| Role | Current tokens | Notes |
| --- | --- | --- |
| Primary action | `bg-teal-700`, `text-white` | Homepage CTA and active section navigation. |
| Primary action hover | `hover:bg-teal-800` | Darker teal hover state for primary buttons. |
| Links and accents | `text-teal-700`, `hover:text-teal-700`, `text-teal-800` | Eyebrow labels, active values, hover links, and operational emphasis. |
| Soft teal surfaces | `bg-teal-50`, `border-teal-200`, `hover:bg-teal-50`, `hover:border-teal-300` | Partner callouts, hover states, and gentle interactive affordances. |
| Focus rings | `ring-teal-200`, `focus:border-teal-600` | Form focus treatment in the feedback router. |

## Status Colors

| Status | Current tokens | Used for |
| --- | --- | --- |
| Complete | `border-emerald-200 bg-emerald-50 text-emerald-800` | Completed readiness checklist items and low-risk positive states. |
| At Risk | `border-amber-200 bg-amber-50 text-amber-800` | At-risk readiness items and medium-severity warnings. |
| Blocked | `border-rose-200 bg-rose-50 text-rose-800` | Blocked readiness items. |
| Not Started | `border-stone-200 bg-stone-50 text-stone-700` | Neutral pending work. |

## Severity Colors

| Severity | Current tokens | Used for |
| --- | --- | --- |
| Critical | `border-rose-300 bg-rose-100 text-rose-900` | Highest-severity risk and feedback labels. |
| High | `border-orange-200 bg-orange-50 text-orange-800` | High-severity risk and feedback labels. |
| Medium | `border-amber-200 bg-amber-50 text-amber-800` | Medium-severity labels. |
| Low | `border-emerald-200 bg-emerald-50 text-emerald-800` | Low-severity labels. |

## Data Visualization Colors

| Role | Current tokens | Notes |
| --- | --- | --- |
| Readiness progress | `from-teal-600 via-emerald-500 to-amber-400` | Gradient progress bar for readiness score. |
| Feedback volume bars | `bg-teal-600` | Product and engineering insights volume bars. |
| Insight bullets | `bg-teal-600`, `bg-rose-500`, `bg-amber-500` | Differentiates recommended actions, high-severity issues, and support actions. |
| Ordered markers | `bg-amber-100 text-amber-800` | Number markers in ordered operational lists. |

## Hero And Feature Surfaces

| Role | Current tokens | Notes |
| --- | --- | --- |
| Demo hero gradient | `#fff7ed`, `#fefce8`, `#ecfdf5` | Warm orange-to-yellow-to-emerald wash used behind the Product Readiness OS hero. |
| Hero feature cards | `border-white/70 bg-white/70` | Semi-transparent cards over the hero gradient. |
| Dark contrast band | `bg-stone-900 text-white` | Used sparingly for the partner/team contrast strip. Supporting text uses `text-stone-200`; accent labels use `text-amber-200` and `text-teal-200`. |
| Floating utility action | `bg-white/90 border-stone-200 text-stone-700 hover:bg-teal-50 hover:text-teal-800` | Back-to-top action. |

## CSS Variables

The global stylesheet also defines baseline variables:

- `--background: #ffffff`
- `--foreground: #171717`
- Dark preference fallback: `--background: #0a0a0a`, `--foreground: #ededed`

Most app screens currently set their own Tailwind background and text colors directly, so the Tailwind classes above are the practical palette for this repo.

## Usage Notes

- Use teal for primary actions, active navigation, focus states, and important operational accents.
- Use stone neutrals for the core structure, text hierarchy, borders, and cards.
- Use amber for risk, caution, launch readiness, and warm emphasis.
- Use emerald for complete, positive, or healthy states.
- Use rose and orange only for blocked, critical, or high-severity states.
- Keep status and severity colors consistent with `DashboardPrimitives.tsx`.
- Prefer subtle backgrounds and borders over saturated full-card fills.
