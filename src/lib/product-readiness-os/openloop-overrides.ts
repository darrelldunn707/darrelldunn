import type {
  FeedbackCategory,
  FeedbackSeverity,
  OpenLoopOverrideInput,
  OpenLoopOverrideReason,
  OpenLoopOverrideRecord,
  OpenLoopSessionRecord,
} from "../../types/product-readiness-os";

export const OPENLOOP_OVERRIDE_SESSION_KEY = "openloopOverrideSession";

const VALID_OVERRIDE_REASONS: OpenLoopOverrideReason[] = [
  "Better category match",
  "Severity adjusted after review",
  "Route changed to better owner",
  "Duplicate pattern clarified",
  "Escalation path corrected",
  "Other",
];

const VALID_FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  "Reliability",
  "Permissions",
  "Authentication / SSO",
  "Documentation",
  "Partner Enablement",
  "Partner Operations",
  "Billing",
  "Policy / Safety",
  "Voice",
  "Needs triage",
  "General / Needs Review",
];

const VALID_FEEDBACK_SEVERITIES: FeedbackSeverity[] = [
  "Sev 1",
  "Sev 2",
  "Sev 3",
  "Sev 4",
  "Sev 5",
];

export function readOpenLoopOverrideRecords(): OpenLoopOverrideRecord[] {
  try {
    const rawRecords = window.localStorage.getItem(
      OPENLOOP_OVERRIDE_SESSION_KEY,
    );

    if (!rawRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(rawRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords
      .filter(isOpenLoopOverrideRecord)
      .map(normalizeOverrideRecord);
  } catch {
    return [];
  }
}

export function writeOpenLoopOverrideRecords(
  records: OpenLoopOverrideRecord[],
) {
  if (records.length === 0) {
    clearOpenLoopOverrideRecords();
    return;
  }

  window.localStorage.setItem(
    OPENLOOP_OVERRIDE_SESSION_KEY,
    JSON.stringify(records),
  );
}

export function clearOpenLoopOverrideRecords() {
  window.localStorage.removeItem(OPENLOOP_OVERRIDE_SESSION_KEY);
}

export function createOpenLoopOverrideRecord(
  record: OpenLoopSessionRecord,
  input: OpenLoopOverrideInput,
): OpenLoopOverrideRecord {
  return {
    feedbackId: record.classification.feedbackId,
    duplicateCluster: record.classification.duplicateCluster,
    originalCategory: record.classification.category,
    overrideCategory: input.overrideCategory,
    originalSeverity: record.classification.severity,
    overrideSeverity: input.overrideSeverity,
    originalLikelyOwner: record.classification.likelyOwner,
    overrideLikelyOwner: input.overrideLikelyOwner.trim(),
    originalRecommendedRoute: record.classification.recommendedRoute,
    overrideRecommendedRoute: input.overrideRecommendedRoute.trim(),
    overrideReason: input.overrideReason,
    overrideStatus: "Overridden",
    reviewedAt: new Date().toISOString(),
  };
}

export function hasOpenLoopOverride(
  records: OpenLoopOverrideRecord[],
  feedbackId: string,
) {
  return records.some((record) => record.feedbackId === feedbackId);
}

function isOpenLoopOverrideRecord(
  record: unknown,
): record is OpenLoopOverrideRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const possibleRecord = record as Partial<OpenLoopOverrideRecord>;

  return Boolean(
    possibleRecord.feedbackId &&
      possibleRecord.duplicateCluster &&
      isFeedbackCategory(possibleRecord.originalCategory) &&
      isFeedbackCategory(possibleRecord.overrideCategory) &&
      isFeedbackSeverity(possibleRecord.originalSeverity) &&
      isFeedbackSeverity(possibleRecord.overrideSeverity) &&
      possibleRecord.originalLikelyOwner &&
      possibleRecord.overrideLikelyOwner &&
      possibleRecord.originalRecommendedRoute &&
      possibleRecord.overrideRecommendedRoute &&
      isOverrideReason(possibleRecord.overrideReason) &&
      possibleRecord.overrideStatus === "Overridden" &&
      possibleRecord.reviewedAt,
  );
}

function normalizeOverrideRecord(
  record: OpenLoopOverrideRecord,
): OpenLoopOverrideRecord {
  return {
    ...record,
    overrideStatus: "Overridden",
  };
}

function isFeedbackCategory(
  category: unknown,
): category is FeedbackCategory {
  return VALID_FEEDBACK_CATEGORIES.includes(category as FeedbackCategory);
}

function isFeedbackSeverity(
  severity: unknown,
): severity is FeedbackSeverity {
  return VALID_FEEDBACK_SEVERITIES.includes(severity as FeedbackSeverity);
}

function isOverrideReason(
  reason: unknown,
): reason is OpenLoopOverrideReason {
  return VALID_OVERRIDE_REASONS.includes(reason as OpenLoopOverrideReason);
}
