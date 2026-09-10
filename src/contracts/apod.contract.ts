import { z } from 'zod';

const sanitizeHttps = (val?: string | null) => {
  if (!val) return val;
  return val.replace(/^http:\/\//i, 'https://');
};

const safeHttpsUrlSchema = z
  .string()
  .transform((v) => sanitizeHttps(v) as string)
  .pipe(z.string().url('URL de medio inválida'))
  .refine((url) => url.startsWith('https://'), {
    message: 'El protocolo de medio debe ser estrictamente HTTPS',
  });

const optionalSafeHttpsUrlSchema = z
  .string()
  .optional()
  .nullable()
  .transform(sanitizeHttps)
  .pipe(z.string().url().optional().nullable())
  .refine((url) => !url || url.startsWith('https://'), {
    message: 'El protocolo de medio debe ser estrictamente HTTPS',
  });

export const ApodItemSchema = z.object({
  title: z.string().default('Sin título'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  explanation: z.string().default('Sin descripción astronómica disponible.'),
  media_type: z.enum(['image', 'video']).or(z.string()).default('image'),
  url: safeHttpsUrlSchema,
  hdurl: optionalSafeHttpsUrlSchema,
  thumbnail_url: optionalSafeHttpsUrlSchema,
  copyright: z.string().optional().nullable(),
  service_version: z.string().optional(),
});

export type ApodItem = z.infer<typeof ApodItemSchema>;

export const ApodGallerySchema = z.array(ApodItemSchema);
export type ApodGallery = z.infer<typeof ApodGallerySchema>;
