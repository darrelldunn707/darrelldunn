import type { SupportPlaybook } from "../../types/product-readiness-os";
import { SectionHeading } from "./DashboardPrimitives";

export function SupportEnablementHub({
  playbook,
}: {
  playbook: SupportPlaybook;
}) {
  return (
    <section className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Support enablement hub"
          title="Playbooks, macros, known limits, and escalation paths"
          description="Support teams get practical guidance for launch-day triage without needing a separate backend or fake login in this first version."
        />

        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-900">
            Support playbook summary
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            {playbook.summary}
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              FAQ examples
            </h3>
            <div className="mt-4 space-y-4">
              {playbook.faqs.map((faq) => (
                <div key={faq.question} className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-medium text-stone-900">{faq.question}</p>
                  <p className="mt-1 text-sm leading-6 text-stone-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Internal support macros
            </h3>
            <div className="mt-4 space-y-4">
              {playbook.macros.map((macro) => (
                <div key={macro.title} className="border-t border-stone-200 pt-4 first:border-t-0 first:pt-0">
                  <p className="font-medium text-stone-900">{macro.title}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                    Trigger
                  </p>
                  <p className="mt-1 text-sm text-stone-700">{macro.trigger}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {macro.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Escalation matrix
            </h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-600">
                    <th className="py-3 pr-4 font-semibold">Signal</th>
                    <th className="py-3 pr-4 font-semibold">Route to</th>
                    <th className="py-3 font-semibold">Response time</th>
                  </tr>
                </thead>
                <tbody>
                  {playbook.escalationMatrix.map((item) => (
                    <tr key={item.signal} className="border-b border-stone-100 last:border-0">
                      <td className="py-3 pr-4 text-stone-800">{item.signal}</td>
                      <td className="py-3 pr-4 text-stone-800">{item.routeTo}</td>
                      <td className="py-3 text-stone-700">{item.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <ListCard title="Known limitations" items={playbook.knownLimitations} />
            <ListCard
              title="Launch-day support checklist"
              items={playbook.launchDayChecklist}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
