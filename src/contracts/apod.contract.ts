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

export const ApodItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  title: z.string().trim().catch('Untitled'),
  explanation: z.string().trim().catch(''),
  // "other" covers interactive days that have no url at all.
  media_type: z.enum(['image', 'video', 'other']).catch('other'),
  url: httpsUrl.optional().catch(undefined),
  hdurl: httpsUrl.optional().catch(undefined),
  thumbnail_url: httpsUrl.optional().catch(undefined),
  copyright: credit.optional().catch(undefined),
});

export type ApodItem = z.infer<typeof ApodItemSchema>;

export const ApodListSchema = z.array(ApodItemSchema);
