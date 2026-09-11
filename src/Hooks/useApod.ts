import { useEffect, useMemo, useState } from 'react';
import { ApodItem } from '../contracts/apod.contract';
import {
  ApodResult,
  fetchApodByDate,
  fetchApodMonth,
  fetchLatestApod,
  peekDay,
  peekLatest,
  peekMonth,
} from '../services/nasa.service';

/** `null` while loading. Cached data is returned on the first render, with no loading frame. */
function useResource<T>(key: string, peek: () => T | null, load: () => Promise<ApodResult<T>>) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<{ key: string; result: ApodResult<T> } | null>(null);
  // `peek` and `load` are fresh closures every render; `key` and `attempt` identify the request.
  const cached = useMemo(peek, [key, attempt]);

  useEffect(() => {
    if (cached) return;
    let live = true;
    load().then((result) => live && setLoaded({ key, result }));
    return () => {
      live = false;
    };
  }, [key, attempt]);

  const result: ApodResult<T> | null = cached
    ? { data: cached, error: null }
    : loaded?.key === key
      ? loaded.result
      : null;

  const retry = () => {
    setLoaded(null);
    setAttempt((n) => n + 1);
  };
  return { result, retry };
}

/** A specific day, or the latest published picture when `date` is undefined. */
export function useApodDay(date: string | undefined) {
  return useResource<ApodItem>(
    date ?? 'latest',
    () => (date ? peekDay(date) : peekLatest()),
    () => (date ? fetchApodByDate(date) : fetchLatestApod())
  );
}

/** A month; `partial` holds the weeks that have landed while the rest are still on the way. */
export function useApodMonth(month: string) {
  const [progress, setProgress] = useState<{ month: string; items: ApodItem[] } | null>(null);
  const { result, retry } = useResource<ApodItem[]>(
    month,
    () => peekMonth(month),
    () => fetchApodMonth(month, (items) => setProgress({ month, items }))
  );
  const partial = result === null && progress?.month === month ? progress.items : null;
  return { result, partial, retry };
}

/** Warms the month cache when the browser is idle, so day-to-day travel costs no requests. */
export function usePrefetchMonth(month: string | undefined) {
  useEffect(() => {
    if (!month || peekMonth(month)) return;
    const run = () => void fetchApodMonth(month);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 1500);
    return () => clearTimeout(id);
  }, [month]);
}
