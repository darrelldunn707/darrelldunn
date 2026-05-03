import type { ReactNode } from "react";

export function OpenLoopCard({
  title,
  description,
  children,
  accent = false,
  outputAccent = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  accent?: boolean;
  outputAccent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 shadow-sm ${
        accent
          ? "border-stone-200 bg-stone-100"
          : "border-stone-200 bg-white"
      } ${outputAccent ? "border-r-teal-600" : ""}`}
    >
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-stone-600">
          {description}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}
