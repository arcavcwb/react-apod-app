import React, { useState } from 'react';
import { ApodItem } from '../../contracts/apod.contract';
import { useI18n } from '../../i18n/I18n';
import { officialApodUrl } from '../../utils/date';
import { THUMB_WIDTH, optimizedImageUrl, optimizedSrcSet } from '../../utils/imageOptimizer';
import { rememberRatio } from '../../utils/imageRatio';

const VIDEO_FILE = /\.(mp4|webm|mov)(\?|$)/i;
/** NASA hosts some video days as plain files, which have no still to show in a grid. */
export const isVideoFile = (url: string) => VIDEO_FILE.test(url);
const EMBED_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

interface PhotoProps {
  item: ApodItem;
  /** `sizes` for the responsive image. */
  sizes: string;
  /** object-position classes: where the picture sits inside its box. */
  position: string;
}

/** The day's media, whole: never cropped, whatever its shape. Fills the box its parent sizes. */
export const Photo: React.FC<PhotoProps> = ({ item, sizes, position }) => {
  const { t } = useI18n();
  const { url } = item;

  if (item.media_type === 'image' && url) {
    return <DevelopingImage key={url} src={url} alt={item.title} sizes={sizes} position={position} />;
  }
  if (item.media_type === 'video' && url && isVideoFile(url)) {
    return <video src={url} controls playsInline preload="metadata" className={`h-full w-full object-contain ${position}`} />;
  }
  if (item.media_type === 'video' && url && EMBED_HOSTS.test(url)) {
    return (
      <iframe
        src={url}
        title={item.title}
        className="h-full w-full border-0 bg-panel"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allow="encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-start justify-end gap-6 bg-panel p-6 sm:p-10">
      <p className="max-w-sm text-muted">{t('day.otherBody')}</p>
      <a href={url ?? officialApodUrl(item.date)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
        {t('day.official')}
      </a>
    </div>
  );
};

/**
 * The small archive thumbnail (usually already cached) sits blurred in place while the
 * full image downloads, then the sharp image develops over it.
 */
const DevelopingImage: React.FC<{ src: string; alt: string; sizes: string; position: string }> = ({ src, alt, sizes, position }) => {
  const { t } = useI18n();
  const [status, setStatus] = useState<'loading' | 'developing' | 'done' | 'error'>('loading');
  const [raw, setRaw] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
    // If the resizing CDN fails, try NASA's original once before giving up.
    if (!raw) setRaw(true);
    else setStatus('error');
  };

  if (status === 'error') {
    return (
      <div className="flex h-full flex-col items-start justify-end gap-6 bg-panel p-6 sm:p-10">
        <p className="text-muted">{t('image.error')}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setRaw(false);
              setStatus('loading');
              setAttempt((n) => n + 1);
            }}
          >
            {t('image.retry')}
          </button>
          <a href={src} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {t('day.hd')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {status !== 'done' && (
        <img
          src={optimizedImageUrl(src, THUMB_WIDTH)}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-contain opacity-60 blur-xl ${position}`}
        />
      )}
      {status === 'loading' && (
        <span role="status" className="sr-only">
          {t('image.loading')}
        </span>
      )}
      <img
        key={attempt}
        src={raw ? src : optimizedImageUrl(src, 1600)}
        srcSet={raw ? undefined : optimizedSrcSet(src, [960, 1600, 2400])}
        sizes={sizes}
        alt={alt}
        lang="en"
        loading="eager"
        decoding="async"
        // React 18 has no fetchPriority prop; the lowercase attribute passes through.
        {...({ fetchpriority: 'high' } as Record<string, string>)}
        onLoad={(e) => {
          rememberRatio(src, e.currentTarget);
          setStatus('developing');
        }}
        onAnimationEnd={() => setStatus('done')}
        onError={handleError}
        className={`relative h-full w-full object-contain ${position} ${status === 'loading' ? 'opacity-0' : ''} ${
          status === 'developing' ? 'animate-[develop_800ms_cubic-bezier(0.16,1,0.3,1)_both]' : ''
        }`}
      />
    </>
  );
};
