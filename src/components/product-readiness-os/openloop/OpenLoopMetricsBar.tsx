import { calculateOpenLoopMetrics } from "../../../lib/product-readiness-os/openloop-metrics";

export function OpenLoopMetricsBar({
  metrics,
  onReset,
  onSeed,
}: {
  metrics: ReturnType<typeof calculateOpenLoopMetrics>;
  onReset: () => void;
  onSeed: () => void;
}) {
  const metricCards: [string, number][] = [
    ["Total Ingested Feedback", metrics.totalIngestedFeedback],
    ["Detected Clusters", metrics.detectedClusters],
    ["Open Clusters", metrics.openClusters],
    ["Open Tasks", metrics.openTasks],
    ["Human Review Queue", metrics.humanReviewQueue],
    ["Completed Tasks", metrics.completedTasks],
  ];

  return (
    <div className="mt-6 rounded-lg border border-stone-200 bg-stone-100 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <dl className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metricCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-stone-200 bg-white px-3 py-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                {label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSeed}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Seed sample launch feedback
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}
