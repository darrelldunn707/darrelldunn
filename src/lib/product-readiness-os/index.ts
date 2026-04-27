import type {
  FeedbackSample,
  ReadinessChecklistGroup,
  ReadinessStatus,
  RiskSeverity,
} from "../../types/product-readiness-os";

const readinessWeights: Record<ReadinessStatus, number> = {
  Complete: 1,
  "At Risk": 0.55,
  Blocked: 0,
  "Not Started": 0,
};

const severityWeights: Record<RiskSeverity, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export function calculateReadinessScore(groups: ReadinessChecklistGroup[]) {
  const items = groups.flatMap((group) => group.items);

  if (items.length === 0) {
    return 0;
  }

  const earned = items.reduce(
    (sum, item) => sum + readinessWeights[item.status],
    0,
  );

  return Math.round((earned / items.length) * 100);
}

export function calculateGroupReadinessScore(group: ReadinessChecklistGroup) {
  return calculateReadinessScore([group]);
}

export function countReadinessStatuses(groups: ReadinessChecklistGroup[]) {
  return groups
    .flatMap((group) => group.items)
    .reduce<Record<ReadinessStatus, number>>(
      (counts, item) => {
        counts[item.status] += 1;
        return counts;
      },
      {
        Complete: 0,
        "At Risk": 0,
        Blocked: 0,
        "Not Started": 0,
      },
    );
}

export function classifyFeedback(
  feedbackText: string,
  samples: FeedbackSample[],
) {
  const normalizedFeedback = feedbackText.trim().toLowerCase();

  return samples.find(
    (sample) => sample.text.trim().toLowerCase() === normalizedFeedback,
  );
}

export function getHighestSeverity(severities: RiskSeverity[]) {
  return severities.reduce<RiskSeverity>(
    (highest, severity) =>
      severityWeights[severity] > severityWeights[highest] ? severity : highest,
    "Low",
  );
}
