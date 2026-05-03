import type {
  ReadinessStatus,
  RiskSeverity,
} from "../../types/product-readiness-os";

const statusClasses: Record<ReadinessStatus, string> = {
  Complete: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "At Risk": "border-amber-200 bg-amber-50 text-amber-800",
  Blocked: "border-rose-200 bg-rose-50 text-rose-800",
  "Not Started": "border-stone-200 bg-stone-50 text-stone-700",
};

const severityClasses: Record<RiskSeverity, string> = {
  Critical: "border-rose-300 bg-rose-100 text-rose-900",
  High: "border-orange-200 bg-orange-50 text-orange-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold text-stone-900 md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-stone-600 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: ReadinessStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${severityClasses[severity]}`}
    >
      {severity}
    </span>
  );
}

export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-4 text-sm text-stone-700">
          <span>{label}</span>
          <span className="font-semibold">{value}%</span>
        </div>
      ) : null}
      <div className="h-3 overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-amber-400"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  helper,
  openLoopNote,
}: {
  label: string;
  value: string | number;
  helper?: string;
  openLoopNote?: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-stone-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-5 text-stone-600">{helper}</p> : null}
      {openLoopNote ? <OpenLoopNote>{openLoopNote}</OpenLoopNote> : null}
    </div>
  );
}

export function OpenLoopNote({ children }: { children: string }) {
  return (
    <p className="mt-4 rounded-md border border-teal-100 bg-teal-50/50 px-3 py-2 text-xs leading-5 text-teal-900">
      {children}
    </p>
  );
}
