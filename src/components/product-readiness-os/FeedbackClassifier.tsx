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
  createdAt: string;
  ingestedAt: string;
  classification: FeedbackSample["classification"];
};

type ClusterTrend = "One-off" | "Watching" | "Rising" | "Escalating";

type ClusterSummary = {
  category: string;
  clusterName: string;
  customerSegment: string;
  totalReports: number;
  uniqueCustomersAffected: number;
  severeImpactCount: number;
  last24hReports: number;
  trend: ClusterTrend;
  suggestedOwner: string;
  prioritySignal: string;
};

type TaskPriority = "High" | "Medium" | "Low" | "Review";

type RoutedTask = {
  task: string;
  department: string;
  linkedCluster: string;
  priority: TaskPriority;
  status: "Open" | "Needs review" | "In progress";
  sourceSignal: string;
  totalReports: number;
  severeImpactCount: number;
  trend: ClusterTrend;
};

type SeedClusterProfile = Pick<
  FeedbackSample["classification"],
  | "category"
  | "customerSegment"
  | "duplicateCluster"
  | "featureWorkflow"
  | "issueType"
  | "likelyOwner"
  | "prioritySignal"
  | "recommendedRoute"
  | "subcategory"
> & {
  defaultSeverities: FeedbackSample["classification"]["severity"][];
  sampleFeedback: string;
  sourceChannel: string;
};

const OPENLOOP_SESSION_KEY = "openloopFeedbackSession";
const FIRST_SESSION_FEEDBACK_ID = 1028;
const CONFIRMATION_DURATION_MS = 12000;
const SEED_POOL_RECORD_COUNT = 70;
const SEED_RECORD_COUNT = 40;
const seedClusterWeights: Record<string, number> = {
  "SSO setup failures": 14,
  "Connector permissions confusion": 12,
  "Partner training gaps": 11,
  "Documentation mismatch": 10,
  "Voice audio cutoff": 8,
  "Admin onboarding confusion": 7,
  "Billing plan mismatch": 5,
  "Policy / Safety review confusion": 3,
};
const seedClusterProfiles: SeedClusterProfile[] = [
  {
    duplicateCluster: "Partner training gaps",
    category: "Partner Enablement",
    subcategory: "Training readiness",
    issueType: "Launch readiness gap",
    likelyOwner: "Partner Success",
    recommendedRoute: "Partner Success -> Product Ops",
    customerSegment: "External partners",
    featureWorkflow: "Partner launch training",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Recurring partner enablement gap affecting external support teams during the launch window.",
    sampleFeedback:
      "Partner support teams need clearer launch training before answering customer setup questions.",
    sourceChannel: "Partner escalation",
  },
  {
    duplicateCluster: "SSO setup failures",
    category: "Authentication / SSO",
    subcategory: "Authentication setup",
    issueType: "Launch blocker",
    likelyOwner: "Identity Engineering",
    recommendedRoute: "Support -> Identity Engineering escalation",
    customerSegment: "Enterprise admins using SSO",
    featureWorkflow: "SSO setup",
    defaultSeverities: ["Sev 2", "Sev 2", "Sev 3"],
    prioritySignal:
      "Recurring SSO setup failure affecting enterprise admins during the launch window.",
    sampleFeedback:
      "Enterprise admins report SSO setup failures when connecting the launch workspace.",
    sourceChannel: "Support ticket",
  },
  {
    duplicateCluster: "Connector permissions confusion",
    category: "Permissions",
    subcategory: "Access model clarity",
    issueType: "Usability / comprehension issue",
    likelyOwner: "Product Manager",
    recommendedRoute: "Support -> Product Ops -> Product Manager",
    customerSegment: "Enterprise admins",
    featureWorkflow: "Connector permissions",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Rising permissions confusion creating setup friction for enterprise admins.",
    sampleFeedback:
      "Admins are unsure which workspace permissions are required before connector setup.",
    sourceChannel: "Launch office hours",
  },
  {
    duplicateCluster: "Billing plan mismatch",
    category: "Billing",
    subcategory: "Plan eligibility",
    issueType: "Operational billing mismatch",
    likelyOwner: "Billing Ops",
    recommendedRoute: "Support -> Billing Ops -> Product Ops",
    customerSegment: "Billing administrators",
    featureWorkflow: "Plan validation",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Billing plan mismatch needs review before broader rollout.",
    sampleFeedback:
      "Billing admins see plan eligibility language that does not match launch access.",
    sourceChannel: "Sales handoff",
  },
  {
    duplicateCluster: "Documentation mismatch",
    category: "Documentation",
    subcategory: "Launch documentation accuracy",
    issueType: "Documentation gap",
    likelyOwner: "Documentation",
    recommendedRoute: "Support -> Documentation -> Product review",
    customerSegment: "Security reviewers and enterprise admins",
    featureWorkflow: "Setup documentation",
    defaultSeverities: ["Sev 4", "Sev 4", "Sev 5"],
    prioritySignal:
      "Rising documentation mismatch creating avoidable support volume.",
    sampleFeedback:
      "Customers report that setup docs and launch FAQs describe different approval steps.",
    sourceChannel: "Documentation review",
  },
  {
    duplicateCluster: "Policy / Safety review confusion",
    category: "Policy / Safety",
    subcategory: "Review path clarity",
    issueType: "Policy review routing issue",
    likelyOwner: "Policy / Safety",
    recommendedRoute: "Support -> Policy / Safety -> Product Ops",
    customerSegment: "Policy reviewers",
    featureWorkflow: "Safety review handoff",
    defaultSeverities: ["Sev 3", "Sev 4", "Sev 4"],
    prioritySignal:
      "Policy review routing confusion needs owner clarity before launch expansion.",
    sampleFeedback:
      "Policy reviewers need a clearer route for launch safety review questions.",
    sourceChannel: "Internal QA",
  },
  {
    duplicateCluster: "Voice audio cutoff",
    category: "Voice",
    subcategory: "Audio reliability",
    issueType: "Workflow failure",
    likelyOwner: "Voice Engineering",
    recommendedRoute: "Support -> Voice Engineering",
    customerSegment: "Enterprise pilot users",
    featureWorkflow: "Voice session playback",
    defaultSeverities: ["Sev 2", "Sev 3", "Sev 3"],
    prioritySignal:
      "Recurring voice audio cutoff affecting enterprise pilot users during launch validation.",
    sampleFeedback:
      "Enterprise pilot users report voice audio cutting off during launch validation sessions.",
    sourceChannel: "Customer success note",
  },
  {
    duplicateCluster: "Admin onboarding confusion",
    category: "Permissions",
    subcategory: "Admin setup guidance",
    issueType: "Onboarding comprehension issue",
    likelyOwner: "Product Ops",
    recommendedRoute: "Support -> Product Ops",
    customerSegment: "Workspace administrators",
    featureWorkflow: "Admin onboarding",
    defaultSeverities: ["Sev 4", "Sev 4", "Sev 5"],
    prioritySignal:
      "Admin onboarding confusion is creating repeated setup friction across launch accounts.",
    sampleFeedback:
      "Workspace administrators are unsure which onboarding step to complete after invite acceptance.",
    sourceChannel: "Support ticket",
  },
];

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

function DedupeTrendCluster({
  records,
}: {
  records: OpenLoopSessionRecord[];
}) {
  const clusterSummaries = getTopClusterSummaries(records);

  return (
    <CompactCard
      title="Dedupe + Trend Cluster"
      description="Top feedback clusters from this live demo session, grouped from ingested session records."
    >
      {clusterSummaries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Cluster",
                  "Reports",
                  "Customers",
                  "Sev 1 / Sev 2",
                  "Last 24h",
                  "Trend",
                  "Suggested Owner",
                  "Priority Signal",
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
              {clusterSummaries.map((cluster) => (
                <tr
                  key={cluster.clusterName}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {cluster.clusterName}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.totalReports}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.uniqueCustomersAffected}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.severeImpactCount}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.last24hReports}
                  </td>
                  <td className="py-3 pr-4 align-top font-semibold text-stone-900">
                    {cluster.trend}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {cluster.suggestedOwner}
                  </td>
                  <td className="py-3 align-top leading-6 text-stone-700">
                    {cluster.prioritySignal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-600">
          No active duplicate clusters yet. Ingest feedback or seed sample
          launch feedback to populate cluster trends.
        </p>
      )}
    </CompactCard>
  );
}

function RoutedTasks({ records }: { records: OpenLoopSessionRecord[] }) {
  const routedTasks = getRoutedTasks(records);

  return (
    <CompactCard
      title="Routed Tasks"
      description="Cluster-level follow-up work assigned to the department best positioned to resolve the signal."
    >
      {routedTasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200">
                {[
                  "Task",
                  "Department",
                  "Linked Cluster",
                  "Priority",
                  "Status",
                  "Source Signal",
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
              {routedTasks.map((task) => (
                <tr
                  key={task.linkedCluster}
                  className="border-b border-stone-100 last:border-0"
                >
                  <td className="py-3 pr-4 align-top font-bold text-stone-900">
                    {task.task}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.department}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.linkedCluster}
                  </td>
                  <td className="py-3 pr-4 align-top font-semibold text-stone-900">
                    {task.priority}
                  </td>
                  <td className="py-3 pr-4 align-top text-stone-700">
                    {task.status}
                  </td>
                  <td className="py-3 align-top leading-6 text-stone-700">
                    {task.sourceSignal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm leading-6 text-stone-600">
          No routed tasks yet. Ingest feedback or seed sample launch feedback
          to generate cluster-level tasks.
        </p>
      )}
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

    return parsedRecords.filter(isSessionRecord).map(normalizeSessionRecord);
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

function calculateOpenLoopMetrics(records: OpenLoopSessionRecord[]) {
  const humanReviewQueue = records.filter((record) =>
    ["yes", "review recommended"].includes(
      record.classification.humanReviewNeeded.toLowerCase(),
    ),
  ).length;

  return {
    totalIngestedFeedback: records.length,
    openClusters: getClusterSummaries(records).length,
    openTasks: getRoutedTasks(records).length,
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
    "needs triage",
  ].some((placeholder) => normalizedCluster.includes(placeholder));
}

function getTopClusterSummaries(records: OpenLoopSessionRecord[]) {
  return getClusterSummaries(records).slice(0, 5);
}

function getClusterSummaries(records: OpenLoopSessionRecord[]): ClusterSummary[] {
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

function buildClusterSummary(
  clusterName: string,
  records: OpenLoopSessionRecord[],
): ClusterSummary {
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
): ClusterTrend {
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
  trend: ClusterTrend,
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

function getRoutedTasks(records: OpenLoopSessionRecord[]) {
  return getClusterSummaries(records)
    .map(buildRoutedTask)
    .sort((firstTask, secondTask) => {
      const priorityDifference =
        getPriorityWeight(secondTask.priority) -
        getPriorityWeight(firstTask.priority);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      const trendDifference =
        getTrendWeight(secondTask.trend) - getTrendWeight(firstTask.trend);

      if (trendDifference !== 0) {
        return trendDifference;
      }

      if (secondTask.totalReports !== firstTask.totalReports) {
        return secondTask.totalReports - firstTask.totalReports;
      }

      return secondTask.severeImpactCount - firstTask.severeImpactCount;
    })
    .slice(0, 7);
}

function buildRoutedTask(cluster: ClusterSummary): RoutedTask {
  const profile = getSeedClusterProfile(cluster.clusterName);
  const priority = getTaskPriority(cluster);

  return {
    task: getTaskTitle(cluster, profile),
    department: getTaskDepartment(cluster, profile),
    linkedCluster: cluster.clusterName,
    priority,
    status: getTaskStatus(priority, cluster.trend),
    sourceSignal: getTaskSourceSignal(cluster, profile),
    totalReports: cluster.totalReports,
    severeImpactCount: cluster.severeImpactCount,
    trend: cluster.trend,
  };
}

function getTaskTitle(
  cluster: ClusterSummary,
  profile: SeedClusterProfile | undefined,
) {
  if (profile?.duplicateCluster === "Partner training gaps") {
    return "Update partner training materials and confirm launch guidance";
  }

  if (profile?.duplicateCluster === "SSO setup failures") {
    return "Investigate SSO setup failures and confirm auth configuration path";
  }

  if (profile?.duplicateCluster === "Connector permissions confusion") {
    return "Clarify connector permission requirements and route setup friction to owner";
  }

  if (profile?.duplicateCluster === "Billing plan mismatch") {
    return "Review billing plan mapping and update support escalation guidance";
  }

  if (profile?.duplicateCluster === "Documentation mismatch") {
    return "Update launch docs to match current product behavior";
  }

  if (profile?.duplicateCluster === "Policy / Safety review confusion") {
    return "Clarify safety review guidance and escalation rules";
  }

  if (profile?.duplicateCluster === "Voice audio cutoff") {
    return "Investigate session interruption reports and affected device patterns";
  }

  if (profile?.duplicateCluster === "Admin onboarding confusion") {
    return "Review onboarding friction and update launch readiness checklist";
  }

  return `Review ${cluster.clusterName} and assign follow-up owner`;
}

function getTaskDepartment(
  cluster: ClusterSummary,
  profile: SeedClusterProfile | undefined,
) {
  if (profile?.category === "Authentication / SSO" || profile?.category === "Voice") {
    return "Engineering";
  }

  if (profile?.category === "Partner Enablement") {
    return "Partner Success";
  }

  if (profile?.category === "Billing") {
    return "Billing Ops";
  }

  if (profile?.category === "Documentation") {
    return "Documentation";
  }

  if (profile?.category === "Policy / Safety") {
    return "Policy / Safety";
  }

  if (profile?.category === "Permissions") {
    return "Product Ops";
  }

  return normalizeDepartment(cluster.suggestedOwner);
}

function normalizeDepartment(owner: string) {
  const normalizedOwner = owner.toLowerCase();

  if (
    normalizedOwner.includes("engineering") ||
    normalizedOwner.includes("identity") ||
    normalizedOwner.includes("voice")
  ) {
    return "Engineering";
  }

  if (normalizedOwner.includes("partner")) {
    return "Partner Success";
  }

  if (normalizedOwner.includes("policy") || normalizedOwner.includes("safety")) {
    return "Policy / Safety";
  }

  if (normalizedOwner.includes("billing")) {
    return "Billing Ops";
  }

  if (normalizedOwner.includes("documentation")) {
    return "Documentation";
  }

  if (normalizedOwner.includes("support")) {
    return "Support";
  }

  return "Product Ops";
}

function getTaskPriority(cluster: ClusterSummary): TaskPriority {
  const normalizedCategory = cluster.category.toLowerCase();
  const normalizedSegment = cluster.customerSegment.toLowerCase();

  if (normalizedCategory.includes("triage")) {
    return "Review";
  }

  if (
    cluster.trend === "Escalating" ||
    cluster.severeImpactCount > 0 ||
    normalizedSegment.includes("enterprise") ||
    normalizedSegment.includes("partner")
  ) {
    return "High";
  }

  if (cluster.trend === "Rising") {
    return "Medium";
  }

  if (cluster.trend === "Watching") {
    return "Low";
  }

  return "Low";
}

function getTaskStatus(priority: TaskPriority, trend: ClusterTrend) {
  if (priority === "Review") {
    return "Needs review";
  }

  if (priority === "High" || trend === "Escalating") {
    return "In progress";
  }

  return "Open";
}

function getTaskSourceSignal(
  cluster: ClusterSummary,
  profile: SeedClusterProfile | undefined,
) {
  if (profile?.duplicateCluster === "Partner training gaps") {
    return "Partner enablement gap is recurring during the launch window";
  }

  if (profile?.duplicateCluster === "SSO setup failures") {
    return "Authentication issue is blocking launch-critical setup";
  }

  if (profile?.duplicateCluster === "Connector permissions confusion") {
    return "Admins are repeatedly confused by connector access requirements";
  }

  if (profile?.duplicateCluster === "Billing plan mismatch") {
    return "Billing mismatch is creating support and trust risk";
  }

  if (profile?.duplicateCluster === "Documentation mismatch") {
    return "Documentation mismatch is increasing support volume";
  }

  if (profile?.duplicateCluster === "Policy / Safety review confusion") {
    return "Review uncertainty requires policy alignment";
  }

  if (profile?.duplicateCluster === "Voice audio cutoff") {
    return "Reliability issue is recurring across recent reports";
  }

  if (profile?.duplicateCluster === "Admin onboarding confusion") {
    return "Admin setup confusion may slow enterprise rollout";
  }

  return cluster.prioritySignal;
}

function getPriorityWeight(priority: TaskPriority) {
  const weights: Record<TaskPriority, number> = {
    High: 4,
    Medium: 3,
    Low: 2,
    Review: 1,
  };

  return weights[priority];
}

function getTrendWeight(trend: ClusterTrend) {
  const weights: Record<ClusterTrend, number> = {
    Escalating: 4,
    Rising: 3,
    Watching: 2,
    "One-off": 1,
  };

  return weights[trend];
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

function getSeedClusterProfile(clusterName: string) {
  return seedClusterProfiles.find(
    (profile) =>
      profile.duplicateCluster.toLowerCase() === clusterName.toLowerCase(),
  );
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

  const humanReviewStatuses = [
    "No",
    "No",
    "Review recommended",
    "Yes",
  ];
  const now = Date.now();
  const firstSeedIdNumber =
    Number(getNextFeedbackId(existingRecords).replace("FB-", "")) || FIRST_SESSION_FEEDBACK_ID;
  const weightedProfiles = getWeightedSeedProfiles(now).slice(
    0,
    SEED_RECORD_COUNT,
  );

  return Array.from({ length: SEED_RECORD_COUNT }, (_, index) => {
    const profile = weightedProfiles[index % weightedProfiles.length];
    const baseSample =
      samples.find((sample) => sample.classification.category === profile.category) ??
      samples[index % samples.length];
    const department = profile.likelyOwner;
    const feedbackId = `FB-${firstSeedIdNumber + index}`;
    const severity =
      profile.defaultSeverities[index % profile.defaultSeverities.length];
    const humanReviewNeeded = humanReviewStatuses[
      index % humanReviewStatuses.length
    ];
    const createdAt = getSeedCreatedAt(now, index);
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
      text: `${profile.sourceChannel}: ${profile.sampleFeedback}`,
      classification: {
        ...baseSample.classification,
        category: profile.category,
        confidenceLevel,
        confidenceScore,
        createdFrom: "Seed sample launch feedback",
        customerSegment: profile.customerSegment,
        duplicateCluster: profile.duplicateCluster,
        featureWorkflow: profile.featureWorkflow,
        feedbackId,
        humanReviewNeeded,
        issueType: profile.issueType,
        likelyOwner: profile.likelyOwner,
        prioritySignal: profile.prioritySignal,
        recommendedRoute: profile.recommendedRoute,
        severity,
        sourceChannel: profile.sourceChannel,
        status: humanReviewNeeded === "Yes" ? "Needs review" : "Routed",
        subcategory: profile.subcategory,
      },
    };

    return {
      sessionId: `${feedbackId}-seed-${now + index}`,
      text: sessionSample.text,
      source: "Seed sample launch feedback" as const,
      department,
      createdAt,
      ingestedAt: createdAt,
      classification: sessionSample.classification,
    };
  });
}

function getWeightedSeedProfiles(seed: number) {
  const weightedProfiles = Array.from(
    { length: SEED_POOL_RECORD_COUNT },
    (_, index) => getWeightedSeedProfile(index),
  );

  return shuffleSeedProfiles(weightedProfiles, seed);
}

function getWeightedSeedProfile(index: number) {
  let remainingIndex = index % getSeedPoolWeight();

  for (const profile of seedClusterProfiles) {
    const weight = seedClusterWeights[profile.duplicateCluster] ?? 1;

    if (remainingIndex < weight) {
      return profile;
    }

    remainingIndex -= weight;
  }

  return seedClusterProfiles[0];
}

function getSeedPoolWeight() {
  return seedClusterProfiles.reduce(
    (totalWeight, profile) =>
      totalWeight + (seedClusterWeights[profile.duplicateCluster] ?? 1),
    0,
  );
}

function shuffleSeedProfiles(
  profiles: SeedClusterProfile[],
  seed: number,
) {
  const shuffledProfiles = [...profiles];
  let randomSeed = seed % 2147483647;

  for (let index = shuffledProfiles.length - 1; index > 0; index -= 1) {
    randomSeed = randomSeed * 16807 % 2147483647;
    const swapIndex = randomSeed % (index + 1);
    const currentProfile = shuffledProfiles[index];

    shuffledProfiles[index] = shuffledProfiles[swapIndex];
    shuffledProfiles[swapIndex] = currentProfile;
  }

  return shuffledProfiles;
}

function getSeedCreatedAt(now: number, index: number) {
  const hour = 60 * 60 * 1000;
  const offsetHours =
    index % 5 === 0
      ? 2 + (index % 4)
      : index % 3 === 0
        ? 12 + (index % 8)
        : 26 + (index % 46);

  return new Date(now - offsetHours * hour).toISOString();
}
