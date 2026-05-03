"use client";

import { useEffect, useMemo, useState } from "react";
import {
  classifyCustomFeedback,
  classifyFeedback,
} from "../../lib/product-readiness-os";
import { calculateOpenLoopMetrics } from "../../lib/product-readiness-os/openloop-metrics";
import { buildSeedSessionRecords } from "../../lib/product-readiness-os/openloop-seed-data";
import {
  clearOpenLoopSessionRecords,
  createSessionRecord,
  getDepartmentForClassification,
  getNextFeedbackId,
  readOpenLoopSessionRecords,
  withSessionFeedbackId,
  writeOpenLoopSessionRecords,
} from "../../lib/product-readiness-os/openloop-session";
import type {
  FeedbackSample,
  OpenLoopSessionRecord,
  OpenLoopSessionSource,
} from "../../types/product-readiness-os";
import { SectionHeading } from "./DashboardPrimitives";
import { ClassificationResult } from "./openloop/ClassificationResult";
import { DashboardImpactPreview } from "./openloop/DashboardImpactPreview";
import { DedupeTrendCluster } from "./openloop/DedupeTrendCluster";
import { FeedbackInputCard } from "./openloop/FeedbackInputCard";
import { FeedbackLog } from "./openloop/FeedbackLog";
import { NormalizedFeedbackRecord } from "./openloop/NormalizedFeedbackRecord";
import { OpenLoopMetricsBar } from "./openloop/OpenLoopMetricsBar";
import { RoutedTasks } from "./openloop/RoutedTasks";
import { RoutingDecisionTrail } from "./openloop/RoutingDecisionTrail";

const CONFIRMATION_DURATION_MS = 12000;
export function FeedbackClassifier({
  samples,
}: {
  samples: FeedbackSample[];
}) {
  const [feedbackText, setFeedbackText] = useState(samples[0]?.text ?? "");
  const [selectedSample, setSelectedSample] = useState<FeedbackSample | undefined>(
    () => classifyFeedback(samples[0]?.text ?? "", samples),
  );
  const [sessionRecords, setSessionRecords] = useState<OpenLoopSessionRecord[]>([]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [hasLoadedSession, setHasLoadedSession] = useState(false);
  const metrics = useMemo(
    () => calculateOpenLoopMetrics(sessionRecords),
    [sessionRecords],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSessionRecords(readOpenLoopSessionRecords());
      setHasLoadedSession(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasLoadedSession) {
      return;
    }

    writeOpenLoopSessionRecords(sessionRecords);
  }, [hasLoadedSession, sessionRecords]);

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
      `New feedback received · ${feedbackId} added to OpenLoop records`,
    );
  }

  function handleSeedSession() {
    const seededRecords = buildSeedSessionRecords(samples, sessionRecords);

    if (seededRecords.length === 0) {
      return;
    }

    setSessionRecords((records) => [...records, ...seededRecords]);
    setConfirmationMessage(
      `Sample launch feedback seeded · ${seededRecords.length} records added to this live demo session`,
    );
  }

  function handleResetSession() {
    setSessionRecords([]);
    setConfirmationMessage("");
    setFeedbackText(samples[0]?.text ?? "");
    setSelectedSample(classifyFeedback(samples[0]?.text ?? "", samples));
    clearOpenLoopSessionRecords();
  }

  return (
    <section id="feedback-router" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Feedback intake and classification"
          title="OpenLoop Feedback Router"
          description="Turns raw launch feedback into normalized records, severity, owner routing, duplicate-aware insights, and engineering-ready next actions."
        />

        <OpenLoopMetricsBar
          metrics={metrics}
          onReset={handleResetSession}
          onSeed={handleSeedSession}
        />

        {selectedSample ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <FeedbackInputCard
                confirmationMessage={confirmationMessage}
                feedbackText={feedbackText}
                totalIngestedFeedback={metrics.totalIngestedFeedback}
                samples={samples}
                onFeedbackChange={setFeedbackText}
                onCustomClassify={handleCustomClassify}
                onPresetSelect={handlePresetSelect}
              />
              <NormalizedFeedbackRecord sample={selectedSample} />
            </div>

            <div>
              <ClassificationResult sample={selectedSample} />
            </div>

            <div className="lg:col-span-2">
              <RoutingDecisionTrail sample={selectedSample} />
            </div>

            <div className="lg:col-span-2">
              <DedupeTrendCluster records={sessionRecords} />
            </div>

            <div className="lg:col-span-2">
              <RoutedTasks records={sessionRecords} />
            </div>

            <div className="lg:col-span-2">
              <DashboardImpactPreview sample={selectedSample} />
            </div>

            <div className="lg:col-span-2">
              <FeedbackLog records={sessionRecords} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
