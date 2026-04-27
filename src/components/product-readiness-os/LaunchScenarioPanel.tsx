import type { LaunchScenario } from "../../types/product-readiness-os";
import { SeverityBadge } from "./DashboardPrimitives";

export function LaunchScenarioPanel({
  scenario,
  readinessScore,
}: {
  scenario: LaunchScenario;
  readinessScore: number;
}) {
  const details = [
    ["Launch date", scenario.launchDate],
    ["Target audience", scenario.targetAudience],
    ["Launch phase", scenario.launchPhase],
    ["Main launch goal", scenario.mainGoal],
  ];

  return (
    <section id="overview" className="scroll-mt-20 border-y border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Launch scenario
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            {scenario.name}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-stone-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-800">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-medium text-stone-700">
            Current readiness score
          </p>
          <p className="mt-3 text-6xl font-semibold text-stone-900">
            {readinessScore}%
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-stone-700">
              Support risk level
            </span>
            <SeverityBadge severity={scenario.supportRiskLevel} />
          </div>
          <p className="mt-5 text-sm leading-6 text-stone-700">
            Score is calculated from checklist status values across product,
            support, legal, partner, engineering, and communications workstreams.
          </p>
        </div>
      </div>
    </section>
  );
}
