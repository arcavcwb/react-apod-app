import React, { useEffect, useRef, useState } from 'react';
import { BiCheck, BiEnvelope, BiLink, BiShareAlt } from 'react-icons/bi';
import { SiLinkedin, SiTelegram, SiWhatsapp, SiX } from 'react-icons/si';
import { useI18n } from '../../i18n/I18n';

interface ShareButtonProps {
  title: string;
  /** Localized date shown in the share text. */
  dateLabel: string;
  url: string;
  /** The screen's one primary action gets the blue field. */
  primary?: boolean;
  className?: string;
  /** Where the fallback menu opens, as position classes. */
  menuClassName?: string;
  /** Classes for the button itself, e.g. its galactic colour as a phone circle. */
  buttonClassName?: string;
}

/** Native share sheet where it exists (phones); otherwise copy link first, then plain share links. */
export const ShareButton: React.FC<ShareButtonProps> = ({ title, dateLabel, url, primary = false, className = '', menuClassName = 'left-0 top-full mt-2', buttonClassName = '' }) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const text = t('share.text', { title, date: dateLabel });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    rootRef.current?.querySelector<HTMLElement>('[data-first]')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as DOMException).name === 'AbortError') return;
      }
    }
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked: the links below still work.
    }
  };

  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(text);
  const links = [
    // The link on its own line, so WhatsApp builds its preview card from it.
    { label: 'WhatsApp', href: `https://wa.me/?text=${txt}%0A${u}`, Icon: SiWhatsapp },
    { label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${txt}`, Icon: SiTelegram },
    { label: 'X', href: `https://x.com/intent/post?text=${txt}&url=${u}`, Icon: SiX },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: SiLinkedin },
    { label: t('share.email'), href: `mailto:?subject=${encodeURIComponent(title)}&body=${txt}%0A${u}`, Icon: BiEnvelope },
  ];
  const row = 'flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-fg transition-colors hover:bg-white/[0.06]';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`btn btn-action w-full ${primary ? 'btn-primary' : 'btn-ghost'} ${buttonClassName}`}
        aria-expanded={open}
        onClick={share}
      >
        <span className="action-icon">
          <BiShareAlt aria-hidden="true" className="h-5 w-5" />
        </span>
        {t('day.share')}
      </button>
      {open && (
        <div
          role="group"
          aria-label={t('share.menu')}
          // On phones the fallback menu becomes a sheet along the bottom of the screen (.share-menu in index.css).
          className={`share-menu surface-float absolute z-30 w-64 animate-[menu-in_200ms_cubic-bezier(0.16,1,0.3,1)] rounded-2xl bg-panel p-1.5 ${menuClassName}`}
        >
          <button type="button" data-first onClick={copy} className={row}>
            {copied ? (
              <BiCheck aria-hidden="true" className="h-5 w-5 animate-[menu-in_200ms_cubic-bezier(0.16,1,0.3,1)] text-accent" />
            ) : (
              <BiLink aria-hidden="true" className="h-5 w-5 text-muted" />
            )}
            <span aria-live="polite">{copied ? t('share.copied') : t('share.copy')}</span>
          </button>
          {links.map(({ label, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={row}>
              <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center">
                <Icon className="h-4 w-4 text-muted" />
              </span>
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
