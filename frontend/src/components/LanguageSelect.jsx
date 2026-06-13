import { languages } from '../data/languages.js';

export default function LanguageSelect({ value, onChange, allowAuto = false, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <select className="input" value={value} onChange={(event) => onChange(event.target.value)}>
        {languages
          .filter((language) => allowAuto || language.code !== 'auto')
          .map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
      </select>
    </label>
  );
}
