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
    <section id="command-center" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Launch readiness"
          title="Launch Readiness"
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

        <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
            OpenLoop Signal
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900">
            3 routed feedback clusters are currently affecting launch readiness
          </h3>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-stone-700 md:grid-cols-3">
            <li className="rounded-lg bg-white p-3 shadow-sm">
              SSO setup failures
            </li>
            <li className="rounded-lg bg-white p-3 shadow-sm">
              Connector permissions confusion
            </li>
            <li className="rounded-lg bg-white p-3 shadow-sm">
              Partner training gaps
            </li>
          </ul>
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
