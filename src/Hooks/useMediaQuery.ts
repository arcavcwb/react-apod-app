import { useEffect, useState } from 'react';

const query = (q: string) => (typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(q) : null);

/** Whether a media query matches, kept in sync with the viewport; false where matchMedia does not exist (tests). */
export function useMediaQuery(q: string): boolean {
  const [matches, setMatches] = useState(() => query(q)?.matches ?? false);

  useEffect(() => {
    const mql = query(q);
    if (!mql) return;
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [q]);

  return matches;
}
