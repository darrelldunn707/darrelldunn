import type { FeedbackSample } from "../../../types/product-readiness-os";

export function RoutingDecisionTrail({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const rows: [string, string | number, string | number][] = [
    [
      "Product Area",
      result.productArea,
      `Routes toward ${result.likelyOwner}.`,
    ],
    [
      "Issue Type",
      result.issueType,
      "Determines the investigation and follow-up path.",
    ],
    [
      "Severity",
      result.severity,
      result.escalationStatus,
    ],
    [
      "Customer Segment",
      result.customerSegment,
      "Sets launch priority and visibility for the affected audience.",
    ],
    [
      "Duplicate Cluster",
      result.duplicateCluster,
      "Groups related reports into one issue cluster.",
    ],
    [
      "Confidence Score",
      `${result.confidenceScore}%`,
      getConfidenceEffect(result.confidenceScore),
    ],
    [
      "Human Review Needed",
      result.humanReviewNeeded,
      getHumanReviewEffect(result.humanReviewNeeded, result.recommendedRoute),
    ],
  ];

  return (
    <details className="rounded-lg border border-stone-200 border-r-teal-600 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Routing Decision Trail
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Shows the decision logic OpenLoop used to select the owner,
              route, escalation path, and review status.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            Expand
          </span>
        </div>
      </summary>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 pr-4 font-bold text-stone-900">
                Routing Signal
              </th>
              <th className="pb-3 pr-4 font-bold text-stone-900">
                Detected Value
              </th>
              <th className="pb-3 font-bold text-stone-900">
                Effect
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([signal, value, effect]) => (
              <tr key={signal} className="border-b border-stone-100 last:border-0">
                <td className="py-3 pr-4 align-top font-bold text-stone-900">
                  {signal}
                </td>
                <td className="py-3 pr-4 align-top leading-6 text-stone-700">
                  {value}
                </td>
                <td className="py-3 align-top leading-6 text-stone-700">
                  {effect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function getConfidenceEffect(confidenceScore: number) {
  if (confidenceScore >= 85) {
    return "Allows auto-routing with visibility.";
  }

  if (confidenceScore >= 65) {
    return "Routes with review recommended.";
  }

  return "Requires human triage before routing.";
}

function getHumanReviewEffect(
  humanReviewNeeded: string,
  recommendedRoute: string,
) {
  if (humanReviewNeeded.toLowerCase() === "no") {
    return `Sends directly to ${recommendedRoute}.`;
  }

  return "Routes to human triage before owner assignment.";
}
