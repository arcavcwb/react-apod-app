import { z } from 'zod';

// NASA still serves some media over http; the CSP only allows https.
const toHttps = (v: string) => v.trim().replace(/^http:\/\//i, 'https://');

const httpsUrl = z
  .string()
  .transform(toHttps)
  .pipe(z.url({ protocol: /^https$/, error: 'Media URL must be https' }));

// Credits arrive with stray line breaks ("\nAldo Zanetti\n").
const credit = z
  .string()
  .transform((v) => v.replace(/\s+/g, ' ').trim())
  .transform((v) => v || undefined);

// With APOD moving to science.nasa.gov, the API can answer any date with that site's own page read as a
// day: its logo as the picture, under the title "NASA Science" (seen 2026-10-09). A file of the site's
// theme is never a day's media, so such a record is no day at all.
const isSiteAsset = (url: string | undefined) => !!url && /\/wp-content\/themes\//i.test(url);

export const ApodItemSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    title: z.string().trim().catch('Untitled'),
    explanation: z.string().trim().catch(''),
    // "other" covers interactive days that have no url at all.
    media_type: z.enum(['image', 'video', 'other']).catch('other'),
    url: httpsUrl.optional().catch(undefined),
    hdurl: httpsUrl.optional().catch(undefined),
    thumbnail_url: httpsUrl.optional().catch(undefined),
    copyright: credit.optional().catch(undefined),
  })
  .refine((day) => !isSiteAsset(day.url) && !isSiteAsset(day.hdurl), "Media is a file of NASA's website, not the day's");

export type ApodItem = z.infer<typeof ApodItemSchema>;

export const ApodListSchema = z.array(ApodItemSchema);
