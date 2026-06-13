export default function MetricCard({ label, value, icon: Icon, tone = 'cyan' }) {
  const tones = {
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200'
  };

  return (
    <div className="card">
      <div className={`mb-5 inline-flex rounded-lg p-3 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}
