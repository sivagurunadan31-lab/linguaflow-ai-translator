const speechLocales = {
  ar: 'ar-SA',
  de: 'de-DE',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  hi: 'hi-IN',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-PT',
  ru: 'ru-RU',
  ta: 'ta-IN',
  te: 'te-IN',
  'zh-Hans': 'zh-CN'
};

export const speakText = ({ text, languageCode, onError, onStart }) => {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    onError?.('Speech is not supported in this browser');
    return;
  }

  const lang = speechLocales[languageCode] || languageCode || 'en-US';
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((item) => item.lang === lang)
    || voices.find((item) => item.lang?.startsWith(lang.split('-')[0]))
    || voices.find((item) => item.default)
    || voices[0];

  speechSynthesis.cancel();
  speechSynthesis.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || lang;
  if (voice) utterance.voice = voice;
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;
  utterance.onstart = () => onStart?.('Playing speech');
  utterance.onerror = (event) => onError?.(`Unable to play speech: ${event.error || 'browser blocked audio'}`);
  speechSynthesis.speak(utterance);

  setTimeout(() => {
    if (!speechSynthesis.speaking && !speechSynthesis.pending) {
      onError?.('Browser did not start speech. Try opening the app in Chrome or Edge.');
    }
  }, 250);
};
