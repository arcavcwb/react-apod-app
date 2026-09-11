import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BiChevronDown } from 'react-icons/bi';
import { Mark } from '../Mark/Mark';
import { useI18n } from '../../i18n/I18n';
import { LOCALES, LOCALE_NAMES, Locale } from '../../i18n/messages';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `notation relative flex min-h-12 items-center justify-center whitespace-nowrap px-1 transition-colors md:px-4 ${
    isActive
      ? 'text-star after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-red md:after:inset-x-4'
      : 'text-muted hover:text-star'
  }`;

export const Header: React.FC = () => {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex min-h-14 items-center gap-3 text-star" aria-label={`${t('brand.name')}, ${t('nav.today')}`}>
          <Mark className="h-6 w-6" />
          <span className="notation">{t('brand.name')}</span>
        </Link>

        <nav aria-label={t('nav.label')} className="order-last -mx-3 w-[calc(100%+1.5rem)] md:order-none md:mx-0 md:w-auto">
          <ul className="grid grid-cols-3 md:flex">
            <li>
              <NavLink to="/" end className={navClass}>
                {t('nav.today')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/archive" className={navClass}>
                {t('nav.archive')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navClass}>
                {t('nav.about')}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Wide screens show every language; phones get a native select with a short face. */}
        <div role="group" aria-label={t('lang.label')} className="hidden md:flex">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              lang={l}
              aria-pressed={locale === l}
              title={LOCALE_NAMES[l].name}
              onClick={() => setLocale(l)}
              className={`notation relative min-h-12 min-w-12 px-2 transition-colors ${
                locale === l
                  ? 'text-star after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-red'
                  : 'text-muted hover:text-star'
              }`}
            >
              <span aria-hidden="true">{LOCALE_NAMES[l].short}</span>
              <span className="sr-only">{LOCALE_NAMES[l].name}</span>
            </button>
          ))}
        </div>
        {/* The native select stays on top (transparent) for keyboard, touch and screen readers. */}
        <label className="relative flex min-h-12 min-w-12 items-center gap-1 pl-3 text-star focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-red md:hidden">
          <span className="sr-only">{t('lang.label')}</span>
          <span aria-hidden="true" className="notation">
            {LOCALE_NAMES[locale].short}
          </span>
          <BiChevronDown aria-hidden="true" className="h-4 w-4 text-muted" />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="absolute inset-0 cursor-pointer appearance-none opacity-0 focus-visible:outline-none"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l} lang={l}>
                {LOCALE_NAMES[l].name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
};
