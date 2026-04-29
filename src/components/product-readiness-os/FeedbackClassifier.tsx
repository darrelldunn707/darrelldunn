"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  classifyCustomFeedback,
  classifyFeedback,
} from "../../lib/product-readiness-os";
import type { FeedbackSample } from "../../types/product-readiness-os";
import {
  SectionHeading,
} from "./DashboardPrimitives";

type ResultRow = [string, string | number];

type SessionSource =
  | "Preset example"
  | "Custom feedback input"
  | "Seed sample launch feedback";

type OpenLoopSessionRecord = {
  sessionId: string;
  text: string;
  source: SessionSource;
  department: string;
  ingestedAt: string;
  classification: FeedbackSample["classification"];
};

const OPENLOOP_SESSION_KEY = "openloopFeedbackSession";
const FIRST_SESSION_FEEDBACK_ID = 1028;
const CONFIRMATION_DURATION_MS = 12000;
const SEED_RECORD_COUNT = 40;

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
      setSessionRecords(readSessionRecords());
      setHasLoadedSession(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasLoadedSession) {
      return;
    }

    window.localStorage.setItem(
      OPENLOOP_SESSION_KEY,
      JSON.stringify(sessionRecords),
    );
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
    source: SessionSource,
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
    window.localStorage.removeItem(OPENLOOP_SESSION_KEY);
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
              <DedupeTrendCluster sample={selectedSample} />
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

function OpenLoopMetricsBar({
  metrics,
  onReset,
  onSeed,
}: {
  metrics: ReturnType<typeof calculateOpenLoopMetrics>;
  onReset: () => void;
  onSeed: () => void;
}) {
  const metricCards: [string, number][] = [
    ["Total Feedback", metrics.totalIngestedFeedback],
    ["Open Clusters", metrics.openClusters],
    ["Open Tasks", metrics.openTasks],
    ["Human Review", metrics.humanReviewQueue],
    ["Completed Tasks", metrics.completedTasks],
  ];

  return (
    <div className="mt-6 rounded-lg border border-stone-200 bg-stone-100 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <dl className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {metricCards.map(([label, value]) => (
            <div
              key={label}
              className="rounded-lg border border-stone-200 bg-white px-3 py-3"
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                {label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-stone-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSeed}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Seed sample launch feedback
          </button>
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
          >
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackInputCard({
  confirmationMessage,
  feedbackText,
  totalIngestedFeedback,
  samples,
  onFeedbackChange,
  onCustomClassify,
  onPresetSelect,
}: {
  confirmationMessage: string;
  feedbackText: string;
  totalIngestedFeedback: number;
  samples: FeedbackSample[];
  onFeedbackChange: (value: string) => void;
  onCustomClassify: () => void;
  onPresetSelect: (sample: FeedbackSample) => void;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-100 p-6">
      <h3 className="text-lg font-semibold text-stone-900">
        Feedback Input
      </h3>
      <label
        htmlFor="feedback-input"
        className="sr-only"
      >
        Feedback input text
      </label>
      <textarea
        id="feedback-input"
        value={feedbackText}
        onChange={(event) => onFeedbackChange(event.target.value)}
        className="mt-4 min-h-32 w-full rounded-lg border border-stone-300 bg-white p-4 text-sm leading-6 text-stone-900 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
      />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <p className="text-left text-xs leading-5 text-stone-600">
          <span className="block">
            Preset examples below classify instantly.
          </span>
          <span className="block">
            Custom text entered above updates with button.
          </span>
        </p>
        <button
          type="button"
          onClick={onCustomClassify}
          disabled={!feedbackText.trim()}
          className="ml-auto rounded-lg bg-teal-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 active:bg-teal-950 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"
        >
          Classify & Ingest Feedback
        </button>
      </div>

      {confirmationMessage ? (
        <div className="mt-3 flex justify-end">
          <p className="text-left text-sm font-normal leading-6 text-stone-700">
            {confirmationMessage}
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-4 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Total Ingested Feedback
          </p>
          <p className="mt-1 text-3xl font-semibold text-stone-900">
            {totalIngestedFeedback}
          </p>
        </div>
        <p className="mt-5 text-sm font-semibold text-stone-900">
          Preset feedback examples
        </p>
        <p className="mt-2 text-xs leading-5 text-stone-600">
          Each preset click adds a new feedback item to this live demo session.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          {samples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onPresetSelect(sample)}
              className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-left text-sm leading-5 text-stone-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
            >
              {sample.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassificationResult({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const routeSummary = `${result.category} feedback routes to ${result.likelyOwner} with ${result.confidenceLevel.toLowerCase()} confidence and ${result.severity} priority.`;
  const summaryRows: ResultRow[] = [
    ["Product Area", result.productArea],
    ["Feature / Workflow", result.featureWorkflow],
    ["Category", result.category],
    ["Subcategory", result.subcategory],
    ["Issue Type", result.issueType],
    ["Severity", result.severity],
    ["Confidence Level", result.confidenceLevel],
    ["Confidence Score", `${result.confidenceLevel} · ${result.confidenceScore}%`],
  ];
  const sections: { title: string; rows: ResultRow[] }[] = [
    {
      title: "Routing + Escalation",
      rows: [
        ["Likely Owner", result.likelyOwner],
        ["Recommended Route", result.recommendedRoute],
        ["Escalation Status", result.escalationStatus],
        ["Human Review Needed", result.humanReviewNeeded],
      ],
    },
    {
      title: "Customer + Launch Impact",
      rows: [
        ["User Impact", result.userImpact],
        ["Duplicate Cluster", result.duplicateCluster],
        ["Similar Reports", result.similarReports],
        ["Unique Customers Affected", result.uniqueCustomersAffected],
        ["Trend", result.trend],
      ],
    },
    {
      title: "Action Outputs",
      rows: [
        [
          "Engineering-ready Problem Statement",
          result.engineeringReadyProblemStatement,
        ],
        ["Suggested Support Response", result.suggestedSupportResponse],
        ["Recommended Next Action", result.recommendedNextAction],
      ],
    },
    {
      title: "Why this route summary",
      rows: [["Quick context", routeSummary]],
    },
  ];

  return (
    <div className="rounded-lg border border-stone-200 border-r-teal-600 bg-white p-6 shadow-sm">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-stone-900">
            Classification Result
          </h3>
          <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            {result.confidenceLevel} - {result.confidenceScore}%
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">
          Shows the selected category, severity, confidence, routing owner,
          launch impact, and next action for the current feedback.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">
            Classification Summary
          </h4>
          <dl className="mt-3 space-y-3 pl-4 text-sm">
            {summaryRows.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-1"
              >
                <dt className="text-sm font-bold text-stone-900">
                  {label}
                </dt>
                <dd className="leading-6 text-stone-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="border-t border-stone-200 pt-5">
            <h4 className="text-sm font-semibold text-stone-900">
              {section.title}
            </h4>
            <dl className="mt-3 space-y-3 pl-4 text-sm">
              {section.rows.map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1"
                >
                  <dt className="text-sm font-bold text-stone-900">
                    {label}
                  </dt>
                  <dd className="leading-6 text-stone-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutingDecisionTrail({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const rows: [string, string | number, string | number][] = [
    [
      "Product Area",
      result.productArea,
      `Routes toward ${result.likelyOwner}.`,
    ],
    [
      "Issue Type",
      result.issueType,
      "Determines the investigation and follow-up path.",
    ],
    [
      "Severity",
      result.severity,
      result.escalationStatus,
    ],
    [
      "Customer Segment",
      result.customerSegment,
      "Sets launch priority and visibility for the affected audience.",
    ],
    [
      "Duplicate Cluster",
      result.duplicateCluster,
      "Groups related reports into one issue cluster.",
    ],
    [
      "Confidence Score",
      `${result.confidenceScore}%`,
      getConfidenceEffect(result.confidenceScore),
    ],
    [
      "Human Review Needed",
      result.humanReviewNeeded,
      getHumanReviewEffect(result.humanReviewNeeded, result.recommendedRoute),
    ],
  ];

  return (
    <details className="rounded-lg border border-stone-200 border-r-teal-600 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Routing Decision Trail
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Shows the decision logic OpenLoop used to select the owner,
              route, escalation path, and review status.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            Expand
          </span>
        </div>
      </summary>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-3 pr-4 font-bold text-stone-900">
                Routing Signal
              </th>
              <th className="pb-3 pr-4 font-bold text-stone-900">
                Detected Value
              </th>
              <th className="pb-3 font-bold text-stone-900">
                Effect
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([signal, value, effect]) => (
              <tr key={signal} className="border-b border-stone-100 last:border-0">
                <td className="py-3 pr-4 align-top font-bold text-stone-900">
                  {signal}
                </td>
                <td className="py-3 pr-4 align-top leading-6 text-stone-700">
                  {value}
                </td>
                <td className="py-3 align-top leading-6 text-stone-700">
                  {effect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

function getConfidenceEffect(confidenceScore: number) {
  if (confidenceScore >= 85) {
    return "Allows auto-routing with visibility.";
  }

  if (confidenceScore >= 65) {
    return "Routes with review recommended.";
  }

  return "Requires human triage before routing.";
}

function getHumanReviewEffect(
  humanReviewNeeded: string,
  recommendedRoute: string,
) {
  if (humanReviewNeeded.toLowerCase() === "no") {
    return `Sends directly to ${recommendedRoute}.`;
  }

  return "Routes to human triage before owner assignment.";
}

function NormalizedFeedbackRecord({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const rows = [
    ["Feedback ID", result.feedbackId],
    ["Created From", result.createdFrom],
    ["Source Channel", result.sourceChannel],
    ["Customer Segment", result.customerSegment],
    ["Product Area", result.productArea],
    ["Feature / Workflow", result.featureWorkflow],
    ["Issue Type", result.issueType],
    ["Category", result.category],
    ["Subcategory", result.subcategory],
    ["Severity", result.severity],
    ["Confidence Score", `${result.confidenceScore}%`],
    ["Duplicate Cluster", result.duplicateCluster],
    ["Similar Reports", result.similarReports],
    ["Unique Customers Affected", result.uniqueCustomersAffected],
    ["Owner Team", result.likelyOwner],
    ["Status", result.status],
    ["Recommended Next Action", result.recommendedNextAction],
  ];

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Normalized Feedback Record
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Raw feedback becomes a structured operational record for routing,
              dedupe, reporting, and follow-up.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            Expand
          </span>
        </div>
      </summary>
      <dl className="mt-4 space-y-3 pl-4 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1">
            <dt className="text-sm font-bold text-stone-900">
              {label}
            </dt>
            <dd className="leading-5 text-stone-700">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function DedupeTrendCluster({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;

  return (
    <CompactCard
      title="Dedupe + Trend Cluster"
      description="Groups repeated reports into one launch signal so duplicate tickets add priority without fragmenting the work."
    >
      <dl className="grid gap-4 pl-4 text-sm lg:grid-cols-5">
        <LabeledValue label="Duplicate Cluster" value={result.duplicateCluster} />
        <LabeledValue label="Similar Reports" value={result.similarReports} />
        <LabeledValue
          label="Unique Customers Affected"
          value={result.uniqueCustomersAffected}
        />
        <LabeledValue label="Trend" value={result.trend} />
        <LabeledValue label="Priority Signal" value={result.prioritySignal} />
      </dl>
    </CompactCard>
  );
}

function DashboardImpactPreview({ sample }: { sample: FeedbackSample }) {
  const impact = sample.classification.dashboardImpact;
  const cards = [
    ["Launch Readiness Impact", impact.launchReadinessImpact],
    ["Risk Register Update", impact.riskRegisterUpdate],
    ["Support Hub Update", impact.supportHubUpdate],
    ["Product / Engineering Insight", impact.productEngineeringInsight],
  ];

  return (
    <CompactCard
      title="Dashboard Impact Preview"
      description="Previews how this feedback updates launch readiness, risk tracking, support enablement, and product or engineering follow-up."
      accent
      outputAccent
    >
      <div className="grid gap-4 lg:grid-cols-4">
        {cards.map(([title, description]) => (
          <div
            key={title}
            className="rounded-lg border border-teal-100 bg-white p-4"
          >
            <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              {description}
            </p>
          </div>
        ))}
      </div>
    </CompactCard>
  );
}

function FeedbackLog({ records }: { records: OpenLoopSessionRecord[] }) {
  const recentRecords = records.slice(-12).reverse();

  return (
    <details className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Feedback Log
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Recent session records ingested into this live demo session.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
            {records.length} records
          </span>
        </div>
      </summary>

      <div className="mt-4 overflow-x-auto">
        {recentRecords.length > 0 ? (
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "ID",
                  "Source",
                  "Segment",
                  "Category",
                  "Severity",
                  "Cluster",
                  "Owner",
                  "Status",
                ].map((header) => (
                  <th
                    key={header}
                    className="pb-3 pr-4 font-bold text-stone-900"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRecords.map((record) => (
                <tr
                  key={record.sessionId}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {record.classification.feedbackId}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.source}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.customerSegment}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.category}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.severity}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.duplicateCluster}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {record.classification.likelyOwner}
                  </td>
                  <td className="py-3 align-top text-stone-700">
                    {record.classification.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm leading-6 text-stone-600">
            No session records yet. Click a preset, ingest custom feedback, or
            seed sample launch feedback.
          </p>
        )}
      </div>
    </details>
  );
}

function CompactCard({
  title,
  description,
  children,
  accent = false,
  outputAccent = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  accent?: boolean;
  outputAccent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 shadow-sm ${
        accent
          ? "border-stone-200 bg-stone-100"
          : "border-stone-200 bg-white"
      } ${outputAccent ? "border-r-teal-600" : ""}`}
    >
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-stone-600">
          {description}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function LabeledValue({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <dt className="text-sm font-bold text-stone-900">
        {label}
      </dt>
      <dd className="mt-1 leading-6 text-stone-700">{value}</dd>
    </div>
  );
}

function readSessionRecords(): OpenLoopSessionRecord[] {
  try {
    const rawRecords = window.localStorage.getItem(OPENLOOP_SESSION_KEY);

    if (!rawRecords) {
      return [];
    }

    const parsedRecords = JSON.parse(rawRecords);

    if (!Array.isArray(parsedRecords)) {
      return [];
    }

    return parsedRecords.filter(isSessionRecord);
  } catch {
    return [];
  }
}

function isSessionRecord(record: unknown): record is OpenLoopSessionRecord {
  if (!record || typeof record !== "object") {
    return false;
  }

  const possibleRecord = record as Partial<OpenLoopSessionRecord>;

  return Boolean(
    possibleRecord.sessionId &&
      possibleRecord.text &&
      possibleRecord.source &&
      possibleRecord.classification?.feedbackId,
  );
}

function calculateOpenLoopMetrics(records: OpenLoopSessionRecord[]) {
  const openClusters = new Set(
    records
      .map((record) => record.classification.duplicateCluster)
      .filter(isMeaningfulCluster),
  );
  const humanReviewQueue = records.filter((record) =>
    ["yes", "review recommended"].includes(
      record.classification.humanReviewNeeded.toLowerCase(),
    ),
  ).length;

  return {
    totalIngestedFeedback: records.length,
    openClusters: openClusters.size,
    openTasks: records.length,
    humanReviewQueue,
    completedTasks: 0,
  };
}

function isMeaningfulCluster(cluster: string) {
  const normalizedCluster = cluster.trim().toLowerCase();

  if (!normalizedCluster) {
    return false;
  }

  return ![
    "no cluster assigned",
    "no cluster",
    "unclear",
    "unassigned",
  ].some((placeholder) => normalizedCluster.includes(placeholder));
}

function getNextFeedbackId(records: OpenLoopSessionRecord[]) {
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

function withSessionFeedbackId(
  sample: FeedbackSample,
  feedbackId: string,
  source: SessionSource,
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

function createSessionRecord(
  sample: FeedbackSample,
  source: SessionSource,
  department: string,
): OpenLoopSessionRecord {
  return {
    sessionId: `${sample.classification.feedbackId}-${Date.now()}`,
    text: sample.text,
    source,
    department,
    ingestedAt: new Date().toISOString(),
    classification: sample.classification,
  };
}

function getDepartmentForClassification(
  classification: FeedbackSample["classification"],
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

function buildSeedSessionRecords(
  samples: FeedbackSample[],
  existingRecords: OpenLoopSessionRecord[],
) {
  if (samples.length === 0) {
    return [];
  }

  const departments = [
    "Product Ops",
    "Engineering",
    "Support",
    "Partner Success",
    "Policy / Safety",
    "Billing Ops",
    "Documentation",
  ];
  const sourceChannels = [
    "Support ticket",
    "Partner escalation",
    "Launch office hours",
    "Sales handoff",
    "Customer success note",
    "Internal QA",
    "Documentation review",
  ];
  const customerSegments = [
    "Enterprise admins",
    "External partner support teams",
    "Security reviewers",
    "Pilot workspace owners",
    "Billing administrators",
    "Customer success managers",
    "Policy reviewers",
  ];
  const severities: FeedbackSample["classification"]["severity"][] = [
    "Sev 2",
    "Sev 3",
    "Sev 4",
    "Sev 4",
    "Sev 5",
  ];
  const humanReviewStatuses = [
    "No",
    "No",
    "Review recommended",
    "Yes",
  ];
  const now = Date.now();
  const firstSeedIdNumber =
    Number(getNextFeedbackId(existingRecords).replace("FB-", "")) || FIRST_SESSION_FEEDBACK_ID;

  return Array.from({ length: SEED_RECORD_COUNT }, (_, index) => {
    const baseSample = samples[index % samples.length];
    const department = departments[index % departments.length];
    const feedbackId = `FB-${firstSeedIdNumber + index}`;
    const severity = severities[index % severities.length];
    const humanReviewNeeded = humanReviewStatuses[
      index % humanReviewStatuses.length
    ];
    const confidenceScore =
      humanReviewNeeded === "Yes"
        ? 58
        : humanReviewNeeded === "Review recommended"
          ? 76
          : Math.max(baseSample.classification.confidenceScore, 85);
    const confidenceLevel =
      confidenceScore >= 85 ? "High" : confidenceScore >= 65 ? "Medium" : "Low";
    const sessionSample: FeedbackSample = {
      ...baseSample,
      id: `${baseSample.id}-seed-${index}`,
      text: `${sourceChannels[index % sourceChannels.length]}: ${baseSample.text}`,
      classification: {
        ...baseSample.classification,
        confidenceLevel,
        confidenceScore,
        createdFrom: "Seed sample launch feedback",
        customerSegment: customerSegments[index % customerSegments.length],
        duplicateCluster: `${baseSample.classification.category} cluster ${index % 6 + 1}`,
        feedbackId,
        humanReviewNeeded,
        likelyOwner: department,
        severity,
        sourceChannel: sourceChannels[index % sourceChannels.length],
        status: humanReviewNeeded === "Yes" ? "Needs review" : "Routed",
      },
    };

    return {
      sessionId: `${feedbackId}-seed-${now + index}`,
      text: sessionSample.text,
      source: "Seed sample launch feedback" as const,
      department,
      ingestedAt: new Date(now + index * 1000).toISOString(),
      classification: sessionSample.classification,
    };
  });
}
