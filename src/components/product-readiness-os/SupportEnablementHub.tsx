"use client";

import type { SupportPlaybook } from "../../types/product-readiness-os";
import { OpenLoopNote, SectionHeading } from "./DashboardPrimitives";
import { OpenLoopSignalCard } from "./openloop/OpenLoopSignalCard";
import { useOpenLoop } from "./openloop/OpenLoopProvider";

const supportSignalDepartments = new Set([
  "Support",
  "Documentation",
  "Partner Success",
]);

export function SupportEnablementHub({
  playbook,
}: {
  playbook: SupportPlaybook;
}) {
  const { routedTasks } = useOpenLoop();
  const completedTasks = routedTasks.filter((task) => task.status === "Completed");
  const completedSupportTasks = routedTasks.filter(
    (task) =>
      task.status === "Completed" &&
      supportSignalDepartments.has(task.department),
  );
  const openSupportTasks = routedTasks.filter(
    (task) =>
      task.status !== "Completed" &&
      supportSignalDepartments.has(task.department),
  );
  const hasCompletedFollowUps = completedSupportTasks.length > 0;
  const completedSupportCount = getCompletedDepartmentCount(
    completedSupportTasks,
    "Support",
  );
  const completedDocumentationCount = getCompletedDepartmentCount(
    completedSupportTasks,
    "Documentation",
  );
  const completedPartnerCount = getCompletedDepartmentCount(
    completedSupportTasks,
    "Partner Success",
  );
  const defaultOpenLoopNote =
    "OpenLoop: no completed operational follow-ups yet.";

  return (
    <section id="support-hub" className="scroll-mt-20 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <SectionHeading
          eyebrow="Support enablement hub"
          title="Playbooks, macros, known limits, and escalation paths"
          description="Support teams get practical guidance for launch-day triage without needing a separate backend or fake login in this first version."
        />

        <OpenLoopSignalCard
          title="OpenLoop Support Signal"
          description={
            hasCompletedFollowUps
              ? `Support guidance follow-up completed for ${completedSupportTasks.length} routed task${completedSupportTasks.length === 1 ? "" : "s"}. Documentation or partner enablement follow-up may still be needed for open clusters.`
              : "No completed OpenLoop follow-ups yet. Ingest feedback, seed sample launch feedback, and complete routed tasks to populate this signal."
          }
          emptyMessage={
            hasCompletedFollowUps
              ? undefined
              : "Static support playbook content remains unchanged."
          }
          stats={[
            ["Support follow-ups", getCompletedDepartmentCount(completedSupportTasks, "Support")],
            ["Docs follow-ups", getCompletedDepartmentCount(completedSupportTasks, "Documentation")],
            ["Partner follow-ups", getCompletedDepartmentCount(completedSupportTasks, "Partner Success")],
            ["Open support clusters", openSupportTasks.length],
          ]}
          notes={
            hasCompletedFollowUps
              ? completedSupportTasks
                  .slice(0, 3)
                  .map(
                    (task) =>
                      `${task.department} follow-up completed for ${task.linkedCluster}.`,
                  )
              : undefined
          }
        />

        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-stone-900">
            Support playbook summary
          </h3>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            {playbook.summary}
          </p>
          <OpenLoopNote>
            {hasCompletedFollowUps
              ? `OpenLoop: ${formatCount(completedSupportTasks.length, "support, documentation, or partner follow-up")} completed; source playbook content unchanged.`
              : defaultOpenLoopNote}
          </OpenLoopNote>
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
            <OpenLoopNote>
              {completedSupportCount > 0
                ? `OpenLoop: support guidance follow-up completed for ${formatCount(completedSupportCount, "routed task")}.`
                : defaultOpenLoopNote}
            </OpenLoopNote>
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
            <OpenLoopNote>
              {completedTasks.length > 0
                ? `OpenLoop: escalation follow-up completed for ${formatCount(completedTasks.length, "routed task")}; escalation path not marked final.`
                : defaultOpenLoopNote}
            </OpenLoopNote>
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
            <ListCard
              title="Known limitations"
              items={playbook.knownLimitations}
              openLoopNote={
                openSupportTasks.length > 0
                  ? `OpenLoop: ${formatCount(openSupportTasks.length, "support-related routed task")} still ${openSupportTasks.length === 1 ? "needs" : "need"} owner attention.`
                  : hasCompletedFollowUps
                    ? "OpenLoop: related support follow-ups moved into monitoring; known limits unchanged."
                    : defaultOpenLoopNote
              }
            />
            <ListCard
              title="Launch-day support checklist"
              items={playbook.launchDayChecklist}
              openLoopNote={
                completedDocumentationCount > 0 || completedPartnerCount > 0
                  ? `OpenLoop: ${formatCount(completedDocumentationCount, "documentation follow-up")} and ${formatCount(completedPartnerCount, "partner enablement follow-up")} completed; checklist content unchanged.`
                  : defaultOpenLoopNote
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function getCompletedDepartmentCount(
  tasks: Array<{ department: string }>,
  department: string,
) {
  return tasks.filter((task) => task.department === department).length;
}

function formatCount(count: number, singularLabel: string) {
  return `${count} ${singularLabel}${count === 1 ? "" : "s"}`;
}

function ListCard({
  title,
  items,
  openLoopNote,
}: {
  title: string;
  items: string[];
  openLoopNote?: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      {openLoopNote ? <OpenLoopNote>{openLoopNote}</OpenLoopNote> : null}
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
