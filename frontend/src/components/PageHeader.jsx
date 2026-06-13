export default function PageHeader({ title, eyebrow, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-lagoon dark:text-mint">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950 dark:text-white">{title}</h1>
      </div>
      {action}
    </div>
  );
}
