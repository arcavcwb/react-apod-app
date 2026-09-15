import React from 'react';
import { Link, useViewTransitionState } from 'react-router-dom';
import { BiPlay, BiRightArrowAlt } from 'react-icons/bi';
import { ApodItem } from '../../contracts/apod.contract';
import { useRecentApods } from '../../Hooks/useApod';
import { useI18n } from '../../i18n/I18n';
import { thumbnailOf } from '../../services/nasa.service';
import { formatApodDate } from '../../utils/date';
import { markMorph } from '../../utils/travel';
import { isVideoFile } from '../Photo/Photo';
import { Thumb, VideoStill } from './GalleryItem';

const SIZES = '(min-width: 1024px) 9vw, 20vw';
// Small tiles crop to fill; every picture is whole on its own day.
const COVER = 'h-full w-full object-cover';
// Phones show five tiles in a row; desktop four, with their dates.
const TILES = 5;

/** The home's step from TODAY to EXPLORE: a dock of the days just before, and the way into the gallery. */
export const RecentDays: React.FC<{ exclude?: string }> = ({ exclude }) => {
  const { t } = useI18n();
  const { result } = useRecentApods();
  const items = (result?.data ?? []).filter((d) => d.date !== exclude).slice(0, TILES);
  const cell = (i: number) => (i === TILES - 1 ? 'lg:hidden' : '');
  const galleryLink = (
    <Link to="/gallery" className="group -mr-2.5 inline-flex min-h-12 items-center gap-1 rounded-full px-2.5 text-small text-muted transition-colors hover:bg-white/[0.06] hover:text-fg">
      {t('recent.all')}
      <BiRightArrowAlt aria-hidden="true" className="h-5 w-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
    </Link>
  );

  // Nothing to show (NASA failed, or answered with no other day): keep only the way into the gallery.
  if (result?.error || (result && items.length === 0)) {
    return <div className="flex justify-end">{galleryLink}</div>;
  }

  return (
    <section aria-labelledby="recent-title">
      <div className="-my-2 flex items-center justify-between gap-4 px-1 lg:px-0">
        <h2 id="recent-title" className="text-small font-semibold text-fg">
          {t('recent.title')}
        </h2>
        {galleryLink}
      </div>
      <ol
        aria-busy={result === null}
        className="stage-dock mt-3 grid grid-cols-5 gap-2.5 sm:grid-cols-[repeat(5,minmax(0,6.5rem))] lg:mt-4 lg:grid-cols-4 lg:gap-4"
      >
        {result === null
          ? Array.from({ length: TILES }, (_, i) => (
              <li key={i} className={cell(i)} aria-hidden="true">
                <div className="skeleton aspect-square rounded-xl lg:rounded-2xl" />
                <div className="skeleton mt-2 hidden h-3 w-3/5 rounded-full lg:block" />
              </li>
            ))
          : items.map((item, i) => (
              <li key={item.date} className={cell(i)}>
                <DockTile item={item} />
              </li>
            ))}
      </ol>
    </section>
  );
};

/** A rounded tile that lifts on hover; its name is the NASA title and the date. */
const DockTile: React.FC<{ item: ApodItem }> = ({ item }) => {
  const { t, locale } = useI18n();
  const to = `/apod/${item.date}`;
  // The tile grows into the day's photograph on the way in.
  const transitioning = useViewTransitionState(to);
  const thumb = thumbnailOf(item);
  const video = item.media_type === 'video';

  return (
    <Link to={to} viewTransition onClick={markMorph} title={item.title} className="group block rounded-xl focus-visible:outline-offset-4 lg:rounded-2xl">
      <span
        className="tile relative block aspect-square rounded-xl lg:rounded-2xl"
        style={transitioning ? { viewTransitionName: 'photo' } : undefined}
      >
        {thumb ? (
          <Thumb key={thumb} src={thumb} sizes={SIZES} fit={COVER} />
        ) : video && item.url && isVideoFile(item.url) ? (
          <VideoStill src={item.url} fit={COVER} />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-faint">
            {video && <BiPlay className="h-6 w-6" />}
          </span>
        )}
        {video && (
          <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(3_7_18/0.75)] text-fg">
            <BiPlay aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">{t('day.video')}</span>
          </span>
        )}
      </span>
      <span lang="en" className="sr-only">
        {item.title},{' '}
      </span>
      <time dateTime={item.date} className="sr-only text-small text-muted transition-colors group-hover:text-fg lg:not-sr-only lg:mt-2 lg:block">
        {formatApodDate(item.date, locale, { day: 'numeric', month: 'short' })}
      </time>
    </Link>
  );
};
