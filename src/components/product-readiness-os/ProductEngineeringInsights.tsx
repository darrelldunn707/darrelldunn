import type { ProductInsights } from "../../types/product-readiness-os";
import { SectionHeading } from "./DashboardPrimitives";

export function ProductEngineeringInsights({
  insights,
}: {
  insights: ProductInsights;
}) {
  const feedbackEntries = Object.entries(
    insights.feedbackVolumeByCategory,
  ).sort(([, firstVolume], [, secondVolume]) => secondVolume - firstVolume);
  const maxVolume = Math.max(...feedbackEntries.map(([, volume]) => volume));

  return (
    <section id="insights" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Product and engineering insights"
          title="Launch signals translated into product action"
          description="The internal view connects support feedback to high-severity issues, customer pain points, and practical next steps for product, engineering, and support."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-stone-900">
              Feedback categories by volume
            </h3>
            <div className="mt-5 space-y-4">
              {feedbackEntries.map(([category, volume]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-stone-800">
                      {category}
                    </span>
                    <span className="text-stone-600">{volume} reports</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${(volume / maxVolume) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ListPanel
            title="Open high-severity issues"
            items={insights.openHighSeverityIssues}
            accent="rose"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <ListPanel
            title="Top customer pain points"
            items={insights.topCustomerPainPoints}
          />
          <ListPanel
            title="Recommended product actions"
            items={insights.recommendedProductActions}
          />
          <ListPanel
            title="Recommended support actions"
            items={insights.recommendedSupportActions}
          />
          <ListPanel
            title="Launch readiness concerns"
            items={insights.launchReadinessConcerns}
            accent="amber"
          />
        </div>
      </div>
    </section>
  );
}

function ListPanel({
  title,
  items,
  accent = "teal",
}: {
  title: string;
  items: string[];
  accent?: "teal" | "rose" | "amber";
}) {
  const accentClass = {
    teal: "bg-teal-600",
    rose: "bg-rose-500",
    amber: "bg-amber-500",
  }[accent];

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${accentClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
