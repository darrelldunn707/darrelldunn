import type {
  FeedbackClassification,
  FeedbackSample,
  OpenLoopSessionRecord,
  OpenLoopSessionSource,
} from "../../types/product-readiness-os";

export const OPENLOOP_SESSION_KEY = "openloopFeedbackSession";

const FIRST_SESSION_FEEDBACK_ID = 1028;

export function readOpenLoopSessionRecords(): OpenLoopSessionRecord[] {
  try {
    const rawRecords = window.localStorage.getItem(OPENLOOP_SESSION_KEY);

    if (!rawRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(rawRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords
      .filter(isOpenLoopSessionRecord)
      .map(normalizeSessionRecord);
  } catch {
    return [];
  }
}

export function writeOpenLoopSessionRecords(
  records: OpenLoopSessionRecord[],
) {
  window.localStorage.setItem(OPENLOOP_SESSION_KEY, JSON.stringify(records));
}

export function clearOpenLoopSessionRecords() {
  window.localStorage.removeItem(OPENLOOP_SESSION_KEY);
}

export function getNextFeedbackId(records: OpenLoopSessionRecord[]) {
  const highestExistingId = records.reduce((highestId, record) => {
    const numericId = Number(
      record.classification.feedbackId.replace(/[^0-9]/g, ""),
    );

    return Number.isFinite(numericId) && numericId > highestId
      ? numericId
      : highestId;
  }, FIRST_SESSION_FEEDBACK_ID - 1);

  return `FB-${highestExistingId + 1}`;
}

export function withSessionFeedbackId(
  sample: FeedbackSample,
  feedbackId: string,
  source: OpenLoopSessionSource,
): FeedbackSample {
  return {
    ...sample,
    id: `${sample.id}-${feedbackId}`,
    classification: {
      ...sample.classification,
      createdFrom: source,
      feedbackId,
    },
  };
}

export function createSessionRecord(
  sample: FeedbackSample,
  source: OpenLoopSessionSource,
  department: string,
): OpenLoopSessionRecord {
  const createdAt = new Date().toISOString();

  return {
    sessionId: `${sample.classification.feedbackId}-${Date.now()}`,
    text: sample.text,
    source,
    department,
    createdAt,
    ingestedAt: createdAt,
    classification: sample.classification,
  };
}

export function getDepartmentForClassification(
  classification: FeedbackClassification,
) {
  const owner = classification.likelyOwner.toLowerCase();

  if (owner.includes("engineering")) {
    return "Engineering";
  }

  if (owner.includes("documentation")) {
    return "Documentation";
  }

  if (owner.includes("partner")) {
    return "Partner Success";
  }

  if (owner.includes("support")) {
    return "Support";
  }

  return "Product Ops";
}

function isOpenLoopSessionRecord(
  record: unknown,
): record is OpenLoopSessionRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const possibleRecord = record as Partial<OpenLoopSessionRecord>;

  return Boolean(
    possibleRecord.sessionId &&
      possibleRecord.text &&
      possibleRecord.source &&
      possibleRecord.ingestedAt &&
      possibleRecord.classification?.feedbackId,
  );
}

function normalizeSessionRecord(
  record: OpenLoopSessionRecord,
): OpenLoopSessionRecord {
  return {
    ...record,
    createdAt: record.createdAt ?? record.ingestedAt,
  };
}
