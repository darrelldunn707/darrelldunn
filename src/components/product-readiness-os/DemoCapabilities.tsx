import { SectionHeading } from "./DashboardPrimitives";

const capabilities = [
  {
    title: "Launch coordination",
    description:
      "A shared scenario, timeline, workstream checklist, owners, and readiness score.",
  },
  {
    title: "Support readiness",
    description:
      "A practical playbook with FAQs, macros, known limitations, and launch-day checks.",
  },
  {
    title: "Scalable operating mechanisms",
    description:
      "Reusable structures for status, owner routing, escalation, and stakeholder views.",
  },
  {
    title: "Feedback taxonomy",
    description:
      "Local deterministic categories for reliability, permissions, authentication, documentation, and partner operations.",
  },
  {
    title: "Issue routing",
    description:
      "Clear routes from feedback signals to support, product, engineering, policy, and partner operations owners.",
  },
  {
    title: "Customer advocacy",
    description:
      "Customer impact is translated into problem statements and next actions.",
  },
  {
    title: "Product and engineering communication",
    description:
      "Support reports become concise issue summaries, trends, and product recommendations.",
  },
  {
    title: "Readiness reporting",
    description:
      "The command center shows score, status counts, workstream health, and launch concerns.",
  },
  {
    title: "Lightweight tooling thinking",
    description:
      "The first version uses local data and small utilities before adding backend complexity.",
  },
];

export function DemoCapabilities() {
  return (
    <section id="demo-mapping" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <SectionHeading
          eyebrow="Demo mapping"
          title="What this demo demonstrates"
          description="This work sample is designed around product engagement work: coordinating launch readiness, making support teams effective, and turning customer signals into owner-ready action."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="rounded-lg border border-stone-200 bg-stone-50 p-5"
            >
              <h3 className="font-semibold text-stone-900">
                {capability.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
