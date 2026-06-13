import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import Skeleton from '../components/Skeleton.jsx';
import TranslationCard from '../components/TranslationCard.jsx';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadFavorites = async () => {
    setLoading(true);
    const { data } = await api.get('/favorites');
    setItems(data.items);
    setLoading(false);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (item) => {
    await api.post(`/favorites/${item._id}`);
    showToast('Removed from favorites', 'success');
    loadFavorites();
  };

  return (
    <div>
      <PageHeader title="Favorites" eyebrow={`${items.length} pinned`} />
      {loading ? <Skeleton rows={4} /> : (
        <div className="space-y-4">
          {items.map((item) => <TranslationCard key={item._id} item={item} onFavorite={removeFavorite} />)}
          {!items.length && <div className="card text-center text-slate-500 dark:text-slate-400">Favorite translations will appear here.</div>}
        </div>
      )}
    </div>
  );
}
