import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate, useViewTransitionState } from 'react-router-dom';
import { BiBookOpen, BiChevronLeft, BiChevronRight, BiLinkExternal, BiPlay, BiRightArrowAlt, BiShuffle, BiX } from 'react-icons/bi';
import { ApodItem } from '../../contracts/apod.contract';
import { useApodDay, useApodMonth } from '../../Hooks/useApod';
import { useDocumentTitle } from '../../Hooks/useDocumentTitle';
import { useMediaQuery } from '../../Hooks/useMediaQuery';
import { useI18n } from '../../i18n/I18n';
import { ApodErrorKind, peekDay, thumbnailOf } from '../../services/nasa.service';
import { APOD_FIRST_DATE, apodToday, formatApodDate, monthOf, officialApodUrl, randomApodDate, shiftDay } from '../../utils/date';
import { THUMB_WIDTH, optimizedImageUrl } from '../../utils/imageOptimizer';
import { rememberRatio } from '../../utils/imageRatio';
import { Direction, markMorph, markTravel } from '../../utils/travel';
import { Notice } from '../Notice/Notice';
import { PhotoFrame, usePhotoRatio } from '../Photo/PhotoFrame';
import { ShareButton } from '../Share/ShareButton';
import { DateJump } from './DateJump';

type Reading = 'closed' | 'open' | 'closing';

const smooth = (): ScrollBehavior =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const SHELL = 'mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col px-4 pt-4 sm:px-6 lg:px-10 lg:pb-2 lg:pt-6 xl:px-14';

/**
 * One day. Desktop, on one screen and without scrollbars: title, date, actions and the explanation in
 * columns 1-5; the photograph in columns 6-12, with the ways onward and a slide of the month's days
 * under it. Phones scroll down through photograph, title, actions, the slide, explanation and the
 * ways onward; swiping the photograph changes day.
 */
export const DayView: React.FC<{ date: string }> = ({ date }) => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { result, retry } = useApodDay(date);
  const item = result?.data ?? null;
  const today = apodToday();
  const prev = date > APOD_FIRST_DATE ? shiftDay(date, -1) : null;
  const next = date < today ? shiftDay(date, 1) : null;

  // The reading card belongs to its day: another day opens with it closed, in the same render.
  const [readingFor, setReadingFor] = useState<{ date: string; reading: Reading }>({ date, reading: 'closed' });
  const reading = readingFor.date === date ? readingFor.reading : 'closed';
  const onReading = useCallback((r: Reading) => setReadingFor({ date, reading: r }), [date]);

  // A strip tile about to grow into the photograph: on the page being left, the photograph hands it the shared name.
  const [morphTo, setMorphTo] = useState<string | null>(null);
  useEffect(() => {
    if (morphTo === date) setMorphTo(null);
  }, [date, morphTo]);

  useDocumentTitle(item?.title ?? formatApodDate(date, locale, { dateStyle: 'long' }));
  // On phones the photograph's space takes the picture's shape (capped in height), so no gap opens around the card.
  const ratio = usePhotoRatio(item);
  const wide = useMediaQuery('(min-width: 1024px)');
  // Below 640px the day's four actions sit together as circles under the title.
  const compact = !useMediaQuery('(min-width: 40rem)');

  const travel = useCallback(
    (to: string, direction?: Direction) => {
      markTravel(direction);
      navigate(`/apod/${to}`, { viewTransition: true });
    },
    [navigate]
  );

  // Left and right arrows walk the days, unless focus is in a form control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.target instanceof Element && e.target.closest('input, select, textarea, [contenteditable="true"]')) return;
      if (e.key === 'ArrowLeft' && prev) travel(prev, 'prev');
      if (e.key === 'ArrowRight' && next) travel(next, 'next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, travel]);

  // Swiping the photograph sideways on a touch screen does the same.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => {
      swipeStart.current = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY } : null;
    },
    onPointerUp: (e: React.PointerEvent) => {
      const start = swipeStart.current;
      swipeStart.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(e.clientY - start.y) * 1.5) return;
      if (dx < 0 && next) travel(next, 'next');
      if (dx > 0 && prev) travel(prev, 'prev');
    },
    onPointerCancel: () => {
      swipeStart.current = null;
    },
  };

  // The way to the day before and the day after, always outside the picture: beside the card on desktop;
  // on phones a stepper under it with the date between the arrows. One placement at a time, so each link exists once.
  const arrows = wide ? (
    <nav aria-label={t('day.more')}>
      <div className="absolute right-full top-1/2 mr-3 -translate-y-1/2">
        <DayLink to={prev} direction="prev" />
      </div>
      <div className="absolute left-full top-1/2 ml-3 -translate-y-1/2">
        <DayLink to={next} direction="next" />
      </div>
    </nav>
  ) : (
    <nav aria-label={t('day.more')} className="-mt-2 flex items-center justify-between gap-3">
      <DayLink to={prev} direction="prev" />
      <p className="min-w-0 text-center">
        <time dateTime={date} className="block truncate text-small font-medium text-fg">
          {formatApodDate(date, locale, { dateStyle: 'long' })}
        </time>
        <span className="block truncate text-small text-muted">{t('day.apod')}</span>
      </p>
      <DayLink to={next} direction="next" />
    </nav>
  );

  if (result?.error) {
    return (
      <article className={`${SHELL} justify-center gap-10 lg:gap-14`}>
        <DayError kind={result.error} date={date} onRetry={retry} />
        <Neighbours prev={prev} next={next} />
      </article>
    );
  }

  return (
    <article
      className={`${SHELL} gap-6 lg:relative lg:grid lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)_auto_auto] lg:gap-x-12 lg:gap-y-5 xl:gap-x-16`}
    >
      {/* Below desktop the title comes first, above the photograph. */}
      {!wide && (item ? <DayTitle item={item} className="-mb-2" /> : <TitleSkeleton className="-mb-2" />)}

      <div
        {...swipe}
        className="relative aspect-[var(--ratio)] max-h-[62svh] w-full [touch-action:pan-y_pinch-zoom] lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:max-h-none lg:min-h-0"
        style={{ '--ratio': ratio ?? 1 } as React.CSSProperties}
      >
        <PhotoFrame
          item={item}
          sizes="(min-width: 1024px) 55vw, 100vw"
          transitionName={morphTo && morphTo !== date ? 'none' : 'photo'}
          sides={wide ? arrows : undefined}
        />
      </div>
      {!wide && arrows}

      {/* Covered by the reading card while it is open, so keyboard focus cannot wander behind it. */}
      <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1" {...(reading !== 'closed' ? ({ inert: '' } as Record<string, string>) : {})}>
        {item ? (
          <DayHeader item={item} compact={compact} showTitle={wide} onRandom={() => travel(randomApodDate(today))} />
        ) : (
          wide && <HeaderSkeleton />
        )}
      </div>

      {item && (
        <>
          <DayStrip date={date} morphTo={morphTo} onMorph={setMorphTo} className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-start-4" />
          {item.explanation && (
            <Explanation
              item={item}
              reading={reading}
              onReading={onReading}
              className="lg:col-span-5 lg:col-start-1 lg:row-span-3 lg:row-start-2"
              cardClassName="lg:col-span-5 lg:col-start-1 lg:row-span-4 lg:row-start-1"
            />
          )}
          <Onward
            item={item}
            actions={!compact}
            onRandom={() => travel(randomApodDate(today))}
            className="lg:col-span-7 lg:col-start-6 lg:row-start-3"
          />
        </>
      )}

    </article>
  );
};

const DayHeader: React.FC<{ item: ApodItem; compact: boolean; showTitle: boolean; onRandom: () => void }> = ({
  item,
  compact,
  showTitle,
  onRandom,
}) => {
  const { t, locale } = useI18n();
  const longDate = formatApodDate(item.date, locale, { dateStyle: 'long' });

  return (
    <header>
      {showTitle && <DayTitle item={item} />}
      {/* Phones: all four actions together, as galactic circles. Wider screens: Share and HD as pills here, the rest by the carousel. */}
      <div
        className={`${compact ? 'grid grid-flow-col auto-cols-fr items-start gap-2' : 'flex flex-wrap items-start gap-3'} ${
          showTitle ? 'mt-4 lg:mt-6' : ''
        }`}
      >
        <ShareButton
          primary
          className={compact ? 'justify-self-center' : undefined}
          buttonClassName="galaxy-share"
          title={item.title}
          url={`${window.location.origin}/apod/${item.date}`}
          dateLabel={longDate}
        />
        {item.hdurl && (
          <a
            href={item.hdurl}
            target="_blank"
            rel="noopener noreferrer"
            // Phones show a circle marked "HD"; the name keeps both words.
            aria-label={`${t('day.hd')} (HD)`}
            className="btn btn-ghost btn-action btn-action-trail galaxy-hd justify-self-center"
          >
            <span className="action-icon">
              <span aria-hidden="true" className="text-small font-semibold tracking-[0.04em] sm:hidden">
                HD
              </span>
              <BiLinkExternal aria-hidden="true" className="hidden h-4 w-4 text-muted sm:block" />
            </span>
            <span className="sm:hidden">{t('action.hd')}</span>
            <span className="hidden sm:inline">{t('day.hd')}</span>
          </a>
        )}
        {compact && (
          <>
            <a
              href={officialApodUrl(item.date)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('day.official')}
              className="btn btn-ghost btn-action galaxy-official justify-self-center"
            >
              <span className="action-icon">
                <BiLinkExternal aria-hidden="true" className="h-5 w-5" />
              </span>
              {t('action.official')}
            </a>
            <button
              type="button"
              onClick={onRandom}
              aria-label={t('day.random')}
              className="btn btn-ghost btn-action galaxy-random justify-self-center"
            >
              <span className="action-icon">
                <BiShuffle aria-hidden="true" className="h-5 w-5" />
              </span>
              {t('action.random')}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

/** The day's title, with its date on desktop. Below desktop it sits above the photograph and the date in the stepper under it. */
const DayTitle: React.FC<{ item: ApodItem; className?: string }> = ({ item, className = '' }) => {
  const { t, locale } = useI18n();
  return (
    <div className={className} style={{ viewTransitionName: 'day-title' }}>
      <h1 lang="en" className="line-clamp-3 text-display font-light text-fg">
        {item.title}
      </h1>
      <p className="mt-2 hidden text-small text-muted lg:mt-3 lg:block">
        <time dateTime={item.date}>{formatApodDate(item.date, locale, { dateStyle: 'long' })}</time>
        <span aria-hidden="true"> · </span>
        <span className="sr-only">, </span>
        {t('day.apod')}
      </p>
    </div>
  );
};

/** Below desktop, where the title sits above the photograph while the day is on its way. */
const TitleSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useI18n();
  return (
    <div className={className}>
      <span role="status" className="sr-only">
        {t('day.loading')}
      </span>
      <div aria-hidden="true">
        <div className="skeleton h-10 w-11/12 rounded-xl" />
        <div className="skeleton mt-3 h-10 w-3/5 rounded-xl" />
      </div>
    </div>
  );
};

/** The previous or next day: a real link (it can be opened, copied, shared) in the cosmic arrow design every arrow shares. */
const DayLink: React.FC<{ to: string | null; direction: Direction }> = ({ to, direction }) => {
  const { t } = useI18n();
  // With no day that way, an empty slot keeps the stepper's date centred.
  if (!to) return <span aria-hidden="true" className="block h-12 w-12 shrink-0 lg:h-[3.25rem] lg:w-[3.25rem]" />;
  const label = t(direction === 'prev' ? 'day.prev' : 'day.next');
  const Icon = direction === 'prev' ? BiChevronLeft : BiChevronRight;
  return (
    <Link
      to={`/apod/${to}`}
      viewTransition
      onClick={() => markTravel(direction)}
      // Its own transition name keeps it on the card's edge while the photographs trade places.
      style={{ viewTransitionName: direction === 'prev' ? 'day-prev' : 'day-next' }}
      className="btn btn-cosmic btn-icon shrink-0"
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" className={`h-5 w-5 ${direction === 'prev' ? 'lean-left' : 'lean-right'}`} />
    </Link>
  );
};

/**
 * NASA's explanation. Phones read it down the page. Desktop keeps the page on one screen without a
 * scrollbar: the text shows what fits, fading at the foot, and when it does not all fit "Read it all"
 * grows an opaque rounded card over the whole left column from where the text begins.
 */
const Explanation: React.FC<{
  item: ApodItem;
  reading: Reading;
  onReading: (reading: Reading) => void;
  className?: string;
  /** Grid placement of the card: the left column, every row. */
  cardClassName?: string;
}> = ({ item, reading, onReading, className = '', cardClassName = '' }) => {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [from, setFrom] = useState(0);
  const note = t('day.originalLanguage');

  // Only a desktop box has a fixed height; on phones the text never overflows and no button shows.
  useLayoutEffect(() => {
    const box = clip.current;
    if (!box) return;
    const measure = () => setOverflows(box.scrollHeight > box.clientHeight + 1);
    measure();
    document.fonts?.ready.then(measure);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [item.explanation]);

  const finish = useCallback(() => onReading('closed'), [onReading]);

  // Back to "Read it all" after the card closes: only once the section behind it is no longer inert.
  const openedOn = useRef<string | null>(null);
  useEffect(() => {
    if (reading !== 'closed') {
      openedOn.current = item.date;
      return;
    }
    if (openedOn.current === item.date) more.current?.focus({ preventScroll: true });
    openedOn.current = null;
  }, [reading, item.date]);

  useEffect(() => {
    if (reading !== 'open') return;
    close.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onReading('closing');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reading, onReading]);

  // The fold normally ends with its animation; if that never fires (a hidden card, no animation), close anyway.
  useEffect(() => {
    if (reading !== 'closing') return;
    const id = window.setTimeout(finish, 450);
    return () => window.clearTimeout(id);
  }, [reading, finish]);

  // Below desktop the card cannot show, so leaving desktop width closes it and frees the header.
  useEffect(() => {
    if (reading === 'closed' || typeof window.matchMedia !== 'function') return;
    const wide = window.matchMedia('(min-width: 1024px)');
    const onChange = () => !wide.matches && onReading('closed');
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, [reading, onReading]);

  const open = () => {
    // The card grows from the top of the text, measured against the top of the grid.
    const box = section.current;
    const grid = box?.parentElement;
    if (box && grid) {
      const top = grid.getBoundingClientRect().top + parseFloat(getComputedStyle(grid).paddingTop);
      setFrom(Math.max(0, box.getBoundingClientRect().top - top));
    }
    onReading('open');
  };

  const text = (
    <>
      <p lang="en" className="max-w-[66ch] leading-[1.75] text-fg">
        {item.explanation}
      </p>
      {note && <p className="mt-4 text-small text-faint">{note}</p>}
    </>
  );

  return (
    <>
      <section
        ref={section}
        aria-labelledby="explanation"
        className={`lg:flex lg:min-h-0 lg:flex-col ${className}`}
        style={{ viewTransitionName: 'day-text' }}
        {...(reading !== 'closed' ? ({ inert: '' } as Record<string, string>) : {})}
      >
        <h2 id="explanation" className="sr-only">
          {t('day.explanation')}
        </h2>
        <div
          ref={clip}
          className={`lg:min-h-0 lg:flex-1 lg:overflow-hidden ${
            overflows ? 'lg:[mask-image:linear-gradient(to_bottom,#000_calc(100%-5rem),transparent)]' : ''
          }`}
        >
          {text}
        </div>
        {overflows && (
          <button
            ref={more}
            type="button"
            onClick={open}
            aria-expanded={reading !== 'closed'}
            aria-controls="reading"
            className="btn btn-ghost mt-3 hidden self-start lg:inline-flex"
          >
            <BiBookOpen aria-hidden="true" className="h-5 w-5 text-muted" />
            {t('day.readMore')}
          </button>
        )}
      </section>

      {reading !== 'closed' && (
        <div
          id="reading"
          role="region"
          aria-labelledby="reading-title"
          style={{ '--from': `${from}px` } as React.CSSProperties}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && reading === 'closing') finish();
          }}
          className={`surface-float absolute inset-0 z-20 hidden flex-col rounded-[2rem] bg-panel p-6 lg:flex xl:p-8 ${
            reading === 'closing' ? 'reading-out' : 'reading-in'
          } ${cardClassName}`}
        >
          <div className="flex items-start justify-between gap-4">
            <h2 id="reading-title" lang="en" className="line-clamp-2 pt-3 font-semibold text-fg">
              {item.title}
            </h2>
            <button
              ref={close}
              type="button"
              onClick={() => onReading('closing')}
              className="btn btn-ghost btn-icon shrink-0"
              aria-label={t('day.readLess')}
              title={t('day.readLess')}
            >
              <BiX aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          {/* The last resort on a very short screen: the card itself scrolls, with a thin themed bar. */}
          <div className="thin-scroll mt-4 min-h-0 flex-1 overflow-y-auto pr-3">{text}</div>
        </div>
      )}
    </>
  );
};

/** The ways onward from a day: its official page and a random day (under the title on phones), any date. */
const Onward: React.FC<{ item: ApodItem; onRandom: () => void; actions?: boolean; className?: string }> = ({
  item,
  onRandom,
  actions = true,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 lg:flex-nowrap lg:items-center ${className}`}>
      {/* On phones these two join Share and HD under the title. */}
      {actions && (
        <div className="flex flex-wrap items-start gap-6 sm:gap-3">
          <a
            href={officialApodUrl(item.date)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('day.official')}
            className="btn btn-ghost btn-action btn-action-trail sm:px-5"
          >
            <span className="action-icon">
              <BiLinkExternal aria-hidden="true" className="h-5 w-5 sm:h-4 sm:w-4 sm:text-muted" />
            </span>
            <span className="sm:hidden">{t('action.official')}</span>
            <span className="hidden sm:inline">{t('day.official')}</span>
          </a>
          <button type="button" onClick={onRandom} aria-label={t('day.random')} className="btn btn-ghost btn-action sm:px-5">
            <span className="action-icon">
              <BiShuffle aria-hidden="true" className="h-5 w-5 sm:text-muted" />
            </span>
            <span className="sm:hidden">{t('action.random')}</span>
            <span className="hidden sm:inline">{t('day.random')}</span>
          </button>
        </div>
      )}
      <DateJump value={item.date} compact className="w-full sm:w-56" />
    </div>
  );
};

/**
 * The day's month as a carousel on a curve: the day in the middle faces you, largest and in front, the
 * others turn away toward the edges (see .strip in index.css). Oldest on the left; the day you are on is
 * ringed in aurora and centred. The arrows sit outside it, at its sides; swipe, trackpad and wheel turn it
 * a day at a time. No scrollbar.
 */
const DayStrip: React.FC<{
  date: string;
  /** The tile that was clicked, while it grows into the photograph. */
  morphTo: string | null;
  onMorph: (date: string) => void;
  className?: string;
}> = ({ date, morphTo, onMorph, className = '' }) => {
  const { t, locale } = useI18n();
  const month = monthOf(date);
  const { result, partial } = useApodMonth(month);
  const strip = useRef<HTMLOListElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const centred = useRef(false);
  const [edges, setEdges] = useState({ prev: false, next: false });
  const items = [...(result?.data ?? partial ?? [])].sort((a, b) => a.date.localeCompare(b.date));
  const loading = result === null;

  const update = useCallback(() => {
    const list = strip.current;
    if (!list) return;
    const prev = list.scrollLeft > 4;
    const next = list.scrollLeft + list.clientWidth < list.scrollWidth - 4;
    setEdges((e) => (e.prev === prev && e.next === next ? e : { prev, next }));
    // The phone's progress thumb is moved directly, not through state, so scrolling never re-renders the tiles.
    const bar = thumb.current;
    if (bar) {
      const range = list.scrollWidth - list.clientWidth;
      const size = Math.min(100, Math.max(14, (list.clientWidth / list.scrollWidth) * 100));
      const at = range > 0 ? list.scrollLeft / range : 0;
      bar.style.width = `${size}%`;
      bar.style.transform = `translateX(${(at * (100 - size) * 100) / size}%)`;
    }
  }, []);

  // One day's step (a tile and its gap), untouched by the curve's scaling.
  const dayStep = useCallback(() => ((strip.current?.querySelector('li') as HTMLElement | null)?.offsetWidth ?? 88) + 12, []);

  // Keep the day centred: at once on arrival, gliding when travelling from day to day.
  useEffect(() => {
    const list = strip.current;
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]')?.closest('li');
    if (!list || !current) return;
    list.scrollTo?.({
      left: current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2,
      // Inside a view transition the strip is already fading in with the page; a glide there only costs frames.
      behavior: centred.current && !document.documentElement.dataset.travel && !document.documentElement.dataset.morph ? smooth() : 'auto',
    });
    centred.current = true;
    update();
  }, [date, items.length, update]);

  useEffect(() => {
    const list = strip.current;
    if (!list) return;
    update();
    // On desktop the page does not scroll, so a vertical wheel turns the carousel, a day per notch.
    let last = -Infinity;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || list.scrollWidth <= list.clientWidth) return;
      if (typeof window.matchMedia === 'function' && !window.matchMedia('(min-width: 1024px)').matches) return;
      e.preventDefault();
      const fresh = e.timeStamp - last > 140;
      last = e.timeStamp;
      if (fresh) list.scrollBy({ left: Math.sign(e.deltaY) * dayStep(), behavior: smooth() });
    };
    list.addEventListener('wheel', onWheel, { passive: false });
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(list);
    return () => {
      ro?.disconnect();
      list.removeEventListener('wheel', onWheel);
    };
  }, [update, dayStep]);

  const slide = (direction: 1 | -1) => strip.current?.scrollBy?.({ left: direction * dayStep() * 3, behavior: smooth() });

  // Phones have no arrows: the first time the carousel is well in view, it sways part of a day and back,
  // unless it has already been touched or motion is reduced.
  const hasItems = items.length > 0;
  useEffect(() => {
    const list = strip.current;
    if (!list || !hasItems || typeof IntersectionObserver === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (!window.matchMedia('(max-width: 39.99rem)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let touched = false;
    const onTouch = () => {
      touched = true;
    };
    list.addEventListener('pointerdown', onTouch, { once: true });
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched || list.scrollWidth <= list.clientWidth) return;
        io.disconnect();
        const start = list.scrollLeft;
        const room = list.scrollWidth - list.clientWidth - start;
        const sway = room > 40 ? Math.min(dayStep() * 0.6, room) : -dayStep() * 0.6;
        list.style.scrollSnapType = 'none';
        list.scrollTo({ left: start + sway, behavior: 'smooth' });
        timers.push(window.setTimeout(() => list.scrollTo({ left: start, behavior: 'smooth' }), 420));
        timers.push(window.setTimeout(() => (list.style.scrollSnapType = ''), 1000));
      },
      { threshold: 0.7 }
    );
    // After the day has been centred on arrival.
    timers.push(window.setTimeout(() => io.observe(list), 600));
    return () => {
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      list.removeEventListener('pointerdown', onTouch);
      list.style.scrollSnapType = '';
    };
  }, [hasItems, dayStep]);

  if (result?.error) return null;
  return (
    <section aria-labelledby="strip-title" className={className}>
      <div className="-my-2 flex items-center justify-between gap-3">
        <h2 id="strip-title" className="min-w-0 truncate text-small font-semibold text-fg">
          {capitalize(formatApodDate(`${month}-01`, locale, { month: 'long', year: 'numeric' }))}
        </h2>
        <Link
          to={`/gallery/${month}`}
          className="group -mr-2.5 inline-flex min-h-12 shrink-0 items-center gap-1 rounded-full px-2.5 text-small text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
        >
          {t('recent.all')}
          <BiRightArrowAlt aria-hidden="true" className="h-5 w-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
        </Link>
      </div>
      {/* The arrows sit outside the carousel, at its sides. */}
      <div className="mt-2 flex items-center gap-2 sm:gap-3">
        <StripButton direction={-1} enabled={edges.prev} onClick={() => slide(-1)} />
        <ol
          ref={strip}
          aria-busy={loading}
          onScroll={update}
          className="strip relative flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-4"
          style={{ '--fade-l': edges.prev ? '2.5rem' : '0px', '--fade-r': edges.next ? '2.5rem' : '0px' } as React.CSSProperties}
        >
          {items.length === 0 && loading
            ? Array.from({ length: 8 }, (_, i) => (
                <li key={i} aria-hidden="true" className="shrink-0 snap-center">
                  <div className="strip-tile skeleton rounded-2xl" />
                </li>
              ))
            : items.map((day) => <StripTile key={day.date} item={day} from={date} morphTo={morphTo} onMorph={onMorph} />)}
        </ol>
        <StripButton direction={1} enabled={edges.next} onClick={() => slide(1)} />
      </div>
      {/* Phones: no arrows; a thin aurora thumb shows where in the month you are, and that the carousel slides. */}
      <div aria-hidden="true" className="mx-auto mt-1 h-1 w-28 overflow-hidden rounded-full bg-white/10 sm:hidden">
        <span
          ref={thumb}
          className="block h-full w-1/4 rounded-full bg-[linear-gradient(90deg,var(--accent),var(--nebula),var(--aurora))]"
        />
      </div>
    </section>
  );
};

const StripButton: React.FC<{ direction: 1 | -1; enabled: boolean; onClick: () => void }> = ({ direction, enabled, onClick }) => {
  const { t } = useI18n();
  const label = t(direction < 0 ? 'strip.prev' : 'strip.next');
  const Icon = direction < 0 ? BiChevronLeft : BiChevronRight;
  return (
    <button type="button" onClick={onClick} disabled={!enabled} aria-label={label} title={label} className="btn btn-cosmic btn-icon hidden shrink-0 sm:inline-flex">
      <Icon aria-hidden="true" className={`h-5 w-5 ${direction < 0 ? 'lean-left' : 'lean-right'}`} />
    </button>
  );
};

/** A day in the carousel. Clicked, it grows up into the photograph instead of sliding. */
const StripTile: React.FC<{ item: ApodItem; from: string; morphTo: string | null; onMorph: (date: string) => void }> = ({
  item,
  from,
  morphTo,
  onMorph,
}) => {
  const { locale } = useI18n();
  const to = `/apod/${item.date}`;
  const current = item.date === from;
  // Only the clicked tile takes the photograph's name, and only on the page being left.
  const morphing = useViewTransitionState(to) && morphTo === item.date && !current;
  const thumb = thumbnailOf(item);

  return (
    <li className="shrink-0 snap-center">
      <Link
        to={to}
        viewTransition
        onClick={() => {
          if (current) return;
          markMorph();
          onMorph(item.date);
        }}
        aria-current={current ? 'page' : undefined}
        aria-label={`${item.title}, ${formatApodDate(item.date, locale, { day: 'numeric', month: 'long' })}`}
        title={item.title}
        className={`group block rounded-2xl focus-visible:outline-offset-2 ${current ? 'aurora-rim' : ''}`}
      >
        <span className="tile strip-tile relative block" style={morphing ? { viewTransitionName: 'photo' } : undefined}>
          {thumb ? (
            <img
              src={optimizedImageUrl(thumb, THUMB_WIDTH)}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={(e) => rememberRatio(thumb, e.currentTarget)}
              className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
          ) : (
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-faint">
              {item.media_type === 'video' && <BiPlay className="h-6 w-6" />}
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute bottom-1.5 left-1.5 min-w-6 rounded-full bg-[rgb(3_7_18/0.75)] px-1.5 text-center text-small leading-6 tabular-nums text-fg"
          >
            {formatApodDate(item.date, locale, { day: 'numeric' })}
          </span>
        </span>
      </Link>
    </li>
  );
};

const DayError: React.FC<{ kind: ApodErrorKind; date: string; onRetry: () => void }> = ({ kind, date, onRetry }) => {
  const { t } = useI18n();
  return (
    <Notice level={1} alert title={t(`error.${kind}.title`)} body={t(`error.${kind}.body`)}>
      {(kind === 'rate-limit' || kind === 'network') && (
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          {t('error.retry')}
        </button>
      )}
      {kind === 'not-found' && (
        <Link to="/" className="btn btn-ghost">
          {t('error.today')}
        </Link>
      )}
      <a href={officialApodUrl(date)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
        {t('error.official')}
      </a>
    </Notice>
  );
};

/** When a day has no picture: the day before and the day after, as rounded tiles when the month is at hand. */
const Neighbours: React.FC<{ prev: string | null; next: string | null }> = ({ prev, next }) => {
  const { t } = useI18n();
  if (!prev && !next) return null;
  return (
    <nav aria-labelledby="more-title">
      <h2 id="more-title" className="font-semibold text-fg">
        {t('day.more')}
      </h2>
      <ul className="mt-4 flex flex-col gap-4">
        {prev && (
          <li>
            <Neighbour date={prev} direction="prev" />
          </li>
        )}
        {next && (
          <li>
            <Neighbour date={next} direction="next" />
          </li>
        )}
      </ul>
    </nav>
  );
};

const Neighbour: React.FC<{ date: string; direction: Direction }> = ({ date, direction }) => {
  const { t, locale } = useI18n();
  const item = peekDay(date);
  const thumb = item && thumbnailOf(item);
  const isNext = direction === 'next';
  const Chevron = isNext ? BiChevronRight : BiChevronLeft;
  const longDate = formatApodDate(date, locale, { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Link
      to={`/apod/${date}`}
      viewTransition
      onClick={() => markTravel(direction)}
      aria-label={`${t(isNext ? 'day.next' : 'day.prev')}: ${item?.title ?? longDate}`}
      className="group flex items-center gap-4 rounded-2xl focus-visible:outline-offset-4"
    >
      <span className="tile relative block h-20 w-20 shrink-0 sm:h-24 sm:w-24">
        {!thumb && item?.media_type === 'video' && (
          <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-faint">
            <BiPlay className="h-6 w-6" />
          </span>
        )}
        {thumb && (
          <img
            src={optimizedImageUrl(thumb, THUMB_WIDTH)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="flex items-start gap-1">
          <Chevron aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-muted group-hover:text-fg" />
          <span
            lang={item ? 'en' : undefined}
            className="line-clamp-2 font-medium leading-snug text-fg decoration-accent underline-offset-4 group-hover:underline"
          >
            {item?.title ?? longDate}
          </span>
        </span>
        {item && (
          <time dateTime={date} className="mt-1 block pl-5 text-small text-faint">
            {longDate}
          </time>
        )}
      </span>
    </Link>
  );
};

const HeaderSkeleton: React.FC = () => {
  const { t } = useI18n();
  return (
    <div>
      <span role="status" className="sr-only">
        {t('day.loading')}
      </span>
      <div aria-hidden="true">
        <div className="skeleton h-10 w-11/12 rounded-xl lg:h-14" />
        <div className="skeleton mt-3 h-10 w-3/5 rounded-xl lg:h-14" />
        <div className="skeleton mt-4 h-4 w-2/5 rounded-full" />
        <div className="mt-6 flex gap-3">
          <div className="skeleton h-12 w-36 rounded-full" />
          <div className="skeleton h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
};
