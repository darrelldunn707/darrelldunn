import type {
  OpenLoopClusterSummary,
  OpenLoopClusterTrend,
  OpenLoopRoutedTask,
  OpenLoopSeedClusterProfile,
  OpenLoopSessionRecord,
  OpenLoopTaskPriority,
} from "../../types/product-readiness-os";
import { getClusterSummaries } from "./openloop-clusters";
import { getSeedClusterProfile } from "./openloop-seed-data";

export function getRoutedTasks(records: OpenLoopSessionRecord[]) {
  return getClusterSummaries(records)
    .map(buildRoutedTask)
    .sort((firstTask, secondTask) => {
      const priorityDifference =
        getPriorityWeight(secondTask.priority) -
        getPriorityWeight(firstTask.priority);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      const trendDifference =
        getTrendWeight(secondTask.trend) - getTrendWeight(firstTask.trend);

      if (trendDifference !== 0) {
        return trendDifference;
      }

      if (secondTask.totalReports !== firstTask.totalReports) {
        return secondTask.totalReports - firstTask.totalReports;
      }

      return secondTask.severeImpactCount - firstTask.severeImpactCount;
    })
    .slice(0, 7);
}

function buildRoutedTask(
  cluster: OpenLoopClusterSummary,
): OpenLoopRoutedTask {
  const profile = getSeedClusterProfile(cluster.clusterName);
  const priority = getTaskPriority(cluster);

  return {
    task: getTaskTitle(cluster, profile),
    department: getTaskDepartment(cluster, profile),
    linkedCluster: cluster.clusterName,
    priority,
    status: getTaskStatus(priority, cluster.trend),
    sourceSignal: getTaskSourceSignal(cluster, profile),
    totalReports: cluster.totalReports,
    severeImpactCount: cluster.severeImpactCount,
    trend: cluster.trend,
  };
}

function getTaskTitle(
  cluster: OpenLoopClusterSummary,
  profile: OpenLoopSeedClusterProfile | undefined,
) {
  if (profile?.duplicateCluster === "Partner training gaps") {
    return "Update partner training materials and confirm launch guidance";
  }

  if (profile?.duplicateCluster === "SSO setup failures") {
    return "Investigate SSO setup failures and confirm auth configuration path";
  }

  if (profile?.duplicateCluster === "Connector permissions confusion") {
    return "Clarify connector permission requirements and route setup friction to owner";
  }

  if (profile?.duplicateCluster === "Billing plan mismatch") {
    return "Review billing plan mapping and update support escalation guidance";
  }

  if (profile?.duplicateCluster === "Documentation mismatch") {
    return "Update launch docs to match current product behavior";
  }

  if (profile?.duplicateCluster === "Policy / Safety review confusion") {
    return "Clarify safety review guidance and escalation rules";
  }

  if (profile?.duplicateCluster === "Voice audio cutoff") {
    return "Investigate session interruption reports and affected device patterns";
  }

  if (profile?.duplicateCluster === "Admin onboarding confusion") {
    return "Review onboarding friction and update launch readiness checklist";
  }

  return `Review ${cluster.clusterName} and assign follow-up owner`;
}

function getTaskDepartment(
  cluster: OpenLoopClusterSummary,
  profile: OpenLoopSeedClusterProfile | undefined,
) {
  if (profile?.category === "Authentication / SSO" || profile?.category === "Voice") {
    return "Engineering";
  }

  if (profile?.category === "Partner Enablement") {
    return "Partner Success";
  }

  if (profile?.category === "Billing") {
    return "Billing Ops";
  }

  if (profile?.category === "Documentation") {
    return "Documentation";
  }

  if (profile?.category === "Policy / Safety") {
    return "Policy / Safety";
  }

  if (profile?.category === "Permissions") {
    return "Product Ops";
  }

  return normalizeDepartment(cluster.suggestedOwner);
}

function normalizeDepartment(owner: string) {
  const normalizedOwner = owner.toLowerCase();

  if (
    normalizedOwner.includes("engineering") ||
    normalizedOwner.includes("identity") ||
    normalizedOwner.includes("voice")
  ) {
    return "Engineering";
  }

  if (normalizedOwner.includes("partner")) {
    return "Partner Success";
  }

  if (normalizedOwner.includes("policy") || normalizedOwner.includes("safety")) {
    return "Policy / Safety";
  }

  if (normalizedOwner.includes("billing")) {
    return "Billing Ops";
  }

  if (normalizedOwner.includes("documentation")) {
    return "Documentation";
  }

  if (normalizedOwner.includes("support")) {
    return "Support";
  }

  return "Product Ops";
}

function getTaskPriority(
  cluster: OpenLoopClusterSummary,
): OpenLoopTaskPriority {
  const normalizedCategory = cluster.category.toLowerCase();
  const normalizedSegment = cluster.customerSegment.toLowerCase();

  if (normalizedCategory.includes("triage")) {
    return "Review";
  }

  if (
    cluster.trend === "Escalating" ||
    cluster.severeImpactCount > 0 ||
    normalizedSegment.includes("enterprise") ||
    normalizedSegment.includes("partner")
  ) {
    return "High";
  }

  if (cluster.trend === "Rising") {
    return "Medium";
  }

  if (cluster.trend === "Watching") {
    return "Low";
  }

  return "Low";
}

function getTaskStatus(
  priority: OpenLoopTaskPriority,
  trend: OpenLoopClusterTrend,
) {
  if (priority === "Review") {
    return "Needs review";
  }

  if (priority === "High" || trend === "Escalating") {
    return "In progress";
  }

  return "Open";
}

function getTaskSourceSignal(
  cluster: OpenLoopClusterSummary,
  profile: OpenLoopSeedClusterProfile | undefined,
) {
  if (profile?.duplicateCluster === "Partner training gaps") {
    return "Partner enablement gap is recurring during the launch window";
  }

  if (profile?.duplicateCluster === "SSO setup failures") {
    return "Authentication issue is blocking launch-critical setup";
  }

  if (profile?.duplicateCluster === "Connector permissions confusion") {
    return "Admins are repeatedly confused by connector access requirements";
  }

  if (profile?.duplicateCluster === "Billing plan mismatch") {
    return "Billing mismatch is creating support and trust risk";
  }

  if (profile?.duplicateCluster === "Documentation mismatch") {
    return "Documentation mismatch is increasing support volume";
  }

  if (profile?.duplicateCluster === "Policy / Safety review confusion") {
    return "Review uncertainty requires policy alignment";
  }

  if (profile?.duplicateCluster === "Voice audio cutoff") {
    return "Reliability issue is recurring across recent reports";
  }

  if (profile?.duplicateCluster === "Admin onboarding confusion") {
    return "Admin setup confusion may slow enterprise rollout";
  }

  return cluster.prioritySignal;
}

function getPriorityWeight(priority: OpenLoopTaskPriority) {
  const weights: Record<OpenLoopTaskPriority, number> = {
    High: 4,
    Medium: 3,
    Low: 2,
    Review: 1,
  };

  return weights[priority];
}

function getTrendWeight(trend: OpenLoopClusterTrend) {
  const weights: Record<OpenLoopClusterTrend, number> = {
    Escalating: 4,
    Rising: 3,
    Watching: 2,
    "One-off": 1,
  };

  return weights[trend];
}
