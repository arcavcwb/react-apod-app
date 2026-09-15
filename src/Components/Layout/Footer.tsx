import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18n';

const REPO_URL = 'https://github.com/arcavcwb/react-apod-app';
const LINK = 'link inline-flex min-h-12 items-center rounded-full px-2 text-muted hover:text-fg';

/** One line; phones get the short disclaimer. */
export const Footer: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useI18n();
  return (
    <footer className={`shrink-0 ${className}`}>
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-14">
        <p className="min-w-0 truncate text-small text-faint">
          <span className="md:hidden">{t('footer.short')}</span>
          <span className="hidden md:inline">{t('footer.disclaimer')}</span>
        </p>
        <ul className="-mx-2 flex shrink-0 text-small">
          <li>
            <Link to="/about" className={LINK}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <a href={REPO_URL} className={LINK} rel="noopener noreferrer" target="_blank">
              {t('footer.source')}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
