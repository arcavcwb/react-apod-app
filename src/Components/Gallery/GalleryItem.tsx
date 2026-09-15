import React, { useEffect, useRef, useState } from 'react';
import { Link, useViewTransitionState } from 'react-router-dom';
import { BiPlay } from 'react-icons/bi';
import { ApodItem } from '../../contracts/apod.contract';
import { useI18n } from '../../i18n/I18n';
import { thumbnailOf } from '../../services/nasa.service';
import { formatApodDate } from '../../utils/date';
import { THUMB_WIDTH, optimizedImageUrl, optimizedSrcSet } from '../../utils/imageOptimizer';
import { rememberRatio } from '../../utils/imageRatio';
import { isVideoFile } from '../Photo/Photo';

// Tiles crop to fill their rounded box; every picture is whole on its own day.
const FIT = 'h-full w-full object-cover';

/**
 * One day in a grid: a rounded tile, the NASA title and the date, always visible. `fill` stretches the
 * tile to its cell (desktop pages sized to the screen); otherwise it is square (phones scroll down).
 */
export const GalleryItem: React.FC<{ item: ApodItem; sizes: string; fill?: boolean }> = ({ item, sizes, fill = false }) => {
  const { t, locale } = useI18n();
  const to = `/apod/${item.date}`;
  // The tile grows into the day's photograph on the way in.
  const transitioning = useViewTransitionState(to);
  const thumb = thumbnailOf(item);
  const video = item.media_type === 'video';

  return (
    <Link to={to} viewTransition className={`group flex flex-col rounded-2xl focus-visible:outline-offset-4 ${fill ? 'h-full min-h-0' : ''}`}>
      <span className={`tile relative block ${fill ? 'min-h-0 flex-1' : 'aspect-square'}`} style={transitioning ? { viewTransitionName: 'photo' } : undefined}>
        {thumb ? (
          <Thumb key={thumb} src={thumb} sizes={sizes} />
        ) : video && item.url && isVideoFile(item.url) ? (
          <VideoStill src={item.url} />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-small text-faint">
            {video ? <BiPlay aria-hidden="true" className="h-8 w-8" /> : t('day.other')}
          </span>
        )}
        {video && (
          <span className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(3_7_18/0.75)] text-fg">
            <BiPlay aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only">{t('day.video')}</span>
          </span>
        )}
      </span>
      <span
        lang="en"
        className={`mt-2 font-medium leading-snug text-fg decoration-accent underline-offset-4 group-hover:underline group-focus-visible:underline ${
          fill ? 'line-clamp-1 lg:line-clamp-2' : 'line-clamp-2'
        }`}
      >
        {item.title}
      </span>
      <time dateTime={item.date} className="block text-small text-muted">
        {formatApodDate(item.date, locale, { day: 'numeric', month: 'long', year: 'numeric' })}
      </time>
    </Link>
  );
};

/** Fades in once decoded; falls back to NASA's own file if the resizing CDN fails. */
export const Thumb: React.FC<{ src: string; sizes: string; fit?: string }> = ({ src, sizes, fit = FIT }) => {
  const { t } = useI18n();
  const [stage, setStage] = useState<'cdn' | 'raw' | 'failed'>('cdn');
  const [loaded, setLoaded] = useState(false);

  if (stage === 'failed') {
    return (
      <span className="absolute inset-0 flex items-center justify-center bg-panel p-3 text-center text-small text-faint">
        {t('gallery.noPreview')}
      </span>
    );
  }
  return (
    <img
      src={stage === 'cdn' ? optimizedImageUrl(src, THUMB_WIDTH) : src}
      srcSet={stage === 'cdn' ? optimizedSrcSet(src, [320, THUMB_WIDTH, 720]) : undefined}
      sizes={sizes}
      alt=""
      loading="lazy"
      decoding="async"
      onLoad={(e) => {
        rememberRatio(src, e.currentTarget);
        setLoaded(true);
      }}
      onError={() => setStage(stage === 'cdn' ? 'raw' : 'failed')}
      className={`${fit} transition-[opacity,transform,filter] duration-700 ease-out-expo group-hover:scale-[1.04] group-focus-visible:scale-[1.04] ${
        loaded ? 'opacity-100 can-hover:brightness-[0.85] group-hover:brightness-100 group-focus-visible:brightness-100' : 'opacity-0'
      }`}
    />
  );
};

/**
 * NASA-hosted video files have no still: once the tile nears the viewport, a detached video
 * loads just enough to paint its first frame on a canvas, then stops downloading.
 */
export const VideoStill: React.FC<{ src: string; fit?: string }> = ({ src, fit = FIT }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let video: HTMLVideoElement | null = null;
    const release = () => {
      video?.removeAttribute('src');
      video?.load();
      video = null;
    };
    const start = () => {
      video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.addEventListener(
        'loadeddata',
        () => {
          if (!video) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0);
          setReady(true);
          release();
        },
        { once: true }
      );
      // Launch and time-lapse videos often open on black; a second in is a truer still.
      video.src = `${src}#t=1`;
    };
    if (!('IntersectionObserver' in window)) {
      start();
      return release;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(canvas);
    return () => {
      io.disconnect();
      release();
    };
  }, [src]);

  return (
    <>
      {!ready && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-panel text-faint">
          <BiPlay className="h-8 w-8" />
        </span>
      )}
      {/* A canvas, not a <video>: a late frame never becomes the page's largest paint. */}
      <canvas
        ref={ref}
        aria-hidden="true"
        className={`${fit} transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-[1.04] ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
};

/** Same footprint as a GalleryItem while its day is on the way. */
export const GalleryItemSkeleton: React.FC<{ fill?: boolean }> = ({ fill = false }) => (
  <div aria-hidden="true" className={`flex flex-col ${fill ? 'h-full min-h-0' : ''}`}>
    <div className={`skeleton rounded-2xl ${fill ? 'min-h-0 flex-1' : 'aspect-square'}`} />
    <div className="skeleton mt-2 h-4 w-4/5 rounded-full" />
    <div className="skeleton mt-1.5 h-3 w-2/5 rounded-full" />
  </div>
);
