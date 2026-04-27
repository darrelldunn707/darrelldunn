"use client";

import { useMemo, useState } from "react";
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
import type { ViewId } from "../../types/product-readiness-os";
import { CommandCenter } from "./CommandCenter";
import { DemoCapabilities } from "./DemoCapabilities";
import { FeedbackClassifier } from "./FeedbackClassifier";
import { LaunchScenarioPanel } from "./LaunchScenarioPanel";
import { PartnerView } from "./PartnerView";
import { ProductEngineeringInsights } from "./ProductEngineeringInsights";
import { RiskRegister } from "./RiskRegister";
import { SupportEnablementHub } from "./SupportEnablementHub";

const views: { id: ViewId; label: string; description: string }[] = [
  {
    id: "partner",
    label: "External Partner View",
    description: "Partner timeline, contact path, training, and beta limits.",
  },
  {
    id: "support",
    label: "Support Team View",
    description: "Playbook, macros, escalations, and feedback triage.",
  },
  {
    id: "command-center",
    label: "Launch Command Center",
    description: "Readiness checklist, risk register, owners, and blockers.",
  },
  {
    id: "product-engineering",
    label: "Product & Engineering View",
    description: "Feedback trends, high-severity issues, and actions.",
  },
];

export function ProductReadinessOSDemo() {
  const [activeView, setActiveView] = useState<ViewId>("command-center");
  const readinessScore = useMemo(
    () => calculateReadinessScore(readinessChecklist),
    [],
  );

  return (
    <main className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <Hero activeView={activeView} onViewChange={setActiveView} />
      <LaunchScenarioPanel
        scenario={launchScenario}
        readinessScore={readinessScore}
      />
      <AccessSeparation />
      <ActiveView activeView={activeView} readinessScore={readinessScore} />
      <DemoCapabilities />
    </main>
  );
}

function Hero({
  activeView,
  onViewChange,
}: {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}) {
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
            This fictional enterprise software feature launch simulation shows how a
            product engagement team could coordinate readiness, support
            enablement, feedback intake, routing, and launch reporting with
            lightweight local data.
          </p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-4" role="tablist" aria-label="Product Readiness OS views">
          {views.map((view) => {
            const isActive = activeView === view.id;

            return (
              <button
                key={view.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewChange(view.id)}
                className={`rounded-lg border p-4 text-left transition ${
                  isActive
                    ? "border-teal-600 bg-white shadow-md"
                    : "border-white/70 bg-white/60 hover:border-teal-300 hover:bg-white"
                }`}
              >
                <span className="block text-sm font-semibold text-stone-900">
                  {view.label}
                </span>
                <span className="mt-2 block text-sm leading-5 text-stone-600">
                  {view.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
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

function ActiveView({
  activeView,
  readinessScore,
}: {
  activeView: ViewId;
  readinessScore: number;
}) {
  if (activeView === "partner") {
    return <PartnerView partnerReadiness={partnerReadiness} />;
  }

  if (activeView === "support") {
    return (
      <>
        <SupportEnablementHub playbook={supportPlaybook} />
        <FeedbackClassifier samples={feedbackSamples} />
      </>
    );
  }

  if (activeView === "product-engineering") {
    return (
      <>
        <ProductEngineeringInsights insights={productInsights} />
        <FeedbackClassifier samples={feedbackSamples} />
      </>
    );
  }

  return (
    <>
      <CommandCenter
        groups={readinessChecklist}
        readinessScore={readinessScore}
      />
      <RiskRegister risks={riskRegister} />
    </>
  );
}
