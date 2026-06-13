import { Copy, Heart, Trash2, Volume2 } from 'lucide-react';
import { languageName } from '../data/languages.js';
import { speakText } from '../utils/speech.js';
import { useToast } from '../context/ToastContext.jsx';

export default function TranslationCard({ item, onDelete, onFavorite, compact = false }) {
  const { showToast } = useToast();

  const speak = () => {
    speakText({
      text: item.translatedText,
      languageCode: item.targetLanguage,
      onStart: (message) => showToast(message, 'success'),
      onError: (message) => showToast(message, 'error')
    });
  };

  return (
    <article className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-semibold text-lagoon dark:text-mint">
          {languageName(item.detectedLanguage || item.sourceLanguage)} to {languageName(item.targetLanguage)}
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-3" onClick={() => navigator.clipboard.writeText(item.translatedText)} aria-label="Copy translation">
            <Copy className="h-4 w-4" />
          </button>
          <button className="btn-secondary px-3" onClick={speak} aria-label="Speak translation">
            <Volume2 className="h-4 w-4" />
          </button>
          <button className="btn-secondary px-3" onClick={() => onFavorite?.(item)} aria-label="Toggle favorite">
            <Heart className={`h-4 w-4 ${item.favorite ? 'fill-coral text-coral' : ''}`} />
          </button>
          {onDelete && (
            <button className="btn-secondary px-3" onClick={() => onDelete(item)} aria-label="Delete translation">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
        <p className="rounded-lg bg-white/70 p-4 text-sm leading-6 text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">{item.originalText}</p>
        <p className="rounded-lg bg-cyan-50 p-4 text-sm font-medium leading-6 text-slate-900 dark:bg-cyan-400/10 dark:text-white">{item.translatedText}</p>
      </div>
    </article>
  );
}
