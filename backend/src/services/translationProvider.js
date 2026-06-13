import axios from 'axios';
import { randomUUID } from 'crypto';
import { AppError } from '../utils/AppError.js';

class MicrosoftTranslatorProvider {
  constructor() {
    this.endpoint = process.env.MICROSOFT_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
    this.key = process.env.MICROSOFT_TRANSLATOR_KEY;
    this.region = process.env.MICROSOFT_TRANSLATOR_REGION;
  }

  async translate({ text, sourceLanguage, targetLanguage }) {
    if (!this.key || !this.region) {
      return this.translateWithPublicFallback({ text, sourceLanguage, targetLanguage });
    }

    const params = new URLSearchParams({
      'api-version': '3.0',
      to: targetLanguage
    });

    if (sourceLanguage && sourceLanguage !== 'auto') {
      params.set('from', sourceLanguage);
    }

    const response = await axios.post(
      `${this.endpoint}/translate?${params.toString()}`,
      [{ text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': this.key,
          'Ocp-Apim-Subscription-Region': this.region,
          'Content-Type': 'application/json',
          'X-ClientTraceId': randomUUID()
        },
        timeout: 15000
      }
    );

    const result = response.data?.[0];
    const translatedText = result?.translations?.[0]?.text;

    if (!translatedText) {
      throw new AppError('Translation provider returned an empty response', 502);
    }

    return {
      translatedText,
      detectedLanguage: result.detectedLanguage?.language || sourceLanguage
    };
  }

  async translateWithPublicFallback({ text, sourceLanguage, targetLanguage }) {
    const detectedLanguage = sourceLanguage === 'auto' ? 'en' : sourceLanguage;

    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `${detectedLanguage}|${targetLanguage}`
        },
        timeout: 12000
      });

      const translatedText = response.data?.responseData?.translatedText;
      if (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) {
        return { translatedText, detectedLanguage };
      }
    } catch (error) {
      console.warn('Public translation fallback failed:', error.message);
    }

    return {
      translatedText: `Demo translation unavailable. Add Microsoft Translator keys for production translation.\n\n${text}`,
      detectedLanguage
    };
  }
}

export const translationProvider = new MicrosoftTranslatorProvider();
