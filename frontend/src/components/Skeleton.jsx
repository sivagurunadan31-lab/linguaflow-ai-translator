export default function Skeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-lg bg-white/60 dark:bg-white/10" />
      ))}
    </div>
  );
}
