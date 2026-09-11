import React from 'react';
import { Link, Navigate, useNavigate, useParams, useViewTransitionState } from 'react-router-dom';
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiLinkExternal, BiPlay } from 'react-icons/bi';
import { EmptyPlate } from '../Components/Plate/Plate';
import { ApodItem } from '../contracts/apod.contract';
import { useApodMonth } from '../Hooks/useApod';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';
import { thumbnailOf } from '../services/nasa.service';
import {
  APOD_FIRST_DATE,
  apodToday,
  daysInMonth,
  firstWeekday,
  formatApodDate,
  isValidMonth,
  monthOf,
  shiftMonth,
} from '../utils/date';
import { THUMB_WIDTH, optimizedImageUrl } from '../utils/imageOptimizer';

const FIRST_MONTH = monthOf(APOD_FIRST_DATE);
// Intl gives "septiembre"; select options cannot use ::first-letter.
const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);

export const Archive: React.FC = () => {
  const { month } = useParams();
  const { t } = useI18n();
  const today = apodToday();

  if (!month) return <Navigate to={`/archive/${monthOf(today)}`} replace />;
  if (!isValidMonth(month, today)) {
    return (
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10">
        <EmptyPlate className="min-h-[60svh]" title={t('error.invalid.title')} body={t('error.invalid.body')}>
          <Link to="/archive" className="control">
            {t('nav.archive')}
          </Link>
        </EmptyPlate>
      </div>
    );
  }
  return <MonthIndex month={month} today={today} />;
};

const MonthIndex: React.FC<{ month: string; today: string }> = ({ month, today }) => {
  const { t, locale } = useI18n();
  const { result, retry } = useApodMonth(month);
  const monthName = formatApodDate(`${month}-01`, locale, { month: 'long', year: 'numeric' });
  useDocumentTitle(`${t('archive.title')} · ${monthName}`);

  const byDay = new Map((result?.data ?? []).map((item) => [Number(item.date.slice(8)), item]));
  const lastDay = month === monthOf(today) ? Number(today.slice(8)) : daysInMonth(month);
  const firstDay = month === FIRST_MONTH ? Number(APOD_FIRST_DATE.slice(8)) : 1;
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => i + 1);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    // 2024-01-01 was a Monday.
    formatApodDate(`2024-01-0${i + 1}`, locale, { weekday: 'short' })
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <MonthHeader month={month} today={today} title={monthName} />

      {result?.error ? (
        <EmptyPlate className="mt-8 min-h-[50svh]" title={t(`error.${result.error}.title`)} body={t(`error.${result.error}.body`)}>
          {(result.error === 'rate-limit' || result.error === 'network') && (
            <button type="button" className="control" onClick={retry}>
              {t('error.retry')}
            </button>
          )}
          <a href="https://apod.nasa.gov/apod/archivepix.html" target="_blank" rel="noopener noreferrer" className="control">
            {t('archive.official')}
          </a>
        </EmptyPlate>
      ) : (
        <>
          <div aria-hidden="true" className="mt-8 hidden grid-cols-7 border-l border-t border-line md:grid">
            {weekdays.map((w) => (
              <span key={w} className="notation border-b border-r border-line px-3 py-2 text-faint">
                {w}
              </span>
            ))}
          </div>
          <ol
            aria-busy={result === null}
            className="md:grid md:grid-cols-7 md:border-l md:border-line"
          >
            {days.map((day) => (
              <DayCell
                key={day}
                date={`${month}-${String(day).padStart(2, '0')}`}
                item={byDay.get(day)}
                status={day < firstDay || day > lastDay ? 'outside' : result === null ? 'loading' : byDay.has(day) ? 'ready' : 'missing'}
                isToday={`${month}-${String(day).padStart(2, '0')}` === today}
                offset={day === 1 ? firstWeekday(month) : 0}
              />
            ))}
          </ol>
          {result === null && (
            <p role="status" className="notation mt-6 text-faint">
              {t('archive.loading')}
            </p>
          )}
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
  const go = (m: string) => navigate(`/archive/${clamp(m)}`);

  return (
    <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
      <h1 className="font-serif text-[clamp(2.5rem,1.6rem+3vw,5rem)] font-normal leading-none tracking-[-0.02em] text-star first-letter:uppercase">
        <span className="sr-only">{t('archive.title')}: </span>
        {title}
      </h1>
      <nav aria-label={t('archive.title')} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="control w-12 shrink-0 px-0"
            disabled={month <= FIRST_MONTH}
            onClick={() => go(shiftMonth(month, -1))}
            aria-label={t('archive.prev')}
            title={t('archive.prev')}
          >
            <BiChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <SelectControl label={t('archive.month')} value={mm} onChange={(v) => go(`${year}-${v}`)} className="min-w-0 flex-1 sm:flex-none">
            {Array.from({ length: 12 }, (_, i) => {
              const value = String(i + 1).padStart(2, '0');
              return (
                <option key={value} value={value}>
                  {capitalize(formatApodDate(`2024-${value}-01`, locale, { month: 'long' }))}
                </option>
              );
            })}
          </SelectControl>
          <SelectControl label={t('archive.year')} value={year} onChange={(v) => go(`${v}-${mm}`)}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectControl>
          <button
            type="button"
            className="control w-12 shrink-0 px-0"
            disabled={month >= lastMonth}
            onClick={() => go(shiftMonth(month, 1))}
            aria-label={t('archive.next')}
            title={t('archive.next')}
          >
            <BiChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <a
          href="https://apod.nasa.gov/apod/archivepix.html"
          target="_blank"
          rel="noopener noreferrer"
          className="link notation inline-flex min-h-12 items-center gap-2 px-1 text-muted"
        >
          {t('archive.official')}
          <BiLinkExternal aria-hidden="true" className="h-4 w-4" />
        </a>
      </nav>
    </header>
  );
};

const SelectControl: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ label, value, onChange, children, className = '' }) => (
  <label className={`control relative pr-8 focus-within:border-star ${className}`}>
    <span className="sr-only">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-w-0 cursor-pointer appearance-none bg-transparent uppercase text-star focus-visible:outline-none"
    >
      {children}
    </select>
    <BiChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted" />
  </label>
);

interface DayCellProps {
  date: string;
  item?: ApodItem;
  status: 'outside' | 'loading' | 'ready' | 'missing';
  isToday: boolean;
  /** Monday-first column of the 1st, so the grid lines up with the weekday header. */
  offset: number;
}

const DayCell: React.FC<DayCellProps> = ({ date, item, status, isToday, offset }) => {
  const { t, locale } = useI18n();
  const to = `/apod/${date}`;
  const isTransitioning = useViewTransitionState(to);
  const day = Number(date.slice(8));
  const weekday = formatApodDate(date, locale, { weekday: 'short' });
  const style = offset ? ({ '--offset': offset + 1 } as React.CSSProperties) : undefined;
  const base = 'border-b border-line md:border-r md:[grid-column-start:var(--offset,auto)]';
  const thumb = item && thumbnailOf(item);
  const number = (
    <span className={`notation ${isToday ? 'text-red' : 'text-muted group-hover:text-star'}`}>
      {day}
      <span className="md:hidden">
        {' '}
        · {weekday}
        {item && !thumb && ` · ${t('day.other')}`}
      </span>
    </span>
  );

  if (status === 'outside') {
    return (
      <li aria-hidden="true" style={style} className={`${base} hidden min-h-40 p-3 md:block`}>
        <span className="notation text-faint">{day}</span>
      </li>
    );
  }
  if (status !== 'ready' || !item) {
    return (
      <li style={style} className={`${base} flex min-h-20 items-center gap-4 px-0 py-3 md:block md:min-h-40 md:p-3`}>
        <span className="notation text-faint">{day}</span>
        {status === 'missing' && <span className="notation text-faint md:mt-2 md:block">{t('archive.noPicture')}</span>}
        {status === 'loading' && <span aria-hidden="true" className="block aspect-square w-16 bg-ink-2 md:mt-3 md:w-full" />}
      </li>
    );
  }

  return (
    <li style={style} className={base}>
      <Link
        to={to}
        viewTransition
        className="group flex min-h-20 gap-4 py-3 focus-visible:outline-offset-[-2px] md:h-full md:flex-col md:gap-0 md:p-3"
      >
        <span className="relative block aspect-square w-20 shrink-0 overflow-hidden bg-ink-2 md:order-2 md:mt-3 md:w-full">
          {thumb && (
            <img
              src={optimizedImageUrl(thumb, THUMB_WIDTH)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={isTransitioning ? { viewTransitionName: 'plate' } : undefined}
            />
          )}
          {!thumb && (
            <span className="notation absolute inset-0 hidden items-center justify-center p-2 text-center text-faint md:flex">
              {t('day.other')}
            </span>
          )}
          {item.media_type === 'video' && (
            <span className="notation absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 bg-ink px-1.5 text-star">
              <BiPlay aria-hidden="true" className="h-3.5 w-3.5" />
              {t('day.video')}
            </span>
          )}
        </span>
        <span className="min-w-0 md:contents">
          <span className="md:order-1 md:block">{number}</span>
          <span lang="en" className="mt-1 line-clamp-2 font-serif text-base leading-snug text-copy group-hover:text-star md:order-3 md:mt-2 md:text-[0.9375rem]">
            {item.title}
          </span>
        </span>
      </Link>
    </li>
  );
};
