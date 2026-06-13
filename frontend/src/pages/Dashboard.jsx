import { useEffect, useState } from 'react';
import { Heart, Languages, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import TranslationCard from '../components/TranslationCard.jsx';
import { api } from '../api/client.js';
import { languageName } from '../data/languages.js';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history/dashboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton rows={5} />;
  }

  return (
    <div>
      <PageHeader title="Dashboard" eyebrow="Overview" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total translations" value={data.totalTranslations} icon={Languages} />
        <MetricCard label="Favorites" value={data.favoriteCount} icon={Heart} tone="rose" />
        <MetricCard label="Weekly activity" value={data.weeklyActivity.reduce((sum, item) => sum + item.count, 0)} icon={TrendingUp} tone="emerald" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="card">
          <h2 className="text-xl font-extrabold">Most used languages</h2>
          <div className="mt-5 space-y-3">
            {data.languageUsage.length ? data.languageUsage.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg bg-white/70 px-4 py-3 dark:bg-white/10">
                <span className="font-semibold">{languageName(item._id)}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{item.count} translations</span>
              </div>
            )) : <p className="text-sm text-slate-500 dark:text-slate-400">Translate something to populate analytics.</p>}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold">Recent translations</h2>
          {data.recentTranslations.length ? data.recentTranslations.map((item) => (
            <TranslationCard key={item._id} item={item} compact />
          )) : <div className="card text-sm text-slate-500 dark:text-slate-400">No translations yet.</div>}
        </section>
      </div>
    </div>
  );
}
