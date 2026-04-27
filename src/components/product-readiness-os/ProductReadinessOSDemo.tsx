import Link from "next/link";
import {
  feedbackSamples,
  launchScenario,
  partnerReadiness,
  productInsights,
  readinessChecklist,
  riskRegister,
  supportPlaybook,
} from "../../data/product-readiness-os";
import { calculateReadinessScore } from "../../lib/product-readiness-os";
import { CommandCenter } from "./CommandCenter";
import { DemoCapabilities } from "./DemoCapabilities";
import { FeedbackClassifier } from "./FeedbackClassifier";
import { LaunchScenarioPanel } from "./LaunchScenarioPanel";
import { PartnerView } from "./PartnerView";
import { ProductEngineeringInsights } from "./ProductEngineeringInsights";
import { RiskRegister } from "./RiskRegister";
import { SupportEnablementHub } from "./SupportEnablementHub";

const heroLinks = [
  {
    label: "External Partner View",
    description: "Partner timeline, contact path, training, and beta limits.",
    href: "#partner-view",
  },
  {
    label: "Support Team View",
    description: "Playbook, macros, escalations, and feedback triage.",
    href: "#support-hub",
  },
  {
    label: "Launch Command Center",
    description: "Readiness checklist, risk register, owners, and blockers.",
    href: "#command-center",
  },
  {
    label: "Product & Engineering View",
    description: "Feedback trends, high-severity issues, and actions.",
    href: "#insights",
  },
];

const sectionLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Feedback Router", href: "#feedback-router" },
  { label: "Command Center", href: "#command-center" },
  { label: "Risks", href: "#risks" },
  { label: "Support Hub", href: "#support-hub" },
  { label: "Partner View", href: "#partner-view" },
  { label: "Insights", href: "#insights" },
  { label: "Demo Mapping", href: "#demo-mapping" },
];

export function ProductReadinessOSDemo() {
  const readinessScore = calculateReadinessScore(readinessChecklist);

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <GlobalHeader />
      <Hero />
      <SectionNavigation />
      <LaunchScenarioPanel
        scenario={launchScenario}
        readinessScore={readinessScore}
      />
      <FeedbackClassifier samples={feedbackSamples} />
      <AccessSeparation />
      <CommandCenter
        groups={readinessChecklist}
        readinessScore={readinessScore}
      />
      <RiskRegister risks={riskRegister} />
      <SupportEnablementHub playbook={supportPlaybook} />
      <PartnerView partnerReadiness={partnerReadiness} />
      <ProductEngineeringInsights insights={productInsights} />
      <DemoCapabilities />
    </main>
  );
}

function GlobalHeader() {
  return (
    <header className="border-b border-stone-200 bg-white/95">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="text-sm font-semibold text-stone-950">
          Darrell Dunn
        </Link>
        <Link
          href="/product-readiness-os"
          className="text-sm font-medium text-stone-700 transition hover:text-teal-700"
        >
          Product Readiness OS
        </Link>
        <span className="text-sm font-medium text-stone-500">Contact</span>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-[linear-gradient(135deg,#fff7ed_0%,#fefce8_42%,#ecfdf5_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            Portfolio demo
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-stone-900 md:text-6xl">
            Product Readiness OS
          </h1>
          <p className="mt-5 text-xl leading-8 text-stone-800">
            A launch readiness and feedback operations demo for product,
            support, and engineering teams.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700">
            This fictional work sample uses an enterprise software feature
            launch simulation to show how a product engagement team could
            coordinate readiness, support enablement, feedback intake, routing,
            and launch reporting with lightweight local data.
          </p>
        </div>

        <div
          className="mt-10 grid gap-3 lg:grid-cols-4"
          aria-label="Featured Product Readiness OS sections"
        >
          {heroLinks.map((view) => (
            <a
              key={view.href}
              href={view.href}
              className="rounded-lg border border-white/70 bg-white/70 p-4 text-left shadow-sm transition hover:border-teal-400 hover:bg-white hover:shadow-md"
            >
              <span className="block text-sm font-semibold text-stone-900">
                {view.label}
              </span>
              <span className="mt-2 block text-sm leading-5 text-stone-600">
                {view.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionNavigation() {
  return (
    <nav className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 md:px-8">
        <div className="flex min-w-max gap-2 py-3" aria-label="Product Readiness OS sections">
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-teal-50 hover:text-teal-800"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function AccessSeparation() {
  return (
    <section className="bg-stone-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            External separation
          </p>
          <h2 className="mt-2 text-xl font-semibold">Partner-facing view</h2>
          <p className="mt-2 text-sm leading-6 text-stone-200">
            External partners see launch timing, training status, contact paths,
            known limitations, readiness requirements, and partner FAQ only.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
            Internal operating view
          </p>
          <h2 className="mt-2 text-xl font-semibold">Team coordination layer</h2>
          <p className="mt-2 text-sm leading-6 text-stone-200">
            Internal teams see risks, owners, severity, routing, mitigation
            plans, feedback classification, and product or engineering actions.
          </p>
        </div>
      </div>
    </section>
  );
}
