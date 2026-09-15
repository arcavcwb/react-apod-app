import { Translation, TranslationLang, TranslationSchema } from '../contracts/translation.contract';
import { apodToday } from '../utils/date';
import { readCache, writeCache } from './nasa.service';

const TIMEOUT_MS = 15_000;
const HOUR_MS = 3_600_000;

export type TranslationError = 'unavailable' | 'network' | 'contract';
export type TranslationResult = { data: Translation; error: null } | { data: null; error: TranslationError };

const cacheKey = (date: string, lang: TranslationLang) => `translation:${lang}:${date}`;

/** Synchronous, so a translation read before renders without a waiting frame. */
export const peekTranslation = (date: string, lang: TranslationLang) => readCache<Translation>(cacheKey(date, lang));

// Requests on their way, so the text column, the reading card and a re-run effect share one translation.
const inFlight = new Map<string, Promise<TranslationResult>>();

/**
 * A day's explanation in Spanish or Portuguese, from /api/translate. Past days are kept forever and today's
 * for an hour (NASA sometimes corrects the day's text). Any failure leaves the reader with NASA's original.
 */
export function fetchTranslation(date: string, lang: TranslationLang): Promise<TranslationResult> {
  const cached = peekTranslation(date, lang);
  if (cached) return Promise.resolve({ data: cached, error: null });

  const key = cacheKey(date, lang);
  const pending = inFlight.get(key);
  if (pending) return pending;
  const request = requestTranslation(date, lang).finally(() => inFlight.delete(key));
  inFlight.set(key, request);
  return request;
}

async function requestTranslation(date: string, lang: TranslationLang): Promise<TranslationResult> {
  let response: Response;
  try {
    const query = new URLSearchParams({ date, lang });
    response = await fetch(`/api/translate?${query}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch {
    return { data: null, error: 'network' };
  }
  // Not configured, over quota, NASA or DeepL down: all the same to the reader.
  if (!response.ok) return { data: null, error: 'unavailable' };

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return { data: null, error: 'contract' };
  }
  const parsed = TranslationSchema.safeParse(raw);
  if (!parsed.success || parsed.data.date !== date || parsed.data.lang !== lang) return { data: null, error: 'contract' };

  writeCache(cacheKey(date, lang), parsed.data, date === apodToday() ? HOUR_MS : null);
  return { data: parsed.data, error: null };
}
