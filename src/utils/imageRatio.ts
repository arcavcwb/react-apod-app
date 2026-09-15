// Every copy of a picture (thumbnail, preview, full size) keeps the original's shape, so the first
// copy that loads anywhere tells the shape of all of them. Kept for the session, keyed by NASA's URL.
const ratios = new Map<string, number>();

export function rememberRatio(url: string, img: HTMLImageElement) {
  if (img.naturalWidth > 0 && img.naturalHeight > 0) ratios.set(url, img.naturalWidth / img.naturalHeight);
}

export const knownRatio = (url: string): number | null => ratios.get(url) ?? null;
