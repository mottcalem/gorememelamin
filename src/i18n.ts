export const languages = {
  tr: 'Türkçe',
  en: 'English',
  da: 'Dansk',
  ar: 'العربية',
} as const;

export type Language = keyof typeof languages;

const segment = window.location.pathname.split('/')[1];
export const language: Language =
  segment === 'en' || segment === 'da' || segment === 'ar' ? segment : 'tr';
export const languagePrefix = language === 'tr' ? '' : '/' + language;

const dictionaries = {
  en: () => import('./translations/en.json'),
  da: () => import('./translations/da.json'),
  ar: () => import('./translations/ar.json'),
};
let messages: Record<string, string> = {};

export async function initializeLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  if (language !== 'tr') messages = (await dictionaries[language]()).default;
}

export function localizedPath(path: string, target: Language = language) {
  return target === 'tr' ? path : '/' + target + path;
}

export function t(text: string, values?: Record<string, string | number>): string {
  const translated = Object.hasOwn(messages, text) ? messages[text] : text;
  return values ? translated.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match)) : translated;
}

export function catalogText(text: string): string {
  return text.split('\n').map(line => {
    const key = line.trim();
    return key ? t(key) : line;
  }).join('\n');
}

export function optionText(label: string): string {
  return label.split(/( \/ | · )/).map(part => t(part)).join('');
}
