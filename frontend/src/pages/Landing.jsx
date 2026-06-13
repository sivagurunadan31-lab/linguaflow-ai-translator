import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Globe2, Languages, Lock, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { brand } from '../config/brand.js';

const features = [
  { icon: Globe2, title: 'Accurate global translation', text: 'Translate long-form copy through Microsoft Translator with automatic language detection.' },
  { icon: BarChart3, title: 'Usage intelligence', text: 'Track weekly activity, favorite phrases, and the languages your team relies on most.' },
  { icon: Lock, title: 'Secure workspace', text: 'JWT authentication, hashed passwords, rate limits, Helmet, CORS, and sanitized input.' }
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_10%,#ccfbf1_0,#f8fafc_34%,#eef2ff_100%)] text-slate-950 dark:bg-[radial-gradient(circle_at_15%_10%,#155e75_0,#0f172a_42%,#111827_100%)] dark:text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="rounded-lg bg-ink p-3 text-white dark:bg-mint dark:text-slate-950">
            <Languages className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold">LinguaFlow</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn-secondary px-3" aria-label="Toggle theme">
            <Moon className="h-4 w-4" />
          </button>
          <Link className="btn-secondary" to="/login">Log in</Link>
          <Link className="btn-primary" to={isAuthenticated ? '/dashboard' : '/register'}>Start free</Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/70 px-4 py-2 text-sm font-semibold text-lagoon dark:border-white/10 dark:bg-white/10 dark:text-mint">
              <Sparkles className="h-4 w-4" /> AI-ready translation workflows
            </div>
            <h1 className="max-w-4xl text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              LinguaFlow AI Translator
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A polished translation SaaS for creators and teams, with secure accounts, history, favorites, analytics, and export-ready translation output.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" to={isAuthenticated ? '/translator' : '/register'}>
                Open workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="btn-secondary" to="/login">View dashboard</Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass rounded-lg p-5"
          >
            <div className="grid gap-4">
              <div className="rounded-lg bg-white/75 p-5 dark:bg-slate-950/50">
                <div className="mb-3 text-xs font-bold uppercase text-lagoon dark:text-mint">Source</div>
                <p className="text-2xl font-bold leading-snug">Launch the campaign in every region this Friday.</p>
              </div>
              <div className="rounded-lg bg-ink p-5 text-white dark:bg-mint dark:text-slate-950">
                <div className="mb-3 text-xs font-bold uppercase opacity-70">Translated</div>
                <p className="text-2xl font-bold leading-snug">Lancez la campagne dans chaque region ce vendredi.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {['15 Languages', '2.4k Words', '99.9% Uptime'].map((item) => (
                  <div key={item} className="rounded-lg bg-white/70 p-4 text-sm font-bold dark:bg-white/10">{item}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3 lg:px-8">
          {features.map(({ icon: Icon, title, text }) => (
            <motion.div key={title} whileHover={{ y: -6 }} className="card">
              <Icon className="mb-5 h-8 w-8 text-lagoon dark:text-mint" />
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </motion.div>
          ))}
        </section>
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        © {brand.copyrightYear} {brand.productName}. Created by {brand.creatorName}.
      </footer>
    </div>
  );
}
