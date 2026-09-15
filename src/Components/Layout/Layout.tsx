import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration, useMatch } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SpaceBackground } from './SpaceBackground';
import { useI18n } from '../../i18n/I18n';

type WithActiveTransition = Document & { activeViewTransition?: { skipTransition(): void } | null };

/**
 * While a view transition animates, the browser hit-tests nothing but the root element, so a click on a
 * tile or a link would be lost and the page would feel stuck. Such a click finishes the transition at
 * once and goes to whatever is under the pointer, which starts its own transition.
 */
function useClicksThroughTransitions() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const transition = (document as WithActiveTransition).activeViewTransition;
      if (!transition || e.target !== document.documentElement) return;
      transition.skipTransition();
      requestAnimationFrame(() => {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        target?.closest<HTMLElement>('a[href], button:not(:disabled)')?.click();
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}

/**
 * The home is one screen everywhere. The day and about pages are one screen on desktop and scroll
 * down on phones. The gallery reads down everywhere: its slide of pictures fits the screen, and the
 * ways to other months follow below.
 */
export const Layout: React.FC = () => {
  const { t } = useI18n();
  const home = useMatch('/') !== null;
  useClicksThroughTransitions();
  const gallery = useMatch('/gallery/*') !== null;
  return (
    <div className={`relative isolate flex flex-col ${home ? 'stage' : gallery ? 'min-h-svh' : 'stage-lg'}`}>
      <SpaceBackground />
      <a href="#main" className="sr-only z-50 bg-accent px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t('skip')}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col focus:outline-none">
        <Outlet />
      </main>
      <Footer className={home ? '' : gallery ? 'mt-16' : 'mt-16 lg:mt-0'} />
      {/* Keyed by path: after a reload every entry shares the "default" key and would inherit another page's scroll. */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
};
