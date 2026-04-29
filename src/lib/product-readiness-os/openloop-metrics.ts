import type { OpenLoopSessionRecord } from "../../types/product-readiness-os";
import { getClusterSummaries } from "./openloop-clusters";
import { getRoutedTasks } from "./openloop-routed-tasks";

export function calculateOpenLoopMetrics(records: OpenLoopSessionRecord[]) {
  const humanReviewQueue = records.filter((record) =>
    ["yes", "review recommended"].includes(
      record.classification.humanReviewNeeded.toLowerCase(),
    ),
  ).length;

  return {
    totalIngestedFeedback: records.length,
    openClusters: getClusterSummaries(records).length,
    openTasks: getRoutedTasks(records).length,
    humanReviewQueue,
    completedTasks: 0,
  };
}
