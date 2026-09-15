import { useEffect, useMemo, useState } from 'react';
import { ApodItem } from '../contracts/apod.contract';
import { TranslationLang, TranslationLangSchema } from '../contracts/translation.contract';
import { useI18n } from '../i18n/I18n';
import { fetchTranslation, peekTranslation } from '../services/translation.service';

/** How long the text waits for a first translation before showing NASA's original until it arrives. */
const WAIT_MS = 2000;

/**
 * - original: NASA's English, for English readers or when no translation can be had.
 * - translated: a translation is at hand; the reader may still be looking at the original.
 * - waiting: a first translation is on its way and the text holds its place.
 * - translating: it is taking a while, so NASA's original shows until it arrives.
 */
export type ExplanationStatus = 'original' | 'translated' | 'waiting' | 'translating';

export interface Explanation {
  text: string;
  /** The language `text` is in, for its lang attribute. */
  lang: string;
  status: ExplanationStatus;
  canToggle: boolean;
  showingOriginal: boolean;
  toggle: () => void;
}

/** NASA's explanation in the reader's language: machine-translated for Spanish and Portuguese, the original otherwise. */
export function useExplanation(item: ApodItem | null): Explanation {
  const { locale } = useI18n();
  const target = TranslationLangSchema.safeParse(locale);
  const lang: TranslationLang | null = target.success ? target.data : null;
  const date = item?.date ?? '';
  const original = item?.explanation ?? '';
  const key = lang && date && original ? `${lang}:${date}` : null;

  const cached = useMemo(() => (lang && key ? peekTranslation(date, lang) : null), [key]);
  const [loaded, setLoaded] = useState<{ key: string; text: string | null } | null>(null);
  const [late, setLate] = useState<string | null>(null);
  const [originalFor, setOriginalFor] = useState<string | null>(null);

  useEffect(() => {
    if (!lang || !key || cached) return;
    let live = true;
    fetchTranslation(date, lang).then((result) => live && setLoaded({ key, text: result.data?.text ?? null }));
    const timer = window.setTimeout(() => live && setLate(key), WAIT_MS);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [key]);

  const english = { text: original, lang: 'en', canToggle: false, showingOriginal: false, toggle: () => {} };
  if (!key) return { ...english, status: 'original' };
  const translation = cached ? cached.text : loaded?.key === key ? loaded.text : undefined;
  if (translation === undefined) return { ...english, status: late === key ? 'translating' : 'waiting' };
  if (translation === null) return { ...english, status: 'original' };

  const showingOriginal = originalFor === key;
  return {
    text: showingOriginal ? original : translation,
    lang: showingOriginal ? 'en' : locale,
    status: 'translated',
    canToggle: true,
    showingOriginal,
    toggle: () => setOriginalFor((current) => (current === key ? null : key)),
  };
}
