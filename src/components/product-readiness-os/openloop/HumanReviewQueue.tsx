"use client";

import { Fragment, useState } from "react";
import type {
  FeedbackCategory,
  FeedbackSeverity,
  OpenLoopHumanReviewQueueItem,
  OpenLoopHumanReviewTrend,
  OpenLoopOverrideInput,
  OpenLoopOverrideReason,
} from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

const categoryOptions: FeedbackCategory[] = [
  "Reliability",
  "Permissions",
  "Authentication / SSO",
  "Documentation",
  "Partner Enablement",
  "Partner Operations",
  "Billing",
  "Policy / Safety",
  "Voice",
  "Needs triage",
  "General / Needs Review",
];

const severityOptions: FeedbackSeverity[] = [
  "Sev 1",
  "Sev 2",
  "Sev 3",
  "Sev 4",
  "Sev 5",
];

const ownerOptions = [
  "Product Ops",
  "Engineering",
  "Support",
  "Partner Success",
  "Policy / Safety",
  "Billing Ops",
  "Documentation",
];

const routeOptions = [
  "Support -> Product Ops triage",
  "Support -> Engineering",
  "Support -> Documentation",
  "Support -> Partner Success",
  "Support -> Policy / Safety",
  "Support -> Billing Ops",
  "Partner Success -> Product Ops",
  "Product Ops -> Engineering",
];

const overrideReasonOptions: OpenLoopOverrideReason[] = [
  "Better category match",
  "Severity adjusted after review",
  "Route changed to better owner",
  "Duplicate pattern clarified",
  "Escalation path corrected",
  "Other",
];

export function HumanReviewQueue({
  humanReviewRate,
  queueItems,
  trend,
  onMarkReviewed,
  onSaveOverride,
}: {
  humanReviewRate: number;
  queueItems: OpenLoopHumanReviewQueueItem[];
  trend: OpenLoopHumanReviewTrend;
  onMarkReviewed: (feedbackId: string) => void;
  onSaveOverride: (
    item: OpenLoopHumanReviewQueueItem,
    input: OpenLoopOverrideInput,
  ) => void;
}) {
  const [activeOverrideId, setActiveOverrideId] = useState<string>();
  const [overrideInput, setOverrideInput] = useState<OpenLoopOverrideInput>();
  const activeItem = queueItems.find(
    (item) => item.feedbackId === activeOverrideId,
  );
  const canSaveOverride =
    Boolean(activeItem && overrideInput) &&
    Boolean(overrideInput?.overrideLikelyOwner.trim()) &&
    Boolean(overrideInput?.overrideRecommendedRoute.trim());

  function openOverrideControls(item: OpenLoopHumanReviewQueueItem) {
    setActiveOverrideId(item.feedbackId);
    setOverrideInput({
      overrideCategory: item.record.classification.category,
      overrideSeverity: item.record.classification.severity,
      overrideLikelyOwner: item.record.classification.likelyOwner,
      overrideRecommendedRoute: item.record.classification.recommendedRoute,
      overrideReason: "Better category match",
    });
  }

  function cancelOverride() {
    setActiveOverrideId(undefined);
    setOverrideInput(undefined);
  }

  function saveOverride() {
    if (!activeItem || !overrideInput || !canSaveOverride) {
      return;
    }

    onSaveOverride(activeItem, overrideInput);
    cancelOverride();
  }

  return (
    <OpenLoopCard
      title="Human Review Queue"
      description="Feedback records that need human judgment before OpenLoop fully trusts routing, clustering, or prioritization."
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Human Review Rate
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            {humanReviewRate}%
          </p>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Trend
          </p>
          <p className="mt-1 text-sm font-semibold text-stone-900">
            {formatReviewTrend(trend)}
          </p>
        </div>
      </div>

      {queueItems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Feedback ID",
                  "Review Reason",
                  "Category",
                  "Severity",
                  "Confidence",
                  "Suggested Route",
                  "Status",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="pb-3 pr-4 font-bold text-stone-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queueItems.map((item) => (
                <Fragment key={item.record.sessionId}>
                <tr className="border-b border-stone-100 last:border-0">
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {item.feedbackId}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {item.reviewReason}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {item.category}
                  </td>
                  <td className="py-3 pr-4 align-top font-semibold text-stone-900">
                    {item.severity}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {item.confidence}
                  </td>
                  <td className="py-3 pr-4 align-top leading-6 text-stone-700">
                    {item.suggestedRoute}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onMarkReviewed(item.feedbackId)}
                        className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 active:bg-teal-900"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() => openOverrideControls(item)}
                        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                      >
                        Override
                      </button>
                    </div>
                  </td>
                </tr>
                {activeOverrideId === item.feedbackId && overrideInput ? (
                  <tr className="border-b border-stone-100 bg-stone-50/80">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                          Category
                          <select
                            value={overrideInput.overrideCategory}
                            onChange={(event) =>
                              setOverrideInput({
                                ...overrideInput,
                                overrideCategory: event.target
                                  .value as FeedbackCategory,
                              })
                            }
                            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-stone-900"
                          >
                            {categoryOptions.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                          Severity
                          <select
                            value={overrideInput.overrideSeverity}
                            onChange={(event) =>
                              setOverrideInput({
                                ...overrideInput,
                                overrideSeverity: event.target
                                  .value as FeedbackSeverity,
                              })
                            }
                            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-stone-900"
                          >
                            {severityOptions.map((severity) => (
                              <option key={severity} value={severity}>
                                {severity}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                          Likely Owner
                          <input
                            list="openloop-owner-options"
                            value={overrideInput.overrideLikelyOwner}
                            onChange={(event) =>
                              setOverrideInput({
                                ...overrideInput,
                                overrideLikelyOwner: event.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-stone-900"
                          />
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                          Recommended Route
                          <input
                            list="openloop-route-options"
                            value={overrideInput.overrideRecommendedRoute}
                            onChange={(event) =>
                              setOverrideInput({
                                ...overrideInput,
                                overrideRecommendedRoute: event.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-stone-900"
                          />
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                          Override Reason
                          <select
                            value={overrideInput.overrideReason}
                            onChange={(event) =>
                              setOverrideInput({
                                ...overrideInput,
                                overrideReason: event.target
                                  .value as OpenLoopOverrideReason,
                              })
                            }
                            className="mt-1 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm normal-case tracking-normal text-stone-900"
                          >
                            {overrideReasonOptions.map((reason) => (
                              <option key={reason} value={reason}>
                                {reason}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={saveOverride}
                          disabled={!canSaveOverride}
                          className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 active:bg-teal-900 disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          Save Override
                        </button>
                        <button
                          type="button"
                          onClick={cancelOverride}
                          className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <p className="text-xs leading-5 text-stone-600">
                          Saves operational handling for this record only. It
                          does not change the original feedback record.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
          <datalist id="openloop-owner-options">
            {ownerOptions.map((owner) => (
              <option key={owner} value={owner} />
            ))}
          </datalist>
          <datalist id="openloop-route-options">
            {routeOptions.map((route) => (
              <option key={route} value={route} />
            ))}
          </datalist>
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-600">
          No pending human review items. Low-confidence, unclear, or
          high-severity feedback will appear here.
        </p>
      )}
    </OpenLoopCard>
  );
}

function formatReviewTrend(trend: OpenLoopHumanReviewTrend) {
  if (trend.label === "Insufficient data") {
    return "Insufficient data";
  }

  const deltaPoints = trend.deltaPoints ?? 0;
  const sign = deltaPoints > 0 ? "+" : "";

  return `${trend.label}: ${sign}${deltaPoints} pts vs previous 24h`;
}
