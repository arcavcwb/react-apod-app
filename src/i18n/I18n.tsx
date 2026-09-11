import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LOCALES, Locale, MESSAGES, MessageKey } from './messages';

const STORAGE_KEY = 'apod:locale';

export function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if ((LOCALES as readonly string[]).includes(saved ?? '')) return saved as Locale;
  } catch {
    // ignore
  }
  const preferred = typeof navigator === 'undefined' ? [] : navigator.languages ?? [navigator.language];
  for (const tag of preferred) {
    const lang = tag.toLowerCase();
    if (lang.startsWith('pt')) return 'pt-BR';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('es')) return 'es';
  }
  return 'es';
}

type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale,
}) => {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback<Translate>(
    (key, vars) => MESSAGES[locale][key].replace(/\{(\w+)\}/g, (_, name) => String(vars?.[name] ?? `{${name}}`)),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
