import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiChevronLeft, BiChevronRight, BiLinkExternal, BiShuffle } from 'react-icons/bi';
import { ApodItem } from '../../contracts/apod.contract';
import { useApodDay, usePrefetchMonth } from '../../Hooks/useApod';
import { useDocumentTitle } from '../../Hooks/useDocumentTitle';
import { useI18n } from '../../i18n/I18n';
import { ApodErrorKind, peekMonth, thumbnailOf } from '../../services/nasa.service';
import {
  APOD_FIRST_DATE,
  apodToday,
  dayNumber,
  formatApodDate,
  hoursUntilNextApod,
  isValidApodDate,
  monthOf,
  officialApodUrl,
  plateCode,
  randomApodDate,
  shiftDay,
} from '../../utils/date';
import { THUMB_WIDTH, optimizedImageUrl } from '../../utils/imageOptimizer';
import { EmptyPlate, Plate, PlateMedia } from '../Plate/Plate';
import { ShareMenu } from '../Share/ShareMenu';
import { DateRuler } from './DateRuler';

// First viewport: the plate takes what the header and the ruler leave, within sane bounds.
// Phones get a square plate (the best fit for pictures of unknown shape).
const PLATE_SIZE =
  'aspect-square max-h-[70svh] w-full lg:aspect-auto lg:max-h-none lg:h-[clamp(26rem,calc(100svh-var(--header-h)-10.5rem),56rem)]';

/** One day of the atlas. `date` undefined means the latest published picture. */
export const DayView: React.FC<{ date?: string }> = ({ date }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { result, retry } = useApodDay(date);
  const item = result?.data ?? null;
  const shownDate = item?.date ?? date;
  const today = apodToday();
  // The day under the ruler's cursor while dragging, before release.
  const [scrub, setScrub] = useState<string | null>(null);

  usePrefetchMonth(shownDate && monthOf(shownDate));
  useDocumentTitle(item?.title ?? t('title.today'));
  useEffect(() => setScrub(null), [shownDate]);

  // Day-to-day travel keeps the scroll position: the plate stays put while the ruler is in use.
  const go = useCallback((d: string) => navigate(`/apod/${d}`, { preventScrollReset: true }), [navigate]);

  // Left and right arrows walk the atlas, unless focus is in a form control.
  useEffect(() => {
    if (!shownDate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target instanceof Element && e.target.closest('input, select, textarea, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft' && shownDate > APOD_FIRST_DATE) go(shiftDay(shownDate, -1));
      if (e.key === 'ArrowRight' && shownDate < today) go(shiftDay(shownDate, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shownDate, today, go]);

  const scrubItem = scrub && scrub !== shownDate ? peekMonth(monthOf(scrub))?.find((d) => d.date === scrub) : undefined;
  const scrubThumb = scrubItem && thumbnailOf(scrubItem);

  return (
    <article className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-6 lg:px-10">
      {/* DOM order is the phone's reading order: plate, ruler, notation. Desktop places the ruler under the plate and the notation beside it. */}
      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-12 lg:gap-y-4">
        <div className="relative lg:col-span-8 lg:row-start-1 lg:pl-8">
          {shownDate && (
            <p aria-hidden="true" className="vertical-notation notation absolute left-0 top-0 hidden text-faint lg:block">
              {/* The code names the day the plate actually shows. */}
              {plateCode(scrubThumb && scrub ? scrub : shownDate)}
            </p>
          )}
          {result === null && (
            <Plate className={PLATE_SIZE}>
              <p role="status" className="notation absolute inset-0 m-auto h-fit w-fit text-faint">
                {t('day.loading')}
              </p>
            </Plate>
          )}
          {result?.error && <ErrorPlate kind={result.error} date={date} onRetry={retry} onGo={go} />}
          {item && (
            <Plate className={PLATE_SIZE}>
              <div className={`h-full w-full transition-opacity duration-200 ${scrub && scrub !== shownDate ? 'opacity-30' : ''}`}>
                <PlateMedia item={item} />
              </div>
              {scrubThumb && (
                <img
                  src={optimizedImageUrl(scrubThumb, THUMB_WIDTH)}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full scale-105 object-contain opacity-80 blur-md"
                />
              )}
            </Plate>
          )}
        </div>

        {shownDate && (
          <nav aria-label={t('day.controls')} className="flex items-end gap-3 lg:col-span-8 lg:col-start-1 lg:row-start-2 lg:pl-8">
            <button
              type="button"
              className="control hidden w-12 px-0 lg:inline-flex"
              disabled={shownDate <= APOD_FIRST_DATE}
              onClick={() => go(shiftDay(shownDate, -1))}
              aria-label={t('day.prev')}
              title={t('day.prev')}
            >
              <BiChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <DateRuler date={shownDate} onPreview={setScrub} onCommit={go} />
            <button
              type="button"
              className="control hidden w-12 px-0 lg:inline-flex"
              disabled={shownDate >= today}
              onClick={() => go(shiftDay(shownDate, 1))}
              aria-label={t('day.next')}
              title={t('day.next')}
            >
              <BiChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </nav>
        )}

        <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1">
          {item ? <Margin item={item} isToday={item.date === today} /> : <DateNotation date={shownDate} />}
        </div>

        {shownDate && (
          <div className="hidden items-end gap-3 lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:flex">
            <DateField date={shownDate} today={today} go={go} className="flex-1" />
            <button type="button" className="control" onClick={() => go(randomApodDate(today))}>
              <BiShuffle aria-hidden="true" className="h-4 w-4" />
              {t('day.random')}
            </button>
          </div>
        )}
      </div>

      {item?.explanation && (
        <section aria-labelledby="explanation" className="mt-12 grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <h2 id="explanation" className="notation text-muted lg:col-span-3 lg:pl-8">
            {t('day.explanation')}
          </h2>
          <div className="lg:col-span-7">
            <p lang="en" className="max-w-[66ch] font-serif text-lg leading-[1.7] text-copy lg:text-[1.1875rem]">
              {item.explanation}
            </p>
            {t('day.originalLanguage') && <p className="notation mt-8 text-faint">{t('day.originalLanguage')}</p>}
          </div>
        </section>
      )}

      {shownDate && <MobileDayBar date={shownDate} today={today} go={go} />}
    </article>
  );
};

const DateNotation: React.FC<{ date?: string }> = ({ date }) => {
  const { t, locale } = useI18n();
  if (!date) return null;
  return (
    <div>
      <p className="notation text-muted">
        <time dateTime={date}>
          {formatApodDate(date, locale, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
        </time>
      </p>
      <p className="notation mt-1 text-faint">
        <abbr title={t('day.countHint')} className="no-underline">
          {t('day.count', { n: new Intl.NumberFormat(locale).format(dayNumber(date)) })}
        </abbr>
        <span className="lg:hidden"> · {plateCode(date)}</span>
      </p>
    </div>
  );
};

const NotationLink: React.FC<{ href?: string; to?: string; children: React.ReactNode }> = ({ href, to, children }) => {
  const className = 'link notation inline-flex min-h-12 items-center gap-2 text-muted hover:text-star';
  return to ? (
    <Link to={to} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <BiLinkExternal aria-hidden="true" className="h-4 w-4" />
    </a>
  );
};

const Margin: React.FC<{ item: ApodItem; isToday: boolean }> = ({ item, isToday }) => {
  const { t, locale } = useI18n();
  const hours = isToday ? hoursUntilNextApod() : 0;
  const shareUrl = `${window.location.origin}/apod/${item.date}`;

  return (
    <header className="flex h-full flex-col">
      <DateNotation date={item.date} />
      <h1 lang="en" className="mt-5 font-serif text-[clamp(2.25rem,1.4rem+2.2vw,4rem)] font-normal leading-[1.04] tracking-[-0.015em] text-star lg:mt-8">
        {item.title}
      </h1>
      {item.copyright && (
        <p className="mt-5 text-base text-copy">
          <span className="notation mr-2 text-faint">{t('day.credit')}</span>
          <span lang="en">{item.copyright}</span>
        </p>
      )}
      <div className="mt-8 self-start">
        <ShareMenu title={item.title} url={shareUrl} dateLabel={formatApodDate(item.date, locale, { dateStyle: 'long' })} />
      </div>
      <ul className="mt-3 flex flex-col">
        {item.hdurl && (
          <li>
            <NotationLink href={item.hdurl}>{t('day.hd')}</NotationLink>
          </li>
        )}
        <li>
          <NotationLink href={officialApodUrl(item.date)}>{t('day.official')}</NotationLink>
        </li>
        <li>
          <NotationLink to={`/archive/${monthOf(item.date)}`}>{t('day.month')}</NotationLink>
        </li>
      </ul>
      {isToday && (
        <p className="notation mt-auto pt-6 text-faint">{hours <= 1 ? t('day.nextApodSoon') : t('day.nextApod', { h: hours })}</p>
      )}
    </header>
  );
};

const ErrorPlate: React.FC<{
  kind: ApodErrorKind;
  date?: string;
  onRetry: () => void;
  onGo: (date: string) => void;
}> = ({ kind, date, onRetry, onGo }) => {
  const { t } = useI18n();
  const official = date ? officialApodUrl(date) : 'https://apod.nasa.gov/apod/astropix.html';
  return (
    <EmptyPlate className={PLATE_SIZE} title={t(`error.${kind}.title`)} body={t(`error.${kind}.body`)}>
      {(kind === 'rate-limit' || kind === 'network') && (
        <button type="button" className="control" onClick={onRetry}>
          {t('error.retry')}
        </button>
      )}
      {kind === 'not-found' && date && date > APOD_FIRST_DATE && (
        <button type="button" className="control" onClick={() => onGo(shiftDay(date, -1))}>
          {t('day.prev')}
        </button>
      )}
      {kind === 'not-found' ? (
        <Link to="/" className="control">
          {t('error.today')}
        </Link>
      ) : (
        <a href={official} target="_blank" rel="noopener noreferrer" className="control">
          {t('error.official')}
        </a>
      )}
    </EmptyPlate>
  );
};

interface ControlsProps {
  date: string;
  today: string;
  go: (date: string) => void;
}

const DateField: React.FC<ControlsProps & { className?: string }> = ({ date, today, go, className = '' }) => {
  const { t } = useI18n();
  return (
    <label className={`control relative px-3 focus-within:border-star ${className}`}>
      <span className="sr-only">{t('day.pickDate')}</span>
      <input
        type="date"
        className="date-field w-full min-w-0 bg-transparent text-center text-star focus-visible:outline-none"
        min={APOD_FIRST_DATE}
        max={today}
        value={date}
        onChange={(e) => isValidApodDate(e.target.value, today) && go(e.target.value)}
      />
    </label>
  );
};

/** Thumb-reach day travel on phones; sticks to the bottom while the day is on screen. */
const MobileDayBar: React.FC<ControlsProps> = (props) => {
  const { t } = useI18n();
  const { date, today, go } = props;
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-2 border-t border-line bg-ink px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:-mx-6 sm:px-6 lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <button
          type="button"
          className="control w-12 shrink-0 px-0"
          disabled={date <= APOD_FIRST_DATE}
          onClick={() => go(shiftDay(date, -1))}
          aria-label={t('day.prev')}
        >
          <BiChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <DateField {...props} className="min-w-0 flex-1" />
        <button
          type="button"
          className="control w-12 shrink-0 px-0"
          disabled={date >= today}
          onClick={() => go(shiftDay(date, 1))}
          aria-label={t('day.next')}
        >
          <BiChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="control w-12 shrink-0 px-0"
          onClick={() => go(randomApodDate(today))}
          aria-label={t('day.random')}
        >
          <BiShuffle aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
