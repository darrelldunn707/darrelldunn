import type {
  OpenLoopHumanReviewQueueItem,
  OpenLoopHumanReviewTrend,
} from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function HumanReviewQueue({
  humanReviewRate,
  queueItems,
  trend,
  onMarkReviewed,
}: {
  humanReviewRate: number;
  queueItems: OpenLoopHumanReviewQueueItem[];
  trend: OpenLoopHumanReviewTrend;
  onMarkReviewed: (feedbackId: string) => void;
}) {
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
                <tr
                  key={item.record.sessionId}
                  className="border-b border-stone-100 last:border-0"
                >
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
                    <button
                      type="button"
                      onClick={() => onMarkReviewed(item.feedbackId)}
                      className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 active:bg-teal-900"
                    >
                      Mark Reviewed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
