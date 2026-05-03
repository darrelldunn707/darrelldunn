import {
  applyTaskCompletions,
  getRoutedTasks,
} from "../../../lib/product-readiness-os/openloop-routed-tasks";
import type {
  OpenLoopRoutedTask,
  OpenLoopSessionRecord,
  OpenLoopTaskCompletionRecord,
} from "../../../types/product-readiness-os";
import { OpenLoopCard } from "./OpenLoopCard";

export function RoutedTasks({
  records,
  taskCompletions,
  onCompleteTask,
}: {
  records: OpenLoopSessionRecord[];
  taskCompletions: OpenLoopTaskCompletionRecord[];
  onCompleteTask: (task: OpenLoopRoutedTask) => void;
}) {
  const routedTasks = applyTaskCompletions(
    getRoutedTasks(records),
    taskCompletions,
  );

  return (
    <OpenLoopCard
      title="Routed Tasks"
      description="Cluster-level follow-up work assigned to the department best positioned to complete the operational response."
    >
      {routedTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Task",
                  "Department",
                  "Linked Cluster",
                  "Priority",
                  "Status",
                  "Source Signal",
                  "Action",
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
                  key={task.taskId}
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
                    <span className="font-semibold text-stone-900">
                      {task.status}
                    </span>
                    {task.completedAt ? (
                      <span className="mt-1 block text-xs text-stone-500">
                        {formatCompletedAt(task.completedAt)}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 align-top leading-6 text-stone-700">
                    {task.sourceSignal}
                  </td>
                  <td className="py-3 align-top">
                    {task.status === "Completed" ? (
                      <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
                        Completed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCompleteTask(task)}
                        className="rounded-lg bg-teal-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700 active:bg-teal-900"
                      >
                        Complete Task
                      </button>
                    )}
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

function formatCompletedAt(completedAt: string) {
  const date = new Date(completedAt);

  if (Number.isNaN(date.getTime())) {
    return "Completed";
  }

  return `Completed ${date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;
}
