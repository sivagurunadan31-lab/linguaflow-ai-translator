import Translation from '../models/Translation.js';
import { translationProvider } from './translationProvider.js';
import { demoStore, isDemoMode } from '../utils/demoStore.js';

export const createTranslation = async ({ userId, text, sourceLanguage, targetLanguage }) => {
  const result = await translationProvider.translate({ text, sourceLanguage, targetLanguage });

  const payload = {
    userId,
    sourceLanguage,
    targetLanguage,
    detectedLanguage: result.detectedLanguage,
    originalText: text.trim(),
    translatedText: result.translatedText
  };

  return isDemoMode() ? demoStore.createTranslation(payload) : Translation.create(payload);
};
