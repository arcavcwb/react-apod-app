import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { useI18n } from '../../i18n/I18n';

const behavior = (): ScrollBehavior =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

interface PagerProps {
  /** Names the scrolling region for screen readers. */
  label: string;
  children: React.ReactNode;
  /** A new value returns to the first page: another day, another month. */
  resetKey?: string;
  className?: string;
  /** Classes for the scrolling track, e.g. negative margins so pages bleed to the screen edge. */
  trackClassName?: string;
  /** The ends of the bar under the pages; previous and next page buttons by default. */
  start?: React.ReactNode;
  end?: React.ReactNode;
}

/**
 * Nothing scrolls down: whatever does not fit one screen is laid out in pages that move sideways.
 * Swipe, trackpad, the mouse wheel (turned sideways, a page per gesture), arrow keys on the focused
 * track or the buttons turn a page; the dots say where you are.
 */
export const Pager: React.FC<PagerProps> = ({ label, children, resetKey, className = '', trackClassName = '', start, end }) => {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el || !el.clientWidth) return;
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  // Pages change with the viewport and with their content (text measured into columns, a month landing).
  useEffect(() => {
    const el = track.current;
    measure();
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  });

  useEffect(() => {
    track.current?.scrollTo?.({ left: 0 });
    setPage(0);
  }, [resetKey]);

  // A vertical wheel has nothing to scroll here, so it turns the page: once per gesture, however long the momentum.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let last = -Infinity;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      const fresh = e.timeStamp - last > 250;
      last = e.timeStamp;
      if (fresh) el.scrollBy({ left: Math.sign(e.deltaY) * el.clientWidth, behavior: behavior() });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const turn = (direction: 1 | -1) => {
    const el = track.current;
    el?.scrollBy?.({ left: direction * el.clientWidth, behavior: behavior() });
  };
  const pageButton = (direction: 1 | -1) => {
    const label = t(direction < 0 ? 'pager.prev' : 'pager.next');
    const Icon = direction < 0 ? BiChevronLeft : BiChevronRight;
    return (
      <button
        type="button"
        className="btn btn-cosmic btn-icon"
        disabled={direction < 0 ? page <= 0 : page >= pages - 1}
        onClick={() => turn(direction)}
        aria-label={label}
        title={label}
      >
        <Icon aria-hidden="true" className={`h-5 w-5 ${direction < 0 ? 'lean-left' : 'lean-right'}`} />
      </button>
    );
  };
  const hasBar = pages > 1 || start !== undefined || end !== undefined;

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-pager=""
        onScroll={measure}
        className={`pager flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain focus-visible:outline-offset-[-2px] ${trackClassName}`}
      >
        {children}
      </div>
      {hasBar && (
        <div className="flex min-h-12 shrink-0 items-center justify-between gap-3 pt-2">
          {start ?? pageButton(-1)}
          {pages > 1 && (
            <>
              <div aria-hidden="true" className="flex items-center gap-1.5">
                {pages <= 12 ? (
                  Array.from({ length: pages }, (_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out-expo ${
                        i === page ? 'w-6 bg-[linear-gradient(90deg,var(--accent),var(--nebula),var(--aurora))]' : 'w-1.5 bg-edge'
                      }`}
                    />
                  ))
                ) : (
                  <span className="text-small tabular-nums text-muted">
                    {page + 1} / {pages}
                  </span>
                )}
              </div>
              <p className="sr-only" aria-live="polite">
                {t('pager.status', { page: String(page + 1), pages: String(pages) })}
              </p>
            </>
          )}
          {end ?? pageButton(1)}
        </div>
      )}
    </div>
  );
};

/** One page of a Pager, the track's full width unless its classes say otherwise (e.g. a third on desktop). */
export const PagerPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`h-full w-full shrink-0 snap-start snap-always ${className}`}>{children}</div>
);
