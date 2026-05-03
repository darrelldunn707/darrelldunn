import type { FeedbackSample } from "../../../types/product-readiness-os";

export function NormalizedFeedbackRecord({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const rows = [
    ["Feedback ID", result.feedbackId],
    ["Created From", result.createdFrom],
    ["Source Channel", result.sourceChannel],
    ["Customer Segment", result.customerSegment],
    ["Product Area", result.productArea],
    ["Feature / Workflow", result.featureWorkflow],
    ["Issue Type", result.issueType],
    ["Category", result.category],
    ["Subcategory", result.subcategory],
    ["Severity", result.severity],
    ["Confidence Score", `${result.confidenceScore}%`],
    ["Duplicate Cluster", result.duplicateCluster],
    ["Similar Reports", result.similarReports],
    ["Unique Customers Affected", result.uniqueCustomersAffected],
    ["Owner Team", result.likelyOwner],
    ["Status", result.status],
    ["Recommended Next Action", result.recommendedNextAction],
  ];

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Normalized Feedback Record
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Raw feedback becomes a structured operational record for routing,
              dedupe, reporting, and follow-up.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            Expand
          </span>
        </div>
      </summary>
      <dl className="mt-4 space-y-3 pl-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1">
            <dt className="text-sm font-bold text-stone-900">
              {label}
            </dt>
            <dd className="leading-5 text-stone-700">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
