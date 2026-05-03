"use client";

import type { ProductInsights } from "../../types/product-readiness-os";
import { SectionHeading } from "./DashboardPrimitives";
import { OpenLoopSignalCard } from "./openloop/OpenLoopSignalCard";
import { useOpenLoop } from "./openloop/OpenLoopProvider";

const insightDepartments = new Set(["Engineering", "Product Ops"]);

export function ProductEngineeringInsights({
  insights,
}: {
  insights: ProductInsights;
}) {
  const { routedTasks } = useOpenLoop();
  const feedbackEntries = Object.entries(
    insights.feedbackVolumeByCategory,
  ).sort(
    ([, firstVolume], [, secondVolume]) =>
      (secondVolume ?? 0) - (firstVolume ?? 0),
  );
  const maxVolume = Math.max(...feedbackEntries.map(([, volume]) => volume ?? 0));
  const completedOwnerTasks = routedTasks.filter(
    (task) =>
      task.status === "Completed" && insightDepartments.has(task.department),
  );
  const topOpenClusters = routedTasks
    .filter((task) => task.status !== "Completed")
    .map((task) => task.linkedCluster)
    .slice(0, 3);
  const hasCompletedFollowUps = completedOwnerTasks.length > 0;

  return (
    <section id="insights" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Product and engineering insights"
          title="Launch signals translated into product action"
          description="The internal view connects support feedback to high-severity issues, customer pain points, and practical next steps for product, engineering, and support."
        />

        <OpenLoopSignalCard
          title="OpenLoop Insight Signal"
          description={
            hasCompletedFollowUps
              ? `Owner follow-up completed for ${completedOwnerTasks.length} routed task${completedOwnerTasks.length === 1 ? "" : "s"}. Continue monitoring top open clusters for recurring launch signals.`
              : "No completed OpenLoop follow-ups yet. Ingest feedback, seed sample launch feedback, and complete routed tasks to populate this signal."
          }
          emptyMessage={
            hasCompletedFollowUps
              ? undefined
              : "Static product and engineering insight data remains unchanged."
          }
          stats={[
            ["Engineering follow-ups", getCompletedDepartmentCount(completedOwnerTasks, "Engineering")],
            ["Product Ops follow-ups", getCompletedDepartmentCount(completedOwnerTasks, "Product Ops")],
            ["Top open clusters", topOpenClusters.length],
          ]}
          notes={
            hasCompletedFollowUps
              ? topOpenClusters.length > 0
                ? topOpenClusters.map((cluster) => `Monitor ${cluster}.`)
                : ["All active routed tasks have owner follow-up recorded."]
              : undefined
          }
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Feedback categories by volume
            </h3>
            <div className="mt-5 space-y-4">
              {feedbackEntries.map(([category, volume]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-stone-800">
                      {category}
                    </span>
                    <span className="text-stone-600">{volume ?? 0} reports</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${((volume ?? 0) / maxVolume) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ListPanel
            title="Open high-severity issues"
            items={insights.openHighSeverityIssues}
            accent="rose"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ListPanel
            title="Top customer pain points"
            items={insights.topCustomerPainPoints}
          />
          <ListPanel
            title="Recommended product actions"
            items={insights.recommendedProductActions}
          />
          <ListPanel
            title="Recommended support actions"
            items={insights.recommendedSupportActions}
          />
          <ListPanel
            title="Launch readiness concerns"
            items={insights.launchReadinessConcerns}
            accent="amber"
          />
        </div>
      </div>
    </section>
  );
}

function getCompletedDepartmentCount(
  tasks: Array<{ department: string }>,
  department: string,
) {
  return tasks.filter((task) => task.department === department).length;
}

function ListPanel({
  title,
  items,
  accent = "teal",
}: {
  title: string;
  items: string[];
  accent?: "teal" | "rose" | "amber";
}) {
  const accentClass = {
    teal: "bg-teal-600",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  }[accent];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accentClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
