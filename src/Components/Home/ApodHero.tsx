import React from 'react';
import { Link } from 'react-router-dom';
import { BiRightArrowAlt } from 'react-icons/bi';
import { ApodItem } from '../../contracts/apod.contract';
import { useDocumentTitle } from '../../Hooks/useDocumentTitle';
import { useMediaQuery } from '../../Hooks/useMediaQuery';
import { useI18n } from '../../i18n/I18n';
import { ApodResult } from '../../services/nasa.service';
import { formatApodDate } from '../../utils/date';
import { Notice } from '../Notice/Notice';
import { PhotoFrame } from '../Photo/PhotoFrame';
import { ShareButton } from '../Share/ShareButton';

interface ApodHeroProps {
  result: ApodResult<ApodItem> | null;
  retry: () => void;
  /** What sits under the words: the days just before today. */
  children?: React.ReactNode;
}

/**
 * Today on one screen, no scrolling. Desktop: the photograph floats in its own light across
 * columns 6-12 and both rows; title, date, a few lines and the two actions in columns 1-5,
 * with the earlier days docked below them. Phones: the photograph takes whatever height is left.
 */
export const ApodHero: React.FC<ApodHeroProps> = ({ result, retry, children }) => {
  const { t } = useI18n();
  const item = result?.data ?? null;
  const wide = useMediaQuery('(min-width: 1024px)');
  useDocumentTitle(item?.title ?? t('title.today'));
  const span = result?.error ? 'lg:col-span-7' : 'lg:col-span-5';

  return (
    <section className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 flex-col gap-4 px-3 pb-1 pt-4 sm:gap-6 sm:px-6 lg:grid lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)_auto] lg:gap-x-12 lg:gap-y-8 lg:px-10 xl:gap-x-16 xl:px-14 lg:pb-2 lg:pt-6">
      {/* Below desktop the title comes first, above the photograph. */}
      {!wide && !result?.error && (
        <div className="shrink-0 px-1">{item ? <Caption item={item} part="title" /> : result === null && <TitleSkeleton />}</div>
      )}

      {!result?.error && (
        <div className="relative min-h-[9rem] flex-1 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:min-h-0">
          <PhotoFrame item={item} sizes="(min-width: 1024px) 55vw, 100vw" className="hero-photo" />
        </div>
      )}

      <div className={`shrink-0 px-1 lg:col-start-1 lg:row-start-1 lg:self-center lg:px-0 ${span}`}>
        {result === null && wide && <CaptionSkeleton />}
        {item && <Caption item={item} part={wide ? 'all' : 'body'} />}
        {result?.error && (
          <Notice level={1} alert title={t(`error.${result.error}.title`)} body={t(`error.${result.error}.body`)} className="pt-4 lg:pt-0">
            {(result.error === 'rate-limit' || result.error === 'network') && (
              <button type="button" className="btn btn-primary" onClick={retry}>
                {t('error.retry')}
              </button>
            )}
            <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {t('error.official')}
            </a>
          </Notice>
        )}
      </div>

      {children && <div className="mt-auto shrink-0 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:mt-0">{children}</div>}
    </section>
  );
};

/** Title and date, then a few lines and the actions. Below desktop the title part renders above the photograph. */
const Caption: React.FC<{ item: ApodItem; part?: 'all' | 'title' | 'body' }> = ({ item, part = 'all' }) => {
  const { t, locale } = useI18n();
  const longDate = formatApodDate(item.date, locale, { dateStyle: 'long' });

  const title = (
      /* Shares its name with the day's title, so "Ver detalles" carries the title across. */
      <div style={{ viewTransitionName: 'day-title' }}>
        <h1 lang="en" className="line-clamp-3 text-display font-light text-fg">
          {item.title}
        </h1>
        <p className="mt-2 text-small text-muted lg:mt-4">
          <time dateTime={item.date}>
            <span className="sm:hidden">{formatApodDate(item.date, locale, { dateStyle: 'medium' })}</span>
            <span className="hidden sm:inline">{longDate}</span>
          </time>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {t('day.apod')}
        </p>
      </div>
  );
  if (part === 'title') return title;

  return (
    <>
      {part === 'all' && title}
      {item.explanation && (
        <p lang="en" className={`stage-excerpt line-clamp-2 text-muted lg:mt-5 lg:line-clamp-3 ${part === 'all' ? 'mt-3' : ''}`}>
          {item.explanation}
        </p>
      )}
      {/* Phones: circles with a short caption; wider screens: pills. */}
      <div className="mt-5 flex items-start gap-6 sm:mt-4 sm:gap-3 lg:mt-8">
        <Link
          to={`/apod/${item.date}`}
          viewTransition
          aria-label={t('day.details')}
          className="btn btn-primary btn-action btn-action-trail galaxy-details"
        >
          <span className="action-icon">
            <BiRightArrowAlt aria-hidden="true" className="lean-right h-5 w-5" />
          </span>
          <span className="sm:hidden">{t('action.details')}</span>
          <span className="hidden sm:inline">{t('day.details')}</span>
        </Link>
        <ShareButton
          buttonClassName="galaxy-share"
          title={item.title}
          url={`${window.location.origin}/apod/${item.date}`}
          dateLabel={longDate}
          // Low on a phone's screen the menu opens upwards, aligned to the button's right edge.
          menuClassName="bottom-full right-0 mb-2 sm:left-0 sm:right-auto lg:bottom-auto lg:top-full lg:mb-0 lg:mt-2"
        />
      </div>
    </>
  );
};

/** Below desktop, where the title sits above the photograph while today is on its way. */
const TitleSkeleton: React.FC = () => {
  const { t } = useI18n();
  return (
    <div>
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

const CaptionSkeleton: React.FC = () => {
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
        <div className="mt-6 flex gap-3 lg:mt-8">
          <div className="skeleton h-12 w-36 rounded-full" />
          <div className="skeleton h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};
