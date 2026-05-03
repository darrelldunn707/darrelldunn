import type {
  FeedbackSample,
  OpenLoopTaskCompletionRecord,
} from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function DashboardImpactPreview({
  sample,
  taskCompletions,
}: {
  sample: FeedbackSample;
  taskCompletions: OpenLoopTaskCompletionRecord[];
}) {
  const impact = sample.classification.dashboardImpact;
  const completedCount = taskCompletions.length;
  const completedText =
    completedCount === 1 ? "1 routed task" : `${completedCount} routed tasks`;
  const cards = [
    [
      "Launch Readiness Impact",
      completedCount > 0
        ? `Follow-up completed for ${completedText}; readiness impact should be monitored against new feedback volume.`
        : impact.launchReadinessImpact,
    ],
    [
      "Risk Register Update",
      completedCount > 0
        ? "Related risk follow-up moved to monitoring inside OpenLoop; the underlying product issue is not automatically resolved."
        : impact.riskRegisterUpdate,
    ],
    [
      "Support Hub Update",
      completedCount > 0
        ? "Support guidance follow-up completed for routed operational work; continue collecting new report patterns."
        : impact.supportHubUpdate,
    ],
    [
      "Product / Engineering Insight",
      completedCount > 0
        ? "Owner follow-up completed; monitor future reports before treating the product signal as resolved."
        : impact.productEngineeringInsight,
    ],
  ];

  return (
    <OpenLoopCard
      title="Dashboard Impact Preview"
      description="Previews how this feedback updates launch readiness, risk tracking, support enablement, and product or engineering follow-up."
      accent
      outputAccent
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {cards.map(([title, description]) => (
          <div
            key={title}
            className="rounded-lg border border-teal-100 bg-white p-4"
          >
            <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              {description}
            </p>
          </div>
        ))}
      </div>
    </OpenLoopCard>
  );
}
