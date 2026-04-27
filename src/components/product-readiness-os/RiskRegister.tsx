import type { RiskRegisterItem } from "../../types/product-readiness-os";
import { SectionHeading, SeverityBadge } from "./DashboardPrimitives";

export function RiskRegister({ risks }: { risks: RiskRegisterItem[] }) {
  return (
    <section id="risks" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Risk register"
          title="Launch risks with owners, mitigation plans, and escalation paths"
          description="This internal view keeps customer-facing readiness separate from the operational details support, product, and engineering need to manage launch risk."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {risks.map((risk) => (
            <article
              key={risk.id}
              className="rounded-lg border border-stone-200 bg-stone-50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">
                    {risk.title}
                  </h3>
                  <p className="mt-1 text-sm text-stone-600">
                    Owner: {risk.owner}
                  </p>
                </div>
                <SeverityBadge severity={risk.severity} />
              </div>

              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="font-semibold text-stone-900">
                    Affected audience
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-700">
                    {risk.affectedAudience}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-stone-900">
                    Mitigation plan
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-700">
                    {risk.mitigationPlan}
                  </dd>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-stone-900">Status</dt>
                    <dd className="mt-1 text-stone-700">{risk.status}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-stone-900">
                      Escalation path
                    </dt>
                    <dd className="mt-1 text-stone-700">
                      {risk.escalationPath}
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
