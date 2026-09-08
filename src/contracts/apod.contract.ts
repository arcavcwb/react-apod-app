import { z } from 'zod';

export const ApodItemSchema = z.object({
  title: z.string().default('Sin título'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  explanation: z.string().default('Sin descripción astronómica disponible.'),
  media_type: z.enum(['image', 'video']).or(z.string()).default('image'),
  url: z.string().url('URL de medio inválida'),
  hdurl: z.string().url().optional().nullable(),
  copyright: z.string().optional().nullable(),
  service_version: z.string().optional(),
});

export type ApodItem = z.infer<typeof ApodItemSchema>;

export const ApodGallerySchema = z.array(ApodItemSchema);
export type ApodGallery = z.infer<typeof ApodGallerySchema>;
