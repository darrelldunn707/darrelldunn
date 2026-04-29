import type {
  OpenLoopClusterSummary,
  OpenLoopClusterTrend,
  OpenLoopSessionRecord,
} from "../../types/product-readiness-os";
import { getSeedClusterProfile } from "./openloop-seed-data";

export function getTopClusterSummaries(records: OpenLoopSessionRecord[]) {
  return getClusterSummaries(records).slice(0, 5);
}

export function getClusterSummaries(
  records: OpenLoopSessionRecord[],
): OpenLoopClusterSummary[] {
  const groupedRecords = records.reduce<Record<string, OpenLoopSessionRecord[]>>(
    (groups, record) => {
      const clusterName = record.classification.duplicateCluster.trim();

      if (!isMeaningfulCluster(clusterName)) {
        return groups;
      }

      groups[clusterName] = [...(groups[clusterName] ?? []), record];
      return groups;
    },
    {},
  );

  return Object.entries(groupedRecords)
    .map(([clusterName, clusterRecords]) =>
      buildClusterSummary(clusterName, clusterRecords),
    )
    .sort((firstCluster, secondCluster) => {
      if (secondCluster.totalReports !== firstCluster.totalReports) {
        return secondCluster.totalReports - firstCluster.totalReports;
      }

      return secondCluster.severeImpactCount - firstCluster.severeImpactCount;
    });
}

export function isMeaningfulCluster(cluster: string) {
  const normalizedCluster = cluster.trim().toLowerCase();

  if (!normalizedCluster) {
    return false;
  }

  return ![
    "no cluster assigned",
    "no cluster",
    "unclear",
    "unassigned",
    "needs triage",
  ].some((placeholder) => normalizedCluster.includes(placeholder));
}

function buildClusterSummary(
  clusterName: string,
  records: OpenLoopSessionRecord[],
): OpenLoopClusterSummary {
  const totalReports = records.length;
  const severeImpactCount = records.filter((record) =>
    ["Sev 1", "Sev 2"].includes(record.classification.severity),
  ).length;
  const last24hReports = records.filter((record) =>
    isWithinLastHours(record.createdAt ?? record.ingestedAt, 24),
  ).length;
  const uniqueCustomersAffected = Math.max(
    ...records.map((record) => record.classification.uniqueCustomersAffected),
    getUniqueValueCount(
      records.map((record) => record.classification.customerSegment),
    ),
  );
  const suggestedOwner =
    getMostCommonValue(records.map((record) => record.classification.likelyOwner)) ??
    "Product Ops triage";
  const explicitPrioritySignal =
    getSeedClusterProfile(clusterName)?.prioritySignal ??
    getMostCommonValue(records.map((record) => record.classification.prioritySignal));
  const category =
    getMostCommonValue(records.map((record) => record.classification.category)) ??
    "Needs triage";
  const customerSegment =
    getMostCommonValue(
      records.map((record) => record.classification.customerSegment),
    ) ?? "affected users";
  const trend = getClusterTrend(totalReports, severeImpactCount, last24hReports);

  return {
    category,
    clusterName,
    customerSegment,
    totalReports,
    uniqueCustomersAffected,
    severeImpactCount,
    last24hReports,
    trend,
    suggestedOwner,
    prioritySignal: buildPrioritySignal(
      category,
      customerSegment,
      trend,
      severeImpactCount,
      explicitPrioritySignal,
    ),
  };
}

function getClusterTrend(
  totalReports: number,
  severeImpactCount: number,
  last24hReports: number,
): OpenLoopClusterTrend {
  if (
    (totalReports >= 6 && severeImpactCount > 0) ||
    last24hReports >= 4
  ) {
    return "Escalating";
  }

  if (totalReports >= 4 || last24hReports >= 2) {
    return "Rising";
  }

  if (totalReports >= 2) {
    return "Watching";
  }

  return "One-off";
}

function buildPrioritySignal(
  category: string,
  customerSegment: string,
  trend: OpenLoopClusterTrend,
  severeImpactCount: number,
  explicitPrioritySignal?: string,
) {
  if (explicitPrioritySignal) {
    return explicitPrioritySignal;
  }

  const normalizedCategory = category.toLowerCase();

  if (severeImpactCount > 0) {
    return `Recurring ${category} issue affecting ${customerSegment} during the launch window.`;
  }

  if (normalizedCategory.includes("documentation")) {
    return `${trend} documentation issue creating support volume.`;
  }

  if (normalizedCategory.includes("partner")) {
    return `Partner onboarding friction is ${trend.toLowerCase()} across recent feedback.`;
  }

  if (normalizedCategory.includes("billing")) {
    return "Billing cluster needs review before broader rollout.";
  }

  return `${trend} ${category} cluster needs owner review and launch follow-up.`;
}

function isWithinLastHours(dateValue: string, hours: number) {
  const timestamp = new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  return Date.now() - timestamp <= hours * 60 * 60 * 1000;
}

function getUniqueValueCount(values: string[]) {
  return new Set(values.map((value) => value.trim()).filter(Boolean)).size;
}

function getMostCommonValue(values: string[]) {
  const counts = values.reduce<Record<string, number>>((valueCounts, value) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return valueCounts;
    }

    valueCounts[normalizedValue] = (valueCounts[normalizedValue] ?? 0) + 1;
    return valueCounts;
  }, {});

  return Object.entries(counts).sort(
    ([, firstCount], [, secondCount]) => secondCount - firstCount,
  )[0]?.[0];
}
