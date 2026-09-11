import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useI18n } from '../../i18n/I18n';

export const Layout: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="flex min-h-svh flex-col bg-ink">
      <a
        href="#main"
        className="notation sr-only z-50 bg-red px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t('skip')}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      {/* Keyed by path: after a reload every entry shares the "default" key and would inherit another page's scroll. */}
      <ScrollRestoration getKey={(location) => location.pathname} />
    </div>
  );
};
