import type { PartnerReadiness } from "../../types/product-readiness-os";
import { SectionHeading, StatusBadge } from "./DashboardPrimitives";

export function PartnerView({
  partnerReadiness,
}: {
  partnerReadiness: PartnerReadiness;
}) {
  return (
    <section id="partner-view" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="External partner view"
          title="Partner-facing readiness information"
          description="This view keeps the message focused on launch timing, training, contact paths, known limitations, and readiness requirements without exposing internal owners or severity routing."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
            <h3 className="text-lg font-semibold text-stone-900">
              Launch timeline
            </h3>
            <div className="mt-5 space-y-4">
              {partnerReadiness.timeline.map((item) => (
                <div
                  key={`${item.date}-${item.milestone}`}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4 first:border-t-0 first:pt-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {item.date}
                    </p>
                    <p className="mt-1 text-sm text-stone-700">
                      {item.milestone}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50 p-6">
            <h3 className="text-lg font-semibold text-stone-900">
              Training status
            </h3>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              {partnerReadiness.trainingStatus}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ListPanel
            title="Support contact path"
            items={partnerReadiness.supportContactPath}
          />
          <ListPanel
            title="Known limitations"
            items={partnerReadiness.knownLimitations}
          />
          <ListPanel
            title="Readiness requirements"
            items={partnerReadiness.readinessRequirements}
          />
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Partner FAQ
            </h3>
            <div className="mt-4 space-y-4">
              {partnerReadiness.faqs.map((faq) => (
                <div key={faq.question} className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-medium text-stone-900">{faq.question}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <ol className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item, index) => (
          <li key={item} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
