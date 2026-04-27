"use client";

import { useMemo, useState } from "react";
import { classifyFeedback } from "../../lib/product-readiness-os";
import type { FeedbackSample } from "../../types/product-readiness-os";
import {
  SectionHeading,
  SeverityBadge,
} from "./DashboardPrimitives";

export function FeedbackClassifier({
  samples,
}: {
  samples: FeedbackSample[];
}) {
  const [feedbackText, setFeedbackText] = useState(samples[0]?.text ?? "");

  const selectedSample = useMemo(
    () => classifyFeedback(feedbackText, samples),
    [feedbackText, samples],
  );

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Feedback intake and classification"
          title="Turn launch feedback into owner-ready action"
          description="Version 1 uses deterministic local mappings. The point is the operating system: consistent taxonomy, routing, impact language, and next action."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
            <label
              htmlFor="feedback-input"
              className="text-sm font-semibold text-stone-900"
            >
              Feedback input
            </label>
            <textarea
              id="feedback-input"
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              className="mt-3 min-h-32 w-full rounded-lg border border-stone-300 bg-white p-4 text-sm leading-6 text-stone-900 outline-none ring-teal-200 transition focus:border-teal-600 focus:ring-4"
            />

            <div className="mt-5">
              <p className="text-sm font-semibold text-stone-900">
                Preset feedback examples
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {samples.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setFeedbackText(sample.text)}
                    className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-left text-sm leading-5 text-stone-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    {sample.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            {selectedSample ? (
              <ClassificationResult sample={selectedSample} />
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  No local mapping found
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  Select one of the sample feedback items to show the v1
                  deterministic classification. A future version could add
                  review workflow or model-assisted suggestions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassificationResult({ sample }: { sample: FeedbackSample }) {
  const result = sample.classification;
  const rows = [
    ["Category", result.category],
    ["User impact", result.userImpact],
    ["Likely owner", result.likelyOwner],
    ["Recommended route", result.recommendedRoute],
    ["Engineering-ready problem statement", result.engineeringProblemStatement],
    ["Suggested support response", result.suggestedSupportResponse],
    ["Recommended next action", result.recommendedNextAction],
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            Classification result
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">
            {result.category}
          </h3>
        </div>
        <SeverityBadge severity={result.severity} />
      </div>

      <dl className="mt-6 space-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0">
            <dt className="text-sm font-semibold text-stone-900">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-stone-700">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
