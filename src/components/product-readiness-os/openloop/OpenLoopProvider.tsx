"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  classifyCustomFeedback,
  classifyFeedback,
} from "../../../lib/product-readiness-os";
import { getClusterSummaries } from "../../../lib/product-readiness-os/openloop-clusters";
import { calculateOpenLoopMetrics } from "../../../lib/product-readiness-os/openloop-metrics";
import {
  applyTaskCompletions,
  getRoutedTasks,
} from "../../../lib/product-readiness-os/openloop-routed-tasks";
import { buildSeedSessionRecords } from "../../../lib/product-readiness-os/openloop-seed-data";
import {
  clearOpenLoopSessionRecords,
  clearOpenLoopTaskCompletions,
  createSessionRecord,
  createTaskCompletionRecord,
  getDepartmentForClassification,
  getNextFeedbackId,
  readOpenLoopSessionRecords,
  readOpenLoopTaskCompletions,
  withSessionFeedbackId,
  writeOpenLoopSessionRecords,
  writeOpenLoopTaskCompletions,
} from "../../../lib/product-readiness-os/openloop-session";
import type {
  FeedbackSample,
  OpenLoopClusterSummary,
  OpenLoopRoutedTask,
  OpenLoopSessionRecord,
  OpenLoopSessionSource,
  OpenLoopTaskCompletionRecord,
} from "../../../types/product-readiness-os";

const CONFIRMATION_DURATION_MS = 12000;

type OpenLoopContextValue = {
  clusterSummaries: OpenLoopClusterSummary[];
  confirmationMessage: string;
  feedbackLogRecords: OpenLoopSessionRecord[];
  feedbackText: string;
  handleCompleteTask: (task: OpenLoopRoutedTask) => void;
  handleCustomClassify: () => void;
  handlePresetSelect: (sample: FeedbackSample) => void;
  handleResetSession: () => void;
  handleSeedSession: () => void;
  metrics: ReturnType<typeof calculateOpenLoopMetrics>;
  routedTasks: OpenLoopRoutedTask[];
  samples: FeedbackSample[];
  selectedSample: FeedbackSample | undefined;
  sessionRecords: OpenLoopSessionRecord[];
  setFeedbackText: (feedbackText: string) => void;
  taskCompletions: OpenLoopTaskCompletionRecord[];
};

const OpenLoopContext = createContext<OpenLoopContextValue | undefined>(
  undefined,
);

export function OpenLoopProvider({
  children,
  samples,
}: {
  children: ReactNode;
  samples: FeedbackSample[];
}) {
  const [feedbackText, setFeedbackText] = useState(samples[0]?.text ?? "");
  const [selectedSample, setSelectedSample] = useState<
    FeedbackSample | undefined
  >(() => classifyFeedback(samples[0]?.text ?? "", samples));
  const [sessionRecords, setSessionRecords] = useState<
    OpenLoopSessionRecord[]
  >([]);
  const [taskCompletions, setTaskCompletions] = useState<
    OpenLoopTaskCompletionRecord[]
  >([]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const metrics = useMemo(
    () => calculateOpenLoopMetrics(sessionRecords, taskCompletions),
    [sessionRecords, taskCompletions],
  );
  const clusterSummaries = useMemo(
    () => getClusterSummaries(sessionRecords),
    [sessionRecords],
  );
  const routedTasks = useMemo(
    () =>
      applyTaskCompletions(
        getRoutedTasks(sessionRecords),
        taskCompletions,
      ),
    [sessionRecords, taskCompletions],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSessionRecords(readOpenLoopSessionRecords());
      setTaskCompletions(readOpenLoopTaskCompletions());
      setHasLoadedSession(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasLoadedSession) {
      return;
    }

    writeOpenLoopSessionRecords(sessionRecords);
    writeOpenLoopTaskCompletions(taskCompletions);
  }, [hasLoadedSession, sessionRecords, taskCompletions]);

  useEffect(() => {
    if (!confirmationMessage) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setConfirmationMessage(""),
      CONFIRMATION_DURATION_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [confirmationMessage]);

  function handlePresetSelect(sample: FeedbackSample) {
    setFeedbackText(sample.text);
    ingestFeedbackSample(
      classifyFeedback(sample.text, samples) ?? sample,
      "Preset example",
      getDepartmentForClassification(sample.classification),
    );
  }

  function handleCustomClassify() {
    const trimmedFeedback = feedbackText.trim();

    if (!trimmedFeedback) {
      return;
    }

    ingestFeedbackSample(
      classifyFeedback(trimmedFeedback, samples) ??
        classifyCustomFeedback(trimmedFeedback),
      "Custom feedback input",
      "Product Ops",
    );
  }

  function ingestFeedbackSample(
    sample: FeedbackSample,
    source: OpenLoopSessionSource,
    department: string,
  ) {
    const feedbackId = getNextFeedbackId(sessionRecords);
    const ingestedSample = withSessionFeedbackId(sample, feedbackId, source);
    const sessionRecord = createSessionRecord(
      ingestedSample,
      source,
      department,
    );

    setSelectedSample(ingestedSample);
    setSessionRecords((records) => [...records, sessionRecord]);
    setConfirmationMessage(
      `New feedback received - ${feedbackId} added to OpenLoop records`,
    );
  }

  function handleSeedSession() {
    const seededRecords = buildSeedSessionRecords(samples, sessionRecords);

    if (seededRecords.length === 0) {
      return;
    }

    setSessionRecords((records) => [...records, ...seededRecords]);
    setConfirmationMessage(
      `Sample launch feedback seeded - ${seededRecords.length} records added to this live demo session`,
    );
  }

  function handleResetSession() {
    setSessionRecords([]);
    setTaskCompletions([]);
    setConfirmationMessage("");
    setFeedbackText(samples[0]?.text ?? "");
    setSelectedSample(classifyFeedback(samples[0]?.text ?? "", samples));
    clearOpenLoopSessionRecords();
    clearOpenLoopTaskCompletions();
  }

  function handleCompleteTask(task: OpenLoopRoutedTask) {
    setTaskCompletions((completions) => {
      if (completions.some((completion) => completion.taskId === task.taskId)) {
        return completions;
      }

      return [...completions, createTaskCompletionRecord(task)];
    });
    setConfirmationMessage(
      `Task completed - operational follow-up recorded for ${task.linkedCluster}`,
    );
  }

  const value = {
    clusterSummaries,
    confirmationMessage,
    feedbackLogRecords: sessionRecords,
    feedbackText,
    handleCompleteTask,
    handleCustomClassify,
    handlePresetSelect,
    handleResetSession,
    handleSeedSession,
    metrics,
    routedTasks,
    samples,
    selectedSample,
    sessionRecords,
    setFeedbackText,
    taskCompletions,
  };

  return (
    <OpenLoopContext.Provider value={value}>
      {children}
    </OpenLoopContext.Provider>
  );
}

export function useOpenLoop() {
  const context = useContext(OpenLoopContext);

  if (!context) {
    throw new Error("useOpenLoop must be used within an OpenLoopProvider");
  }

  return context;
}
