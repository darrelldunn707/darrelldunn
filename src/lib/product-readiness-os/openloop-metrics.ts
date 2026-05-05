import type {
  OpenLoopHumanReviewRecord,
  OpenLoopSessionRecord,
  OpenLoopTaskCompletionRecord,
} from "../../types/product-readiness-os";
import { getClusterSummaries } from "./openloop-clusters";
import {
  calculateHumanReviewRate,
  getHumanReviewQueueItems,
} from "./openloop-human-review";
import { getRoutedTasks } from "./openloop-routed-tasks";

export function calculateOpenLoopMetrics(
  records: OpenLoopSessionRecord[],
  taskCompletions: OpenLoopTaskCompletionRecord[] = [],
  humanReviewRecords: OpenLoopHumanReviewRecord[] = [],
) {
  const clusterSummaries = getClusterSummaries(records);
  const detectedClusterNames = new Set(
    clusterSummaries.map((cluster) => cluster.clusterName),
  );
  const completedClusterNames = new Set(
    taskCompletions
      .filter((completion) => detectedClusterNames.has(completion.linkedCluster))
      .map((completion) => completion.linkedCluster),
  );
  const routedTasks = getRoutedTasks(records);
  const routedTaskIds = new Set(routedTasks.map((task) => task.taskId));
  const completedTaskIds = new Set(
    taskCompletions
      .filter((completion) => routedTaskIds.has(completion.taskId))
      .map((completion) => completion.taskId),
  );

  return {
    totalIngestedFeedback: records.length,
    detectedClusters: clusterSummaries.length,
    openClusters: clusterSummaries.filter(
      (cluster) => !completedClusterNames.has(cluster.clusterName),
    ).length,
    openTasks: routedTasks.filter((task) => !completedTaskIds.has(task.taskId))
      .length,
    humanReviewQueue: getHumanReviewQueueItems(
      records,
      humanReviewRecords,
      records.length,
    ).length,
    humanReviewRate: calculateHumanReviewRate(records),
    completedTasks: completedTaskIds.size,
  };
}
