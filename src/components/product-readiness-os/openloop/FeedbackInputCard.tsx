import type { FeedbackSample } from "../../../types/product-readiness-os";

export function FeedbackInputCard({
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
