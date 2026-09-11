import React, { useState } from 'react';
import { ApodItem } from '../../contracts/apod.contract';
import { useI18n } from '../../i18n/I18n';
import { officialApodUrl } from '../../utils/date';
import { THUMB_WIDTH, optimizedImageUrl, optimizedSrcSet } from '../../utils/imageOptimizer';

/** The plate frame: outer neat-line, graduated band, inner field. Its size never depends on the media. */
export const Plate: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`plate ${className}`}>
    <div className="plate-field">{children}</div>
  </div>
);

/** Same footprint as a plate, drawn dashed: used for errors and missing days. */
export const EmptyPlate: React.FC<{
  className?: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}> = ({ className = '', title, body, children }) => (
  <div role="alert" className={`plate-empty flex flex-col items-center justify-center px-6 py-12 text-center ${className}`}>
    <h2 className="max-w-md font-serif text-3xl leading-tight text-star">{title}</h2>
    <p className="mt-3 max-w-md text-base text-muted">{body}</p>
    {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
  </div>
);

const VIDEO_FILE = /\.(mp4|webm|mov)(\?|$)/i;
const EMBED_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

export const PlateMedia: React.FC<{ item: ApodItem }> = ({ item }) => {
  const { t } = useI18n();
  const { url } = item;

  if (item.media_type === 'image' && url) return <PlateImage key={url} src={url} alt={item.title} />;

  if (item.media_type === 'video' && url && VIDEO_FILE.test(url)) {
    return <video src={url} controls playsInline preload="metadata" className="h-full w-full object-contain" />;
  }
  if (item.media_type === 'video' && url && EMBED_HOSTS.test(url)) {
    return (
      <iframe
        src={url}
        title={item.title}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        allow="encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="max-w-sm text-base text-muted">{t('day.otherBody')}</p>
      <a href={url ?? officialApodUrl(item.date)} target="_blank" rel="noopener noreferrer" className="control">
        {t('day.official')}
      </a>
    </div>
  );
};

/**
 * Focus pull: the small archive thumbnail (usually already cached) sits blurred under the
 * plate while the full image downloads, then the sharp image resolves over it.
 */
const PlateImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const { t } = useI18n();
  // resolving: the sharp image animates in over the blurred one, which stays until it finishes.
  const [status, setStatus] = useState<'loading' | 'resolving' | 'done' | 'error'>('loading');
  const [raw, setRaw] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
    // If the resizing CDN fails, try NASA's original once before giving up.
    if (!raw) setRaw(true);
    else setStatus('error');
  };

  if (status === 'error') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-base text-muted">{t('image.error')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="control"
            onClick={() => {
              setRaw(false);
              setStatus('loading');
              setAttempt((n) => n + 1);
            }}
          >
            {t('image.retry')}
          </button>
          <a href={src} target="_blank" rel="noopener noreferrer" className="control">
            {t('day.hd')}
          </a>
        </div>
      </div>
    );
  }

  return (
    // The sharp image is sized to its own box (not letterboxed by object-fit), so its 1px
    // neat-line traces the picture's real edge instead of leaving a seam against the field.
    <div className="flex h-full w-full items-center justify-center">
      {status !== 'done' && (
        <img
          src={optimizedImageUrl(src, THUMB_WIDTH)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-contain opacity-70 blur-lg"
          style={{ viewTransitionName: 'plate' }}
        />
      )}
      {status === 'loading' && (
        <p className="notation absolute bottom-3 left-3 text-faint" role="status">
          {t('image.loading')}
        </p>
      )}
      <img
        key={attempt}
        src={raw ? src : optimizedImageUrl(src, 1600)}
        srcSet={raw ? undefined : optimizedSrcSet(src, [960, 1600, 2400])}
        sizes="(min-width: 1024px) 64vw, 100vw"
        alt={alt}
        lang="en"
        loading="eager"
        decoding="async"
        // React 18 has no fetchPriority prop; the lowercase attribute passes through.
        {...({ fetchpriority: 'high' } as Record<string, string>)}
        onLoad={() => setStatus('resolving')}
        onAnimationEnd={() => setStatus('done')}
        onError={handleError}
        className={`relative max-h-full max-w-full object-contain ${
          status === 'loading' ? 'opacity-0' : 'outline outline-1 outline-line'
        } ${status === 'resolving' ? 'animate-[focus-pull_700ms_cubic-bezier(0.16,1,0.3,1)_both]' : ''}`}
        style={status === 'done' ? { viewTransitionName: 'plate' } : undefined}
      />
    </div>
  );
};
