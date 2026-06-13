import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';

export default function AuthCard({ title, subtitle, children, footerText, footerLink, footerLabel }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#ccfbf1,#f8fafc_48%,#eef2ff)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,#164e63,#0f172a_55%,#111827)]">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center gap-3 text-slate-950 dark:text-white">
          <span className="rounded-lg bg-ink p-3 text-white dark:bg-mint dark:text-slate-950">
            <Languages className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold">LinguaFlow</span>
        </Link>
        <div className="card">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {footerText}{' '}
            <Link className="font-bold text-lagoon dark:text-mint" to={footerLink}>
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
