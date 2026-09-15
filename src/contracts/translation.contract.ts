import { z } from 'zod';

/** The languages NASA's explanations are translated into. Titles and credits stay in English. */
export const TranslationLangSchema = z.enum(['es', 'pt-BR']);
export type TranslationLang = z.infer<typeof TranslationLangSchema>;

/** DeepL's answer to POST /v2/translate: one translation per text sent. */
export const DeepLResponseSchema = z.object({
  translations: z.array(z.object({ text: z.string().trim().min(1) })).min(1),
});

/** What /api/translate answers: one day's explanation in one language. */
export const TranslationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  lang: TranslationLangSchema,
  text: z.string().trim().min(1),
});

export type Translation = z.infer<typeof TranslationSchema>;
