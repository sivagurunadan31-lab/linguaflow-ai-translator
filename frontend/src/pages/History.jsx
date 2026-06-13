import { useEffect, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import LanguageSelect from '../components/LanguageSelect.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import TranslationCard from '../components/TranslationCard.jsx';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

export default function History() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadHistory = async (page = 1) => {
    setLoading(true);
    const params = { page, limit: 8, ...(search && { search }), ...(language !== 'all' && { language }) };
    try {
      const { data } = await api.get('/history', { params });
      setItems(data.items);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(1);
  }, [language]);

  const submitSearch = (event) => {
    event.preventDefault();
    loadHistory(1);
  };

  const deleteItem = async (item) => {
    await api.delete(`/history/${item._id}`);
    showToast('Translation deleted', 'success');
    loadHistory(meta.page);
  };

  const clearAll = async () => {
    if (!confirm('Delete all translation history?')) return;
    await api.delete('/history');
    showToast('History cleared', 'success');
    loadHistory(1);
  };

  const toggleFavorite = async (item) => {
    await api.post(`/favorites/${item._id}`);
    loadHistory(meta.page);
  };

  return (
    <div>
      <PageHeader title="Translation History" eyebrow={`${meta.total} saved`} action={
        <button className="btn-secondary" onClick={clearAll}><Trash2 className="h-4 w-4" /> Clear all</button>
      } />
      <div className="card mb-5 grid gap-4 md:grid-cols-[1fr_220px]">
        <form onSubmit={submitSearch} className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input className="input pl-12" placeholder="Search original or translated text" value={search} onChange={(event) => setSearch(event.target.value)} />
        </form>
        <label>
          <span className="sr-only">Filter by language</span>
          <select className="input" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="all">All languages</option>
            <LanguageSelectOptions />
          </select>
        </label>
      </div>
      {loading ? <Skeleton rows={4} /> : (
        <div className="space-y-4">
          {items.map((item) => (
            <TranslationCard key={item._id} item={item} onDelete={deleteItem} onFavorite={toggleFavorite} />
          ))}
          {!items.length && <div className="card text-center text-slate-500 dark:text-slate-400">No translations found.</div>}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between">
        <button className="btn-secondary" disabled={meta.page <= 1} onClick={() => loadHistory(meta.page - 1)}>Previous</button>
        <span className="text-sm text-slate-500 dark:text-slate-400">Page {meta.page} of {meta.pages}</span>
        <button className="btn-secondary" disabled={meta.page >= meta.pages} onClick={() => loadHistory(meta.page + 1)}>Next</button>
      </div>
    </div>
  );
}

function LanguageSelectOptions() {
  const options = [
    ['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'], ['it', 'Italian'], ['pt', 'Portuguese'],
    ['hi', 'Hindi'], ['ta', 'Tamil'], ['te', 'Telugu'], ['zh-Hans', 'Chinese Simplified'], ['ja', 'Japanese'], ['ko', 'Korean'], ['ar', 'Arabic'], ['ru', 'Russian']
  ];
  return options.map(([code, name]) => <option key={code} value={code}>{name}</option>);
}
