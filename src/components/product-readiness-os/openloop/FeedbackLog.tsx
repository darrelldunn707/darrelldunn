import type { OpenLoopSessionRecord } from "../../../types/product-readiness-os";

export function FeedbackLog({ records }: { records: OpenLoopSessionRecord[] }) {
  const recentRecords = records.slice(-12).reverse();

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Feedback Log
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Recent session records ingested into this live demo session.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            {records.length} records
          </span>
        </div>
      </summary>

      <div className="mt-4 overflow-x-auto">
        {recentRecords.length > 0 ? (
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "ID",
                  "Source",
                  "Segment",
                  "Category",
                  "Severity",
                  "Cluster",
                  "Owner",
                  "Status",
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
              {recentRecords.map((record) => (
                <tr
                  key={record.sessionId}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {record.classification.feedbackId}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.source}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.customerSegment}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.category}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.severity}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.duplicateCluster}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.likelyOwner}
                  </td>
                  <td className="py-3 align-top text-stone-700">
                    {record.classification.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm leading-6 text-stone-600">
            No session records yet. Click a preset, ingest custom feedback, or
            seed sample launch feedback.
          </p>
        )}
      </div>
    </details>
  );
}
