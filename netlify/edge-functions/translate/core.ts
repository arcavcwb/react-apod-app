// Translation of a day's APOD explanation, shared by the Edge Function (production) and the Vite dev server
// (local). Titles and credits are never translated. The caller names a date and a language, never text:
// the explanation comes from NASA itself, so the DeepL key cannot be used to translate anything else.
// Relative imports carry their extension, as Deno requires.
import { ApodItemSchema } from '../../../src/contracts/apod.contract.ts';
import {
  DeepLResponseSchema,
  TranslationLangSchema,
  type Translation,
  type TranslationLang,
} from '../../../src/contracts/translation.contract.ts';
import { apodToday, isValidApodDate } from '../../../src/utils/date.ts';

export type TranslateError = 'bad-request' | 'not-configured' | 'not-found' | 'quota' | 'upstream';
export type TranslateResult = { ok: true; translation: Translation } | { ok: false; error: TranslateError };

export interface TranslateDeps {
  deeplKey?: string;
  nasaKey?: string;
  /** For tests; defaults to today in US Eastern time. */
  today?: string;
  fetch?: (input: string, init?: RequestInit) => Promise<Response>;
}

const DEEPL_TARGET: Record<TranslationLang, string> = { es: 'ES', 'pt-BR': 'PT-BR' };
const TIMEOUT_MS = 8000;

const STATUS: Record<TranslateError, number> = {
  'bad-request': 400,
  'not-configured': 503,
  'not-found': 404,
  quota: 503,
  upstream: 502,
};

/** The HTTP status for each failure. The app shows NASA's original text for all of them. */
export const statusFor = (error: TranslateError) => STATUS[error];

export async function translateExplanation(
  date: string | null,
  lang: string | null,
  deps: TranslateDeps = {}
): Promise<TranslateResult> {
  const target = TranslationLangSchema.safeParse(lang);
  const day = date ?? undefined;
  if (!target.success || !isValidApodDate(day, deps.today ?? apodToday())) return { ok: false, error: 'bad-request' };

  // Checked before asking NASA, so an unconfigured site spends no requests.
  const deeplKey = deps.deeplKey?.trim();
  if (!deeplKey) return { ok: false, error: 'not-configured' };
  const request = deps.fetch ?? fetch;

  let explanation: string;
  try {
    const nasaKey = encodeURIComponent(deps.nasaKey?.trim() || 'DEMO_KEY');
    const response = await request(`https://api.nasa.gov/planetary/apod?date=${day}&api_key=${nasaKey}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // NASA answers 400 for dates outside the archive and 404 for days without a picture.
    if (response.status === 400 || response.status === 404) return { ok: false, error: 'not-found' };
    if (!response.ok) return { ok: false, error: 'upstream' };
    const parsed = ApodItemSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.date !== day) return { ok: false, error: 'upstream' };
    explanation = parsed.data.explanation;
  } catch {
    return { ok: false, error: 'upstream' };
  }
  if (!explanation) return { ok: false, error: 'not-found' };

  try {
    // Free-plan keys end in ":fx" and use their own host.
    const host = deeplKey.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
    const response = await request(`${host}/v2/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${deeplKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [explanation], source_lang: 'EN', target_lang: DEEPL_TARGET[target.data] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 456) return { ok: false, error: 'quota' };
    if (response.status === 401 || response.status === 403) return { ok: false, error: 'not-configured' };
    if (!response.ok) return { ok: false, error: 'upstream' };
    const parsed = DeepLResponseSchema.safeParse(await response.json());
    if (!parsed.success) return { ok: false, error: 'upstream' };
    return { ok: true, translation: { date: day, lang: target.data, text: parsed.data.translations[0].text } };
  } catch {
    return { ok: false, error: 'upstream' };
  }
}
