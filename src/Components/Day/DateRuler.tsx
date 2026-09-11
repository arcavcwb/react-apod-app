import React, { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18n';
import { peekMonth } from '../../services/nasa.service';
import { formatApodDate, monthOf, monthRange } from '../../utils/date';

interface DateRulerProps {
  date: string;
  /** The day under the cursor while dragging; null once the drag settles. */
  onPreview: (date: string | null) => void;
  onCommit: (date: string) => void;
}

/**
 * The atlas scale: a native range input graduated by day across the month, with
 * numbered major ticks every five days. Dragging previews the day on the plate;
 * releasing travels there.
 */
export const DateRuler: React.FC<DateRulerProps> = ({ date, onPreview, onCommit }) => {
  const { t, locale } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const month = monthOf(date);
  const { start, end } = monthRange(month);
  const min = Number(start.slice(8));
  const max = Number(end.slice(8));
  const [preview, setPreview] = useState<number | null>(null);
  const value = preview ?? Number(date.slice(8));
  const toDate = (day: number) => `${month}-${String(day).padStart(2, '0')}`;
  const pos = (day: number) => (max === min ? 0 : ((day - min) / (max - min)) * 100);

  useEffect(() => setPreview(null), [date]);

  // React's onChange on a range fires while dragging; the native change event fires on release.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const commit = () => onCommit(`${month}-${input.value.padStart(2, '0')}`);
    input.addEventListener('change', commit);
    return () => input.removeEventListener('change', commit);
  }, [month, onCommit]);

  const scrubTo = (day: number) => {
    setPreview(day);
    onPreview(toDate(day));
  };

  // Numbered ticks: every fifth day plus both ends, dropping any that would crowd an end label.
  const majors = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((d) => d % 5 === 0 || d === min || d === max);
  const labels = majors.filter((d) => d === min || d === max || (d - min >= 2 && max - d >= 2));
  const previewTitle = preview !== null ? peekMonth(month)?.find((d) => d.date === toDate(value))?.title : undefined;

  return (
    <div className="relative min-w-0 flex-1 pt-6">
      <p
        aria-hidden="true"
        className="notation pointer-events-none absolute top-0 max-w-full truncate text-star"
        style={{ left: `${pos(value)}%`, transform: `translateX(-${pos(value)}%)` }}
      >
        {formatApodDate(toDate(value), locale, { day: 'numeric', month: 'short' })}
        {previewTitle && (
          <span lang="en" className="font-serif text-sm normal-case tracking-normal text-muted">
            {' '}
            {previewTitle}
          </span>
        )}
      </p>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {majors.map((d) => (
            <span key={d} className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-muted" style={{ left: `${pos(d)}%` }} />
          ))}
        </div>
        <input
          ref={inputRef}
          type="range"
          className="ruler relative block"
          min={min}
          max={max}
          step={1}
          value={value}
          disabled={min === max}
          onChange={(e) => scrubTo(Number(e.target.value))}
          // Releasing on another day navigates, which clears the preview; this covers leaving mid-drag.
          onBlur={() => {
            setPreview(null);
            onPreview(null);
          }}
          aria-label={t('day.ruler', { month: formatApodDate(date, locale, { month: 'long', year: 'numeric' }) })}
          aria-valuetext={formatApodDate(toDate(value), locale, { dateStyle: 'long' })}
          style={{ '--days': max - min + 1 } as React.CSSProperties}
        />
      </div>
      <div aria-hidden="true" className="relative h-5">
        {labels.map((d) => (
          <span
            key={d}
            className={`notation absolute text-faint transition-opacity ${Math.abs(d - value) < 2 ? 'opacity-0' : ''}`}
            style={{ left: `${pos(d)}%`, transform: `translateX(-${pos(d)}%)` }}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
};
