import type { ReadinessChecklistGroup } from "../../types/product-readiness-os";
import {
  MetricCard,
  ProgressBar,
  SectionHeading,
  StatusBadge,
} from "./DashboardPrimitives";
import {
  calculateGroupReadinessScore,
  countReadinessStatuses,
} from "../../lib/product-readiness-os";

export function CommandCenter({
  groups,
  readinessScore,
}: {
  groups: ReadinessChecklistGroup[];
  readinessScore: number;
}) {
  const statusCounts = countReadinessStatuses(groups);

  return (
    <section className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Launch readiness command center"
          title="Workstream readiness, owners, and open launch dependencies"
          description="Internal teams can quickly see which workstreams are complete, which items need attention, and where launch approval depends on follow-through."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Readiness score"
            value={`${readinessScore}%`}
            helper="Calculated from checklist completion."
          />
          <MetricCard
            label="At risk"
            value={statusCounts["At Risk"]}
            helper="Items likely to need owner follow-up."
          />
          <MetricCard
            label="Blocked"
            value={statusCounts.Blocked}
            helper="Items that need escalation or a decision."
          />
          <MetricCard
            label="Complete"
            value={statusCounts.Complete}
            helper="Items ready for launch review."
          />
        </div>

        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <ProgressBar value={readinessScore} label="Overall readiness" />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {group.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    {group.items.length} readiness items
                  </p>
                </div>
                <span className="text-lg font-semibold text-teal-700">
                  {calculateGroupReadinessScore(group)}%
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-stone-900">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm text-stone-600">
                          Owner: {item.owner} | Due {item.dueDate}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stone-700">
                      {item.notes}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
