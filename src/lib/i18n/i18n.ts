import { AppLanguage } from '../../types';
import { translations, TranslationKey } from './translations';

const STORAGE_KEY = 'app-language';

function detectBrowserLanguage(): AppLanguage {
  const browserLang = navigator.language?.slice(0, 2).toLowerCase();

  if (browserLang === AppLanguage.DE || browserLang === AppLanguage.RU) {
    return browserLang;
  }

  return AppLanguage.EN;
}

function getStoredLanguage(): AppLanguage | null {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === AppLanguage.EN || stored === AppLanguage.DE || stored === AppLanguage.RU) {
    return stored;
  }

  return null;
}

let currentLanguage: AppLanguage = getStoredLanguage() ?? detectBrowserLanguage();

type LanguageChangeListener = (lang: AppLanguage) => void;
const listeners: LanguageChangeListener[] = [];

export function getLanguage(): AppLanguage {
  return currentLanguage;
}

export function t(key: TranslationKey): string {
  return translations[currentLanguage][key] ?? translations[AppLanguage.EN][key];
}

export function onLanguageChange(listener: LanguageChangeListener): void {
  listeners.push(listener);
}

export function applyStaticTranslations(): void {
  document.title = t('app.pageTitle');
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n as TranslationKey;
    el.textContent = t(key);
  });
}

export function setLanguage(lang: AppLanguage): void {
  if (lang === currentLanguage) return;

  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);

  applyStaticTranslations();
  listeners.forEach((listener) => listener(lang));
}
