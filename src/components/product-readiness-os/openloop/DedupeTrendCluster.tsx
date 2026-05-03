import { getTopClusterSummaries } from "../../../lib/product-readiness-os/openloop-clusters";
import type {
  OpenLoopSessionRecord,
  OpenLoopTaskCompletionRecord,
} from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function DedupeTrendCluster({
  records,
  taskCompletions,
}: {
  records: OpenLoopSessionRecord[];
  taskCompletions: OpenLoopTaskCompletionRecord[];
}) {
  const clusterSummaries = getTopClusterSummaries(records);
  const completedClusters = new Set(
    taskCompletions.map((completion) => completion.linkedCluster),
  );

  return (
    <OpenLoopCard
      title="Dedupe + Trend Cluster"
      description="Top feedback clusters from this live demo session, grouped from ingested session records."
    >
      {clusterSummaries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Cluster",
                  "Reports",
                  "Customers",
                  "Sev 1 / Sev 2",
                  "Last 24h",
                  "Trend",
                  "Operational Status",
                  "Suggested Owner",
                  "Priority Signal",
                ].map((header) => (
                  <th
                    key={header}
                    className="pb-3 pr-4 font-bold text-stone-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clusterSummaries.map((cluster) => (
                <tr
                  key={cluster.clusterName}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {cluster.clusterName}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.totalReports}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.uniqueCustomersAffected}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.severeImpactCount}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.last24hReports}
                  </td>
                  <td className="py-3 pr-4 align-top font-semibold text-stone-900">
                    {cluster.trend}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {completedClusters.has(cluster.clusterName)
                      ? "Monitoring"
                      : "Open"}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.suggestedOwner}
                  </td>
                  <td className="py-3 align-top leading-6 text-stone-700">
                    {cluster.prioritySignal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-600">
          No active duplicate clusters yet. Ingest feedback or seed sample
          launch feedback to populate cluster trends.
        </p>
      )}
    </OpenLoopCard>
  );
}
