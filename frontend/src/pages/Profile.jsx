import { Calendar, Mail, Shield, User } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" eyebrow="Account" />
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <section className="card text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-ink text-3xl font-extrabold text-white dark:bg-mint dark:text-slate-950">
            {user?.name?.charAt(0)}
          </div>
          <h2 className="mt-4 text-2xl font-extrabold">{user?.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        </section>
        <section className="card">
          <h2 className="text-xl font-extrabold">Account details</h2>
          <div className="mt-5 grid gap-3">
            <InfoRow icon={User} label="Name" value={user?.name} />
            <InfoRow icon={Mail} label="Email" value={user?.email} />
            <InfoRow icon={Shield} label="Role" value={user?.role} />
            <InfoRow icon={Calendar} label="Member since" value={new Date(user?.createdAt).toLocaleDateString()} />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white/70 p-4 dark:bg-white/10">
      <Icon className="h-5 w-5 text-lagoon dark:text-mint" />
      <div>
        <div className="text-xs font-bold uppercase text-slate-400">{label}</div>
        <div className="font-semibold capitalize">{value}</div>
      </div>
    </div>
  );
}
