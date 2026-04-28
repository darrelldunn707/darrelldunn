"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  classifyCustomFeedback,
  classifyFeedback,
} from "../../lib/product-readiness-os";
import type { FeedbackSample } from "../../types/product-readiness-os";
import {
  SectionHeading,
} from "./DashboardPrimitives";

type ResultRow = [string, string | number];

export function FeedbackClassifier({
  samples,
}: {
  samples: FeedbackSample[];
}) {
  const [feedbackText, setFeedbackText] = useState(samples[0]?.text ?? "");
  const [selectedSample, setSelectedSample] = useState<FeedbackSample | undefined>(
    () => classifyFeedback(samples[0]?.text ?? "", samples),
  );

  function handlePresetSelect(sample: FeedbackSample) {
    setFeedbackText(sample.text);
    setSelectedSample(classifyFeedback(sample.text, samples));
  }

  function handleCustomClassify() {
    const trimmedFeedback = feedbackText.trim();

    if (!trimmedFeedback) {
      return;
    }

    setSelectedSample(
      classifyFeedback(trimmedFeedback, samples) ??
        classifyCustomFeedback(trimmedFeedback),
    );
  }

  return (
    <section id="feedback-router" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Feedback intake and classification"
          title="OpenLoop Feedback Router"
          description="Turns raw launch feedback into normalized records, severity, owner routing, duplicate-aware insights, and engineering-ready next actions."
        />

        {selectedSample ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <FeedbackInputCard
                feedbackText={feedbackText}
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
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FeedbackInputCard({
  feedbackText,
  samples,
  onFeedbackChange,
  onCustomClassify,
  onPresetSelect,
}: {
  feedbackText: string;
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
          Classify feedback
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-stone-900">
          Preset feedback examples
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
    <CompactCard
      title="Routing Decision Trail"
      description="Shows the decision logic OpenLoop used to select the owner, route, escalation path, and review status."
      outputAccent
    >
      <div className="overflow-x-auto">
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
    </CompactCard>
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
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">
        Normalized Feedback Record
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        Raw feedback becomes a structured operational record for routing,
        dedupe, reporting, and follow-up.
      </p>
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
    </div>
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
