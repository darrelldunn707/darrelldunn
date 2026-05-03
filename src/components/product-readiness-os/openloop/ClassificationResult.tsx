import type { FeedbackSample } from "../../../types/product-readiness-os";

type ResultRow = [string, string | number];

export function ClassificationResult({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const routeSummary = `${result.category} feedback routes to ${result.likelyOwner} with ${result.confidenceLevel.toLowerCase()} confidence and ${result.severity} priority.`;
  const summaryRows: ResultRow[] = [
    ["Product Area", result.productArea],
    ["Feature / Workflow", result.featureWorkflow],
    ["Category", result.category],
    ["Subcategory", result.subcategory],
    ["Issue Type", result.issueType],
    ["Severity", result.severity],
    ["Confidence Level", result.confidenceLevel],
    ["Confidence Score", `${result.confidenceLevel} · ${result.confidenceScore}%`],
  ];
  const sections: { title: string; rows: ResultRow[] }[] = [
    {
      title: "Routing + Escalation",
      rows: [
        ["Likely Owner", result.likelyOwner],
        ["Recommended Route", result.recommendedRoute],
        ["Escalation Status", result.escalationStatus],
        ["Human Review Needed", result.humanReviewNeeded],
      ],
    },
    {
      title: "Customer + Launch Impact",
      rows: [
        ["User Impact", result.userImpact],
        ["Duplicate Cluster", result.duplicateCluster],
        ["Similar Reports", result.similarReports],
        ["Unique Customers Affected", result.uniqueCustomersAffected],
        ["Trend", result.trend],
      ],
    },
    {
      title: "Action Outputs",
      rows: [
        [
          "Engineering-ready Problem Statement",
          result.engineeringReadyProblemStatement,
        ],
        ["Suggested Support Response", result.suggestedSupportResponse],
        ["Recommended Next Action", result.recommendedNextAction],
      ],
    },
    {
      title: "Why this route summary",
      rows: [["Quick context", routeSummary]],
    },
  ];

  return (
    <div className="rounded-lg border border-stone-200 border-r-teal-600 bg-white p-6 shadow-sm">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-stone-900">
            Classification Result
          </h3>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            {result.confidenceLevel} - {result.confidenceScore}%
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
          Shows the selected category, severity, confidence, routing owner,
          launch impact, and next action for the current feedback.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">
            Classification Summary
          </h4>
          <dl className="mt-3 space-y-3 pl-4 text-sm">
            {summaryRows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1"
              >
                <dt className="text-sm font-bold text-stone-900">
                  {label}
                </dt>
                <dd className="leading-6 text-stone-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="border-t border-stone-200 pt-5">
            <h4 className="text-sm font-semibold text-stone-900">
              {section.title}
            </h4>
            <dl className="mt-3 space-y-3 pl-4 text-sm">
              {section.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1"
                >
                  <dt className="text-sm font-bold text-stone-900">
                    {label}
                  </dt>
                  <dd className="leading-6 text-stone-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
