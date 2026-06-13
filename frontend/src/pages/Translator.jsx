import { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Copy, Download, Eraser, Heart, Repeat2, Send, Share2, Volume2 } from 'lucide-react';
import LanguageSelect from '../components/LanguageSelect.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { api } from '../api/client.js';
import { useToast } from '../context/ToastContext.jsx';
import { languageName } from '../data/languages.js';
import { speakText } from '../utils/speech.js';

export default function Translator() {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [text]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const translate = async () => {
    if (!text.trim()) {
      showToast('Enter text before translating', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/translate', { text, sourceLanguage, targetLanguage });
      setTranslation(data.translation);
      showToast('Translation saved to history', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Translation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLanguage === 'auto') {
      showToast('Choose a source language before swapping', 'info');
      return;
    }
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    if (translation) {
      setText(translation.translatedText);
      setTranslation(null);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(translation.translatedText);
    showToast('Copied to clipboard', 'success');
  };

  const speak = () => {
    speakText({
      text: translation.translatedText,
      languageCode: translation.targetLanguage,
      onStart: (message) => showToast(message, 'success'),
      onError: (message) => showToast(message, 'error')
    });
  };

  const downloadTxt = () => {
    const blob = new Blob([translation.translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'linguaflow-translation.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('LinguaFlow Translation', 14, 18);
    doc.setFontSize(11);
    doc.text(`From ${languageName(translation.detectedLanguage || translation.sourceLanguage)} to ${languageName(translation.targetLanguage)}`, 14, 30);
    doc.text(doc.splitTextToSize(translation.translatedText, 180), 14, 44);
    doc.save('linguaflow-translation.pdf');
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'LinguaFlow Translation', text: translation.translatedText });
      return;
    }
    copy();
  };

  const toggleFavorite = async () => {
    const { data } = await api.post(`/favorites/${translation._id}`);
    setTranslation(data.translation);
    showToast(data.translation.favorite ? 'Added to favorites' : 'Removed from favorites', 'success');
  };

  return (
    <div>
      <PageHeader title="Translation Workspace" eyebrow="Create" />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <section className="card">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <LanguageSelect label="Source language" value={sourceLanguage} onChange={setSourceLanguage} allowAuto />
            <button className="btn-secondary h-12 px-3" onClick={swapLanguages} aria-label="Swap languages">
              <Repeat2 className="h-5 w-5" />
            </button>
            <LanguageSelect label="Target language" value={targetLanguage} onChange={setTargetLanguage} />
          </div>
          <textarea
            ref={textRef}
            className="input mt-5 min-h-72 resize-none text-base leading-7"
            maxLength={5000}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste text to translate..."
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">{text.length}/5000 characters | {words} words</div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-secondary" onClick={() => { setText(''); setTranslation(null); }}>
                <Eraser className="h-4 w-4" /> Clear
              </button>
              <button className="btn-primary" onClick={translate} disabled={loading}>
                <Send className="h-4 w-4" /> {loading ? 'Translating...' : 'Translate'}
              </button>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold">Output</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Side-by-side comparison and exports</p>
            </div>
            {translation && (
              <button className="btn-secondary px-3" onClick={toggleFavorite} aria-label="Toggle favorite">
                <Heart className={`h-4 w-4 ${translation.favorite ? 'fill-coral text-coral' : ''}`} />
              </button>
            )}
          </div>
          {translation ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white/70 p-4 dark:bg-slate-950/40">
                  <div className="mb-2 text-xs font-bold uppercase text-slate-400">Original</div>
                  <p className="whitespace-pre-wrap leading-7">{translation.originalText}</p>
                </div>
                <div className="rounded-lg bg-cyan-50 p-4 dark:bg-cyan-400/10">
                  <div className="mb-2 text-xs font-bold uppercase text-lagoon dark:text-mint">Translated</div>
                  <p className="whitespace-pre-wrap font-medium leading-7">{translation.translatedText}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={copy}><Copy className="h-4 w-4" /> Copy</button>
                <button className="btn-secondary" onClick={speak}><Volume2 className="h-4 w-4" /> Speak</button>
                <button className="btn-secondary" onClick={downloadTxt}><Download className="h-4 w-4" /> TXT</button>
                <button className="btn-secondary" onClick={downloadPdf}><Download className="h-4 w-4" /> PDF</button>
                <button className="btn-secondary" onClick={share}><Share2 className="h-4 w-4" /> Share</button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-96 items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-slate-500 dark:border-white/10 dark:text-slate-400">
              Your translated text will appear here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
