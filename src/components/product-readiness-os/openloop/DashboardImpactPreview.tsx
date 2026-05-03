import type { FeedbackSample } from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function DashboardImpactPreview({ sample }: { sample: FeedbackSample }) {
  const impact = sample.classification.dashboardImpact;
  const cards = [
    ["Launch Readiness Impact", impact.launchReadinessImpact],
    ["Risk Register Update", impact.riskRegisterUpdate],
    ["Support Hub Update", impact.supportHubUpdate],
    ["Product / Engineering Insight", impact.productEngineeringInsight],
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
