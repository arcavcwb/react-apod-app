import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BiCheck, BiGridAlt, BiSun } from 'react-icons/bi';
import { Flag } from '../Flag/Flag';
import { Mark } from '../Mark/Mark';
import { useI18n } from '../../i18n/I18n';
import { LOCALES, LOCALE_NAMES, Locale } from '../../i18n/messages';

// Segmented controls: a sunken track, the current item raised out of it.
const TRACK = 'flex items-center rounded-full bg-black/20 p-1 shadow-[inset_0_1px_3px_rgb(0_0_0/0.45),0_0_0_1px_rgb(232_236_242/0.08)]';
const RAISED =
  'bg-[linear-gradient(180deg,rgb(232_236_242/0.18),rgb(232_236_242/0.07))] text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_0_0_1px_rgb(232_236_242/0.13),0_4px_12px_-6px_rgb(0_0_0/0.8)]';

// The current section is raised and underlined in aurora. 40px to see, 48px to touch (the pseudo-element widens the target).
const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex min-h-10 items-center gap-1.5 rounded-full px-3 transition-[color,background-color,box-shadow] duration-200 before:absolute before:-inset-1 before:rounded-full sm:px-3.5 lg:px-4 ${
    isActive
      ? `${RAISED} after:absolute after:bottom-0.5 after:left-1/2 after:h-[3px] after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-[linear-gradient(90deg,var(--accent),var(--nebula),var(--aurora))]`
      : 'text-muted hover:text-fg'
  }`;

// The current section's pill carries a transition name, so it slides from one item to the other.
const navStyle = ({ isActive }: { isActive: boolean }) => (isActive ? { viewTransitionName: 'nav-pill' } : undefined);

/** Phones: the header slides away while you scroll down a page and comes back as soon as you scroll up. */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) < 8) return;
        setHidden(y > last && y > 96);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return hidden;
}

export const Header: React.FC = () => {
  const { t } = useI18n();
  const hidden = useHideOnScroll();

  return (
    <header
      className={`sticky top-0 z-30 shrink-0 px-3 pt-3 transition-transform duration-300 ease-out-expo focus-within:translate-y-0 sm:px-6 lg:relative lg:px-10 lg:pt-4 xl:px-14 ${
        hidden ? '-translate-y-[calc(100%+0.75rem)]' : ''
      }`}
    >
      {/* A pill floating over the sky, as wide as the page's content. */}
      <div className="surface-float relative mx-auto flex h-[var(--header-h)] max-w-[83rem] items-center justify-between gap-2 rounded-full px-1 after:pointer-events-none after:absolute after:inset-x-[14%] after:-bottom-px after:h-px after:bg-[linear-gradient(90deg,transparent,rgb(65_108_230/0.65),rgb(124_92_240/0.65),rgb(55_198_232/0.55),transparent)] sm:px-1.5">
        <Link to="/" className="flex min-h-12 items-center gap-3 rounded-full px-2.5 text-fg sm:px-3" aria-label={`${t('brand.name')}, ${t('nav.today')}`}>
          <Mark className="h-6 w-6" />
          <span aria-hidden="true" className="hidden text-small font-semibold uppercase tracking-[0.16em] sm:inline">
            {t('brand.name')}
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <nav aria-label={t('nav.label')}>
            <ul className={TRACK}>
              <li>
                <NavLink to="/" end viewTransition className={navClass} style={navStyle}>
                  <BiSun aria-hidden="true" className="h-[1.125rem] w-[1.125rem] shrink-0" />
                  {t('nav.today')}
                </NavLink>
              </li>
              <li>
                <NavLink to="/gallery" viewTransition className={navClass} style={navStyle}>
                  <BiGridAlt aria-hidden="true" className="h-[1.125rem] w-[1.125rem] shrink-0" />
                  {t('nav.gallery')}
                </NavLink>
              </li>
            </ul>
          </nav>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};

const LanguageSwitch: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  return (
    <>
      {/* Wide screens show every language as a segmented control, each with its flag; phones open a menu. */}
      <div role="group" aria-label={t('lang.label')} className={`hidden md:flex ${TRACK}`}>
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={locale === l}
            title={LOCALE_NAMES[l].name}
            onClick={() => setLocale(l)}
            // 40px to see, 48px to touch: the pseudo-element widens the target.
            className={`group relative flex min-h-10 min-w-10 items-center gap-2 rounded-full px-2.5 text-small font-medium tracking-[0.08em] transition-[color,background-color,box-shadow] duration-200 before:absolute before:-inset-1 before:rounded-full ${
              locale === l ? RAISED : 'text-faint hover:text-fg'
            }`}
          >
            <Flag locale={l} current={locale === l} className="h-4 w-4" />
            <span aria-hidden="true">{LOCALE_NAMES[l].short}</span>
            <span className="sr-only">{LOCALE_NAMES[l].name}</span>
          </button>
        ))}
      </div>
      <LanguageMenu />
    </>
  );
};

/**
 * Phones: the current language's flag and code open a menu of the three languages, each with its flag and
 * named in itself, the current one ringed in aurora and checked. Arrow keys move, Escape or a tap outside
 * closes, and focus goes back to the button.
 */
const LanguageMenu: React.FC = () => {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    options.current[LOCALES.indexOf(locale)]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const at = options.current.indexOf(document.activeElement as HTMLButtonElement);
        const step = e.key === 'ArrowDown' ? 1 : -1;
        options.current[(at + step + LOCALES.length) % LOCALES.length]?.focus();
      } else if (e.key === 'Tab') {
        setOpen(false);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open, locale]);

  const choose = (l: Locale) => {
    setLocale(l);
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div ref={root} className="relative md:hidden">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${t('lang.label')}: ${LOCALE_NAMES[locale].name}`}
        onClick={() => setOpen((o) => !o)}
        className={`btn btn-ghost min-h-12 gap-2 px-3 text-small font-semibold tracking-[0.08em] ${open ? 'text-fg' : ''}`}
      >
        <Flag locale={locale} current className="h-5 w-5" />
        <span aria-hidden="true">{LOCALE_NAMES[locale].short}</span>
      </button>

      {open && (
        <div id="language-menu" className="lang-menu surface-float absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl bg-panel p-1.5">
          <p id="language-menu-title" className="px-3 pb-1 pt-2 text-small text-faint">
            {t('lang.label')}
          </p>
          <div role="menu" aria-labelledby="language-menu-title">
            {LOCALES.map((l, i) => {
              const current = l === locale;
              return (
                <button
                  key={l}
                  ref={(el) => {
                    options.current[i] = el;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={current}
                  lang={l}
                  onClick={() => choose(l)}
                  className={`group flex min-h-12 w-full items-center gap-3 rounded-xl px-2.5 text-left transition-colors ${
                    current ? 'bg-white/[0.07] text-fg' : 'text-muted hover:bg-white/[0.05] hover:text-fg focus-visible:text-fg'
                  }`}
                >
                  <Flag locale={l} current={current} className="h-8 w-8" />
                  <span className="min-w-0 flex-1 truncate">{LOCALE_NAMES[l].name}</span>
                  {current && <BiCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--aurora)]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
