"use client";

import { SectionHeading } from "./DashboardPrimitives";
import { ClassificationResult } from "./openloop/ClassificationResult";
import { DashboardImpactPreview } from "./openloop/DashboardImpactPreview";
import { DedupeTrendCluster } from "./openloop/DedupeTrendCluster";
import { FeedbackInputCard } from "./openloop/FeedbackInputCard";
import { FeedbackLog } from "./openloop/FeedbackLog";
import { HumanReviewQueue } from "./openloop/HumanReviewQueue";
import { NormalizedFeedbackRecord } from "./openloop/NormalizedFeedbackRecord";
import { OpenLoopMetricsBar } from "./openloop/OpenLoopMetricsBar";
import { useOpenLoop } from "./openloop/OpenLoopProvider";
import { RoutedTasks } from "./openloop/RoutedTasks";
import { RoutingDecisionTrail } from "./openloop/RoutingDecisionTrail";

export function FeedbackClassifier() {
  const {
    confirmationMessage,
    feedbackLogRecords,
    feedbackText,
    handleCompleteTask,
    handleCustomClassify,
    handleMarkHumanReviewComplete,
    handleSaveHumanReviewOverride,
    handlePresetSelect,
    handleResetSession,
    handleSeedSession,
    humanReviewQueueItems,
    humanReviewRecords,
    humanReviewTrend,
    metrics,
    overrideRecords,
    samples,
    selectedSample,
    sessionRecords,
    setFeedbackText,
    taskCompletions,
  } = useOpenLoop();

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
              <HumanReviewQueue
                humanReviewRate={metrics.humanReviewRate}
                queueItems={humanReviewQueueItems}
                trend={humanReviewTrend}
                onMarkReviewed={handleMarkHumanReviewComplete}
                onSaveOverride={handleSaveHumanReviewOverride}
              />
            </div>

            <div className="lg:col-span-2">
              <DedupeTrendCluster
                records={sessionRecords}
                taskCompletions={taskCompletions}
              />
            </div>

            <div className="lg:col-span-2">
              <RoutedTasks
                records={sessionRecords}
                taskCompletions={taskCompletions}
                onCompleteTask={handleCompleteTask}
              />
            </div>

            <div className="lg:col-span-2">
              <DashboardImpactPreview
                sample={selectedSample}
                taskCompletions={taskCompletions}
              />
            </div>

            <div className="lg:col-span-2">
              <FeedbackLog
                records={feedbackLogRecords}
                humanReviewRecords={humanReviewRecords}
                overrideRecords={overrideRecords}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
