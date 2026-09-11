import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18n';
import { peekMonth } from '../../services/nasa.service';
import { formatApodDate, monthOf, monthRange } from '../../utils/date';

interface DateRulerProps {
  date: string;
  onCommit: (date: string) => void;
}

/**
 * The atlas scale: a native range input graduated by day across the month.
 * Dragging previews the day (and its title once the month is cached); releasing travels there.
 */
export const DateRuler: React.FC<DateRulerProps> = ({ date, onCommit }) => {
  const { t, locale } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const month = monthOf(date);
  const { start, end } = monthRange(month);
  const min = Number(start.slice(8));
  const max = Number(end.slice(8));
  const [preview, setPreview] = useState<number | null>(null);
  const value = preview ?? Number(date.slice(8));
  const toDate = (day: number) => `${month}-${String(day).padStart(2, '0')}`;

  useEffect(() => setPreview(null), [date]);

  // React's onChange on a range fires while dragging; the native change event fires on release.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const commit = () => onCommit(`${month}-${input.value.padStart(2, '0')}`);
    input.addEventListener('change', commit);
    return () => input.removeEventListener('change', commit);
  }, [month, onCommit]);

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const previewTitle = preview !== null ? peekMonth(month)?.find((d) => d.date === toDate(value))?.title : undefined;
  const short = (day: number) => formatApodDate(toDate(day), locale, { day: 'numeric', month: 'short' });

  return (
    <div className="relative min-w-0 flex-1 pt-6">
      <p
        aria-hidden="true"
        className="notation pointer-events-none absolute top-0 max-w-full truncate text-star"
        style={{ left: `${pct}%`, transform: `translateX(-${pct}%)` }}
      >
        {short(value)}
        {previewTitle && (
          <span lang="en" className="font-serif text-sm normal-case tracking-normal text-muted">
            {' '}
            {previewTitle}
          </span>
        )}
      </p>
      <input
        ref={inputRef}
        type="range"
        className="ruler block"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={min === max}
        onChange={(e) => setPreview(Number(e.target.value))}
        aria-label={t('day.ruler', { month: formatApodDate(date, locale, { month: 'long', year: 'numeric' }) })}
        aria-valuetext={formatApodDate(toDate(value), locale, { dateStyle: 'long' })}
        style={{ '--days': max - min + 1 } as React.CSSProperties}
      />
      {/* End labels step aside when the cursor label sits on them. */}
      <div aria-hidden="true" className="notation flex justify-between text-faint">
        <span className={pct < 18 ? 'invisible' : ''}>{short(min)}</span>
        <span className={pct > 82 ? 'invisible' : ''}>{short(max)}</span>
      </div>
    </div>
  );
};
