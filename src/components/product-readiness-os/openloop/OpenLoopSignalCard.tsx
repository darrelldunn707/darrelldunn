export function OpenLoopSignalCard({
  title,
  description,
  stats,
  notes,
  emptyMessage,
}: {
  title: string;
  description: string;
  stats?: Array<[string, string | number]>;
  notes?: string[];
  emptyMessage?: string;
}) {
  return (
    <div className="mt-6 rounded-lg border border-teal-100 bg-teal-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-stone-700">{description}</p>

      {emptyMessage ? (
        <p className="mt-4 rounded-lg bg-white p-3 text-sm leading-6 text-stone-700 shadow-sm">
          {emptyMessage}
        </p>
      ) : null}

      {stats?.length ? (
        <dl className="mt-4 grid gap-2 md:grid-cols-3">
          {stats.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white p-3 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                {label}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-stone-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {notes?.length ? (
        <ul className="mt-4 grid gap-2 text-sm leading-6 text-stone-700 md:grid-cols-3">
          {notes.map((note) => (
            <li key={note} className="rounded-lg bg-white p-3 shadow-sm">
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
