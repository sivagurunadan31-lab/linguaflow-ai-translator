import { useEffect, useState } from 'react';
import { Languages, Star, Users } from 'lucide-react';
import MetricCard from '../components/MetricCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { api } from '../api/client.js';

export default function Admin() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([stats, userResponse]) => {
        setData(stats.data);
        setUsers(userResponse.data.users);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Skeleton rows={5} />;
  }

  return (
    <div>
      <PageHeader title="Admin Dashboard" eyebrow="Platform analytics" />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Users" value={data.userCount} icon={Users} />
        <MetricCard label="Translations" value={data.translationCount} icon={Languages} tone="emerald" />
        <MetricCard label="Favorites" value={data.favoriteCount} icon={Star} tone="rose" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-xl font-extrabold">Recent users</h2>
          <div className="mt-4 space-y-3">
            {users.slice(0, 8).map((user) => (
              <div key={user._id} className="flex items-center justify-between rounded-lg bg-white/70 p-4 dark:bg-white/10">
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                </div>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">{user.role}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <h2 className="text-xl font-extrabold">Recent translations</h2>
          <div className="mt-4 space-y-3">
            {data.recentTranslations.map((item) => (
              <div key={item._id} className="rounded-lg bg-white/70 p-4 dark:bg-white/10">
                <div className="mb-1 text-sm font-bold">{item.userId?.name || 'Unknown user'}</div>
                <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{item.originalText}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
