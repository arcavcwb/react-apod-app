import React from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiLeftArrowAlt, BiLinkExternal, BiRightArrowAlt } from 'react-icons/bi';
import { DateJump } from '../Components/Day/DateJump';
import { GalleryItem, GalleryItemSkeleton } from '../Components/Gallery/GalleryItem';
import { Notice } from '../Components/Notice/Notice';
import { Pager, PagerPanel } from '../Components/Pager/Pager';
import { useApodMonth } from '../Hooks/useApod';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useMediaQuery } from '../Hooks/useMediaQuery';
import { useI18n } from '../i18n/I18n';
import { markTravel } from '../utils/travel';
import { APOD_FIRST_DATE, apodToday, formatApodDate, isValidMonth, monthOf, monthRange, shiftDay, shiftMonth } from '../utils/date';

const FIRST_MONTH = monthOf(APOD_FIRST_DATE);
const OFFICIAL_ARCHIVE = 'https://apod.nasa.gov/apod/archivepix.html';
const SIZES = '(min-width: 1280px) 16vw, (min-width: 1024px) 19vw, (min-width: 640px) 31vw, 48vw';
// Intl gives "septiembre de 2026"; titles and select options start with a capital.
const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);

/** Desktop pages: columns from the width, rows from the height, so a page always fits the screen. */
function useGridShape() {
  const xl = useMediaQuery('(min-width: 1280px)');
  const tall = useMediaQuery('(min-height: 62rem)');
  return { cols: xl ? 6 : 5, rows: tall ? 3 : 2 };
}

export const Gallery: React.FC = () => {
  const { month } = useParams();
  const { t } = useI18n();
  const today = apodToday();

  if (!month) return <Navigate to={`/gallery/${monthOf(today)}`} replace />;
  if (!isValidMonth(month, today)) {
    return (
      <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10 lg:pt-16">
        <Notice level={1} title={t('error.invalid.title')} body={t('error.invalid.body')}>
          <Link to="/gallery" className="btn btn-ghost">
            {t('nav.gallery')}
          </Link>
        </Notice>
      </div>
    );
  }
  return <MonthGallery month={month} today={today} />;
};

/** Links shared before the redesign used /archive and /archive/YYYY-MM. */
export const LegacyArchiveRedirect: React.FC = () => {
  const { month } = useParams();
  return <Navigate to={month ? `/gallery/${month}` : '/gallery'} replace />;
};

/**
 * A month, newest first; weeks fill in as they land. Desktop: a slide of pages of rounded tiles, each
 * page sized to fit the screen. Phones: a grid that scrolls down. The neighbouring months follow below.
 */
const MonthGallery: React.FC<{ month: string; today: string }> = ({ month, today }) => {
  const { t, locale } = useI18n();
  const { result, partial, retry } = useApodMonth(month);
  const wide = useMediaQuery('(min-width: 1024px)');
  const { cols, rows } = useGridShape();
  const title = capitalize(formatApodDate(`${month}-01`, locale, { month: 'long', year: 'numeric' }));
  useDocumentTitle(`${title} · ${t('gallery.title')}`);

  const loading = result === null;
  const byDate = new Map((result?.data ?? partial ?? []).map((item) => [item.date, item]));
  const { start, end } = monthRange(month, today);
  const cells: React.ReactNode[] = [];
  for (let date = end; date >= start; date = shiftDay(date, -1)) {
    const item = byDate.get(date);
    // A day NASA did not publish simply is not in the grid once the month has landed.
    if (item || loading) {
      cells.push(
        <li key={date} className={wide ? 'min-h-0' : undefined}>
          {item ? <GalleryItem item={item} sizes={SIZES} fill={wide} /> : <GalleryItemSkeleton fill={wide} />}
        </li>
      );
    }
  }
  const perPage = cols * rows;
  const pages = Array.from({ length: Math.max(1, Math.ceil(cells.length / perPage)) }, (_, i) =>
    cells.slice(i * perPage, (i + 1) * perPage)
  );

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6 xl:px-14">
      <MonthHeader month={month} today={today} title={title} />

      {result?.error ? (
        <Notice alert title={t(`error.${result.error}.title`)} body={t(`error.${result.error}.body`)} className="mt-10">
          {(result.error === 'rate-limit' || result.error === 'network') && (
            <button type="button" className="btn btn-primary" onClick={retry}>
              {t('error.retry')}
            </button>
          )}
          <a href={OFFICIAL_ARCHIVE} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {t('gallery.official')}
          </a>
        </Notice>
      ) : (
        <>
          {loading && (
            <p role="status" className="sr-only">
              {t('gallery.loading')}
            </p>
          )}
          {/* The slide holds only the pictures; everything else follows below in the page. */}
          {wide ? (
            <div className="mt-5 h-[max(22rem,calc(100svh-20rem))]" style={{ viewTransitionName: 'gallery-grid' }}>
            <Pager label={title} resetKey={month} className="h-full" trackClassName="-mx-10 xl:-mx-14">
              {pages.map((page, i) => (
                <PagerPanel key={i} className="px-10 py-2 xl:px-14">
                  <ol
                    aria-busy={loading}
                    className="grid h-full gap-x-6 gap-y-5 xl:gap-x-8"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
                  >
                    {page}
                  </ol>
                </PagerPanel>
              ))}
            </Pager>
            </div>
          ) : (
            <ol aria-busy={loading} className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4" style={{ viewTransitionName: 'gallery-grid' }}>
              {cells}
            </ol>
          )}
          <div className="mt-10 lg:mt-4">
            <MonthPager month={month} today={today} />
          </div>
        </>
      )}
    </div>
  );
};

const MonthHeader: React.FC<{ month: string; today: string; title: string }> = ({ month, today, title }) => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const lastMonth = monthOf(today);
  const [year, mm] = month.split('-');
  const years = Array.from({ length: Number(lastMonth.slice(0, 4)) - 1994 }, (_, i) => String(1995 + i)).reverse();
  const clamp = (m: string) => (m < FIRST_MONTH ? FIRST_MONTH : m > lastMonth ? lastMonth : m);
  const go = (m: string) => {
    const to = clamp(m);
    if (to === month) return;
    markTravel(to < month ? 'prev' : 'next');
    navigate(`/gallery/${to}`, { viewTransition: true });
  };

  return (
    <header className="grid shrink-0 gap-3 lg:grid-cols-12 lg:items-end lg:gap-x-8">
      <h1 className="text-display font-light text-fg lg:col-span-6" style={{ viewTransitionName: 'gallery-title' }}>
        <span className="sr-only">{t('gallery.title')}: </span>
        {title}
      </h1>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 lg:col-span-6 lg:justify-end">
        <div role="group" aria-label={t('gallery.nav')} className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-cosmic btn-icon shrink-0"
            disabled={month <= FIRST_MONTH}
            onClick={() => go(shiftMonth(month, -1))}
            aria-label={t('gallery.prev')}
            title={t('gallery.prev')}
          >
            <BiChevronLeft aria-hidden="true" className="lean-left h-5 w-5" />
          </button>
          <SelectControl label={t('gallery.month')} value={mm} onChange={(v) => go(`${year}-${v}`)}>
            {Array.from({ length: 12 }, (_, i) => {
              const value = String(i + 1).padStart(2, '0');
              return (
                <option key={value} value={value}>
                  {capitalize(formatApodDate(`2024-${value}-01`, locale, { month: 'long' }))}
                </option>
              );
            })}
          </SelectControl>
          <SelectControl label={t('gallery.year')} value={year} onChange={(v) => go(`${v}-${mm}`)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectControl>
          <button
            type="button"
            className="btn btn-cosmic btn-icon shrink-0"
            disabled={month >= lastMonth}
            onClick={() => go(shiftMonth(month, 1))}
            aria-label={t('gallery.next')}
            title={t('gallery.next')}
          >
            <BiChevronRight aria-hidden="true" className="lean-right h-5 w-5" />
          </button>
        </div>
        <DateJump className="hidden w-52 sm:block" />
      </div>
    </header>
  );
};

const SelectControl: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}> = ({ label, value, onChange, children }) => (
  <label className="field relative flex min-h-12 min-w-0 items-center lg:min-h-[3.25rem]">
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-12 w-full min-w-0 cursor-pointer appearance-none rounded-full bg-transparent pl-4 pr-9 tabular-nums lg:min-h-[3.25rem]"
    >
      {children}
    </select>
    <BiChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 h-4 w-4 text-muted" />
  </label>
);

/** After the pictures: the month before and the month after, named, as buttons that stay on the first screen. */
const MonthPager: React.FC<{ month: string; today: string }> = ({ month, today }) => {
  const { t, locale } = useI18n();
  const older = shiftMonth(month, -1);
  const newer = shiftMonth(month, 1);
  const name = (m: string) => capitalize(formatApodDate(`${m}-01`, locale, { month: 'long', year: 'numeric' }));
  const button = 'btn btn-ghost min-h-14 gap-3 px-5 py-2';

  return (
    <nav aria-label={t('gallery.nav')} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {older >= FIRST_MONTH ? (
        <Link to={`/gallery/${older}`} viewTransition onClick={() => markTravel('prev')} className={`${button} justify-start text-left`}>
          <BiLeftArrowAlt aria-hidden="true" className="lean-left h-5 w-5 text-muted" />
          <span>
            <span className="block text-small text-muted">{t('gallery.prev')}</span>
            <span className="block">{name(older)}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {newer <= monthOf(today) ? (
        <Link to={`/gallery/${newer}`} viewTransition onClick={() => markTravel('next')} className={`${button} justify-end text-right`}>
          <span>
            <span className="block text-small text-muted">{t('gallery.next')}</span>
            <span className="block">{name(newer)}</span>
          </span>
          <BiRightArrowAlt aria-hidden="true" className="lean-right h-5 w-5 text-muted" />
        </Link>
      ) : (
        <a href={OFFICIAL_ARCHIVE} target="_blank" rel="noopener noreferrer" className={`${button} justify-end`}>
          {t('gallery.official')}
          <BiLinkExternal aria-hidden="true" className="h-4 w-4 text-muted" />
        </a>
      )}
    </nav>
  );
};
