import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, Heart, History, Languages, LogOut, Moon, Shield, Sun, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/translator', label: 'Translator', icon: Languages },
  { to: '/history', label: 'History', icon: History },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1_0,#f8fafc_35%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,#155e75_0,#0f172a_42%,#111827_100%)] dark:text-white">
      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-white/50 bg-white/85 px-3 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-r lg:border-t-0 lg:p-5">
        <div className="hidden lg:block">
          <div className="text-xl font-extrabold">LinguaFlow</div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">AI translation workspace</div>
        </div>
        <nav className="mt-0 grid grid-cols-5 gap-1 lg:mt-8 lg:flex lg:flex-col lg:gap-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-xs font-semibold transition lg:justify-start lg:text-sm ${
                  isActive
                    ? 'bg-ink text-white shadow-lg shadow-cyan-900/20 dark:bg-mint dark:text-slate-950'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className="hidden items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10 lg:flex">
              <Shield className="h-5 w-5" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="mt-auto hidden pt-8 lg:block">
          <div className="card mb-3">
            <div className="text-sm font-bold">{user?.name}</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="btn-secondary flex-1" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={onLogout} className="btn-secondary flex-1" aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="pb-24 lg:ml-72 lg:pb-0">
        <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
