import type {
  OpenLoopHumanReviewQueueItem,
  OpenLoopHumanReviewRecord,
  OpenLoopHumanReviewTrend,
  OpenLoopSessionRecord,
} from "../../types/product-readiness-os";

export const OPENLOOP_HUMAN_REVIEW_SESSION_KEY =
  "openloopHumanReviewSession";

const REVIEW_REASON_PRIORITY = [
  "High-severity feedback",
  "Needs triage",
  "Low confidence classification",
  "Human review recommended",
  "Unclear issue type",
];

export function readOpenLoopHumanReviewRecords(): OpenLoopHumanReviewRecord[] {
  try {
    const rawRecords = window.localStorage.getItem(
      OPENLOOP_HUMAN_REVIEW_SESSION_KEY,
    );

    if (!rawRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(rawRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords
      .filter(isOpenLoopHumanReviewRecord)
      .map(normalizeHumanReviewRecord);
  } catch {
    return [];
  }
}

export function writeOpenLoopHumanReviewRecords(
  records: OpenLoopHumanReviewRecord[],
) {
  if (records.length === 0) {
    clearOpenLoopHumanReviewRecords();
    return;
  }

  window.localStorage.setItem(
    OPENLOOP_HUMAN_REVIEW_SESSION_KEY,
    JSON.stringify(records),
  );
}

export function clearOpenLoopHumanReviewRecords() {
  window.localStorage.removeItem(OPENLOOP_HUMAN_REVIEW_SESSION_KEY);
}

export function createHumanReviewRecord(
  feedbackId: string,
): OpenLoopHumanReviewRecord {
  return {
    feedbackId,
    reviewedAt: new Date().toISOString(),
    reviewStatus: "Reviewed",
  };
}

export function getHumanReviewQueueItems(
  records: OpenLoopSessionRecord[],
  reviewedRecords: OpenLoopHumanReviewRecord[],
  limit = 7,
): OpenLoopHumanReviewQueueItem[] {
  const reviewedFeedbackIds = new Set(
    reviewedRecords.map((record) => record.feedbackId),
  );

  return records
    .map((record) => ({
      record,
      reviewReason: getHumanReviewReason(record),
    }))
    .filter(
      (item): item is { record: OpenLoopSessionRecord; reviewReason: string } =>
        Boolean(item.reviewReason) &&
        !reviewedFeedbackIds.has(item.record.classification.feedbackId),
    )
    .sort(sortHumanReviewQueueItems)
    .slice(0, limit)
    .map(({ record, reviewReason }) => ({
      feedbackId: record.classification.feedbackId,
      reviewReason,
      category: record.classification.category,
      severity: record.classification.severity,
      confidence: `${record.classification.confidenceLevel} - ${record.classification.confidenceScore}%`,
      suggestedRoute: record.classification.recommendedRoute,
      status: "Needs review",
      record,
    }));
}

export function countRecordsRequiringHumanReview(
  records: OpenLoopSessionRecord[],
) {
  return records.filter(requiresHumanReview).length;
}

export function calculateHumanReviewRate(records: OpenLoopSessionRecord[]) {
  if (records.length === 0) {
    return 0;
  }

  return Math.round(
    (countRecordsRequiringHumanReview(records) / records.length) * 100,
  );
}

export function calculateHumanReviewTrend(
  records: OpenLoopSessionRecord[],
  now = new Date(),
): OpenLoopHumanReviewTrend {
  const currentWindowRecords = getRecordsWithinWindow(records, now, 0, 24);
  const previousWindowRecords = getRecordsWithinWindow(records, now, 24, 48);

  if (currentWindowRecords.length === 0 || previousWindowRecords.length === 0) {
    return {
      label: "Insufficient data",
      currentRate: getWindowReviewRate(currentWindowRecords),
      previousRate: getWindowReviewRate(previousWindowRecords),
    };
  }

  const currentRate = getWindowReviewRate(currentWindowRecords);
  const previousRate = getWindowReviewRate(previousWindowRecords);
  const deltaPoints = currentRate - previousRate;

  if (deltaPoints <= -3) {
    return {
      label: "Improving",
      deltaPoints,
      currentRate,
      previousRate,
    };
  }

  if (deltaPoints >= 3) {
    return {
      label: "Rising",
      deltaPoints,
      currentRate,
      previousRate,
    };
  }

  return {
    label: "Stable",
    deltaPoints,
    currentRate,
    previousRate,
  };
}

export function requiresHumanReview(record: OpenLoopSessionRecord) {
  return Boolean(getHumanReviewReason(record));
}

export function getHumanReviewReason(record: OpenLoopSessionRecord) {
  const classification = record.classification;
  const humanReviewNeeded = classification.humanReviewNeeded.toLowerCase();

  if (["Sev 1", "Sev 2"].includes(classification.severity)) {
    return "High-severity feedback";
  }

  if (classification.category === "Needs triage") {
    return "Needs triage";
  }

  if (classification.confidenceLevel === "Low") {
    return "Low confidence classification";
  }

  if (["yes", "review recommended"].includes(humanReviewNeeded)) {
    return "Human review recommended";
  }

  if (classification.issueType.toLowerCase() === "unclear") {
    return "Unclear issue type";
  }

  return undefined;
}

function sortHumanReviewQueueItems(
  firstItem: { record: OpenLoopSessionRecord; reviewReason: string },
  secondItem: { record: OpenLoopSessionRecord; reviewReason: string },
) {
  const firstPriority = REVIEW_REASON_PRIORITY.indexOf(firstItem.reviewReason);
  const secondPriority = REVIEW_REASON_PRIORITY.indexOf(
    secondItem.reviewReason,
  );

  if (firstPriority !== secondPriority) {
    return firstPriority - secondPriority;
  }

  return getRecordTime(secondItem.record) - getRecordTime(firstItem.record);
}

function getRecordsWithinWindow(
  records: OpenLoopSessionRecord[],
  now: Date,
  startHoursAgo: number,
  endHoursAgo: number,
) {
  const nowTime = now.getTime();
  const startTime = nowTime - endHoursAgo * 60 * 60 * 1000;
  const endTime = nowTime - startHoursAgo * 60 * 60 * 1000;

  return records.filter((record) => {
    const recordTime = getRecordTime(record);

    return recordTime >= startTime && recordTime < endTime;
  });
}

function getWindowReviewRate(records: OpenLoopSessionRecord[]) {
  if (records.length === 0) {
    return 0;
  }

  return Math.round(
    (countRecordsRequiringHumanReview(records) / records.length) * 100,
  );
}

function getRecordTime(record: OpenLoopSessionRecord) {
  const date = new Date(record.createdAt ?? record.ingestedAt);
  const time = date.getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isOpenLoopHumanReviewRecord(
  record: unknown,
): record is OpenLoopHumanReviewRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const possibleRecord = record as Partial<OpenLoopHumanReviewRecord>;

  return Boolean(
    possibleRecord.feedbackId &&
      possibleRecord.reviewedAt &&
      possibleRecord.reviewStatus === "Reviewed",
  );
}

function normalizeHumanReviewRecord(
  record: OpenLoopHumanReviewRecord,
): OpenLoopHumanReviewRecord {
  return {
    ...record,
    reviewStatus: "Reviewed",
  };
}
