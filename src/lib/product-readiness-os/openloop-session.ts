import type {
  FeedbackClassification,
  FeedbackSample,
  OpenLoopRoutedTask,
  OpenLoopSessionRecord,
  OpenLoopSessionSource,
  OpenLoopTaskCompletionRecord,
} from "../../types/product-readiness-os";

export const OPENLOOP_SESSION_KEY = "openloopFeedbackSession";
export const OPENLOOP_TASK_SESSION_KEY = "openloopTaskSession";

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
  if (records.length === 0) {
    clearOpenLoopSessionRecords();
    return;
  }

  window.localStorage.setItem(OPENLOOP_SESSION_KEY, JSON.stringify(records));
}

export function clearOpenLoopSessionRecords() {
  window.localStorage.removeItem(OPENLOOP_SESSION_KEY);
}

export function readOpenLoopTaskCompletions(): OpenLoopTaskCompletionRecord[] {
  try {
    const rawRecords = window.localStorage.getItem(OPENLOOP_TASK_SESSION_KEY);

    if (!rawRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(rawRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords
      .filter(isOpenLoopTaskCompletionRecord)
      .map(normalizeTaskCompletionRecord);
  } catch {
    return [];
  }
}

export function writeOpenLoopTaskCompletions(
  records: OpenLoopTaskCompletionRecord[],
) {
  if (records.length === 0) {
    clearOpenLoopTaskCompletions();
    return;
  }

  window.localStorage.setItem(
    OPENLOOP_TASK_SESSION_KEY,
    JSON.stringify(records),
  );
}

export function clearOpenLoopTaskCompletions() {
  window.localStorage.removeItem(OPENLOOP_TASK_SESSION_KEY);
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

export function createTaskCompletionRecord(
  task: OpenLoopRoutedTask,
): OpenLoopTaskCompletionRecord {
  return {
    taskId: task.taskId,
    linkedCluster: task.linkedCluster,
    department: task.department,
    status: "Completed",
    completedAt: new Date().toISOString(),
    completionImpact: getTaskCompletionImpact(task),
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

function isOpenLoopTaskCompletionRecord(
  record: unknown,
): record is OpenLoopTaskCompletionRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const possibleRecord = record as Partial<OpenLoopTaskCompletionRecord>;

  return Boolean(
    possibleRecord.taskId &&
      possibleRecord.linkedCluster &&
      possibleRecord.department &&
      possibleRecord.status === "Completed" &&
      possibleRecord.completedAt,
  );
}

function normalizeTaskCompletionRecord(
  record: OpenLoopTaskCompletionRecord,
): OpenLoopTaskCompletionRecord {
  return {
    ...record,
    status: "Completed",
    completionImpact:
      record.completionImpact ??
      `Operational follow-up completed for ${record.linkedCluster}.`,
  };
}

function getTaskCompletionImpact(task: OpenLoopRoutedTask) {
  return `${task.department} completed operational follow-up for ${task.linkedCluster}. Continue monitoring future reports before treating the product issue as resolved.`;
}
