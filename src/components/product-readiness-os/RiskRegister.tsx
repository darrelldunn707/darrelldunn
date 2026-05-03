"use client";

import type { RiskRegisterItem } from "../../types/product-readiness-os";
import { SectionHeading, SeverityBadge } from "./DashboardPrimitives";
import { OpenLoopSignalCard } from "./openloop/OpenLoopSignalCard";
import { useOpenLoop } from "./openloop/OpenLoopProvider";

export function RiskRegister({ risks }: { risks: RiskRegisterItem[] }) {
  const { clusterSummaries, routedTasks } = useOpenLoop();
  const completedTasks = routedTasks.filter((task) => task.status === "Completed");
  const monitoringClusters = new Set(
    completedTasks.map((task) => task.linkedCluster),
  );
  const severeOpenClusters = clusterSummaries.filter(
    (cluster) =>
      cluster.severeImpactCount > 0 &&
      !monitoringClusters.has(cluster.clusterName),
  );
  const hasCompletedFollowUps = completedTasks.length > 0;

  return (
    <section id="risks" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Risk register"
          title="Launch risks with owners, mitigation plans, and escalation paths"
          description="This internal view keeps customer-facing readiness separate from the operational details support, product, and engineering need to manage launch risk."
        />

        <OpenLoopSignalCard
          title="OpenLoop Risk Signal"
          description={
            hasCompletedFollowUps
              ? `${monitoringClusters.size} cluster follow-up${monitoringClusters.size === 1 ? "" : "s"} moved to monitoring. Risk posture is updated inside OpenLoop while the base risk register remains unchanged.`
              : "No completed OpenLoop follow-ups yet. Ingest feedback, seed sample launch feedback, and complete routed tasks to populate this signal."
          }
          emptyMessage={
            hasCompletedFollowUps
              ? undefined
              : "Base risk statuses are not changed by OpenLoop until a later sync pass."
          }
          stats={[
            ["Monitoring clusters", monitoringClusters.size],
            ["Severe open clusters", severeOpenClusters.length],
            ["Completed follow-ups", completedTasks.length],
          ]}
          notes={
            hasCompletedFollowUps
              ? [
                  "Risk register remains unchanged.",
                  "Base risk register keeps its existing statuses.",
                  "Monitor future reports before reducing risk posture.",
                ]
              : undefined
          }
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {risks.map((risk) => (
            <article
              key={risk.id}
              className="rounded-lg border border-stone-200 bg-stone-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {risk.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    Owner: {risk.owner}
                  </p>
                </div>
                <SeverityBadge severity={risk.severity} />
              </div>

              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="font-semibold text-stone-900">
                    Affected audience
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-700">
                    {risk.affectedAudience}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-900">
                    Mitigation plan
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-700">
                    {risk.mitigationPlan}
                  </dd>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-stone-900">Status</dt>
                    <dd className="mt-1 text-stone-700">{risk.status}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-stone-900">
                      Escalation path
                    </dt>
                    <dd className="mt-1 text-stone-700">
                      {risk.escalationPath}
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
