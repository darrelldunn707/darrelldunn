import { getRoutedTasks } from "../../../lib/product-readiness-os/openloop-routed-tasks";
import type { OpenLoopSessionRecord } from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function RoutedTasks({ records }: { records: OpenLoopSessionRecord[] }) {
  const routedTasks = getRoutedTasks(records);

  return (
    <OpenLoopCard
      title="Routed Tasks"
      description="Cluster-level follow-up work assigned to the department best positioned to resolve the signal."
    >
      {routedTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Task",
                  "Department",
                  "Linked Cluster",
                  "Priority",
                  "Status",
                  "Source Signal",
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
              {routedTasks.map((task) => (
                <tr
                  key={task.linkedCluster}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {task.task}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.department}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.linkedCluster}
                  </td>
                  <td className="py-3 pr-4 align-top font-semibold text-stone-900">
                    {task.priority}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.status}
                  </td>
                  <td className="py-3 align-top leading-6 text-stone-700">
                    {task.sourceSignal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-600">
          No routed tasks yet. Ingest feedback or seed sample launch feedback
          to generate cluster-level tasks.
        </p>
      )}
    </OpenLoopCard>
  );
}
