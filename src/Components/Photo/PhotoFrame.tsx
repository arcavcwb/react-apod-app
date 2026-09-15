import React, { useEffect, useState } from 'react';
import { ApodItem } from '../../contracts/apod.contract';
import { useI18n } from '../../i18n/I18n';
import { thumbnailOf } from '../../services/nasa.service';
import { THUMB_WIDTH, optimizedImageUrl } from '../../utils/imageOptimizer';
import { knownRatio, rememberRatio } from '../../utils/imageRatio';
import { Photo } from './Photo';

interface PhotoFrameProps {
  /** null while the day is on its way. */
  item: ApodItem | null;
  sizes: string;
  /** The glow of the picture's own colours behind the card. */
  bloom?: boolean;
  /** Classes for the card, the element that carries the transition name. */
  className?: string;
  /** The view transition name; 'none' hands it to a tile that is about to grow into this photograph. */
  transitionName?: string;
  /** Placed beside the card, outside the picture (the day arrows); the space keeps gutters for it. */
  sides?: React.ReactNode;
}

/**
 * A day's picture shape (width / height): known at once when any copy of it has loaded before (a tile,
 * a thumbnail), otherwise as soon as the small preview arrives. Videos play 16:9.
 */
export function usePhotoRatio(item: ApodItem | null): number | null {
  const thumb = item ? thumbnailOf(item) : undefined;
  const [, setProbed] = useState(0);

  useEffect(() => {
    if (!thumb || knownRatio(thumb)) return;
    let live = true;
    const probe = new Image();
    probe.onload = () => {
      rememberRatio(thumb, probe);
      if (live) setProbed((n) => n + 1);
    };
    // The same URL as the photograph's blurred preview, so it is one download for both.
    probe.src = optimizedImageUrl(thumb, THUMB_WIDTH);
    return () => {
      live = false;
    };
  }, [thumb]);

  if (!item) return null;
  if (item.media_type === 'video') return 16 / 9;
  return thumb ? knownRatio(thumb) : null;
}

/**
 * The photograph itself is the floating card: the card takes the picture's own shape, as large as the
 * space allows and centred in it, with rounded corners, a soft shadow and a glow of its own colours
 * behind. Until the shape is known (a first visit, a page with no still) the card fills the space and
 * the picture sits whole inside it. Fills its parent's box, which must have a size.
 */
export const PhotoFrame: React.FC<PhotoFrameProps> = ({ item, sizes, bloom = true, className = '', transitionName = 'photo', sides }) => {
  const { t } = useI18n();
  const ratio = usePhotoRatio(item);
  const thumb = item ? thumbnailOf(item) : null;
  const glow = thumb ? optimizedImageUrl(thumb, 48) : null;
  const [lit, setLit] = useState(false);

  return (
    // A size container, so the card can fit its shape with container units; with sides, gutters hold them.
    <div className={`grid h-full w-full place-items-center [container-type:size] ${sides ? 'px-[3.75rem]' : ''}`}>
      <div
        className={`float-in relative isolate transition-[width] duration-500 ease-out-expo ${className}`}
        style={{
          viewTransitionName: transitionName,
          width: ratio ? `min(100cqw, calc(100cqh * ${ratio}))` : '100cqw',
          height: ratio ? undefined : '100cqh',
          aspectRatio: ratio ? String(ratio) : undefined,
        }}
      >
        {glow && bloom && (
          <img
            src={glow}
            alt=""
            aria-hidden="true"
            onLoad={() => setLit(true)}
            className={`pointer-events-none absolute inset-[6%] -z-10 h-[88%] w-[88%] object-cover blur-3xl saturate-150 transition-opacity duration-[1600ms] ease-out ${
              lit ? 'opacity-60' : 'opacity-0'
            }`}
          />
        )}
        <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-panel shadow-photo after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-white/[0.08] lg:rounded-[1.75rem]">
          {item === null ? <div className="skeleton absolute inset-0" /> : <Photo item={item} sizes={sizes} position="object-center" />}
          {item?.copyright && (
            <p className="absolute bottom-2.5 left-2.5 z-10 max-w-[calc(100%-1.25rem)] truncate rounded-full bg-[rgb(3_7_18/0.72)] px-3 py-1 text-small text-fg lg:bottom-4 lg:left-4">
              {t('day.credit')}: <span lang="en">{item.copyright}</span>
            </p>
          )}
        </div>
        {sides}
      </div>
    </div>
  );
};
