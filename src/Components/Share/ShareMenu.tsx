import React, { useEffect, useRef, useState } from 'react';
import { BiCheck, BiEnvelope, BiLink, BiShareAlt } from 'react-icons/bi';
import { SiLinkedin, SiTelegram, SiWhatsapp, SiX } from 'react-icons/si';
import { useI18n } from '../../i18n/I18n';

interface ShareMenuProps {
  title: string;
  /** Localized date shown in the share text. */
  dateLabel: string;
  url: string;
}

/** Native share sheet where it exists (phones); otherwise a small menu of plain share links. */
export const ShareMenu: React.FC<ShareMenuProps> = ({ title, dateLabel, url }) => {
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
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the links below still work.
    }
  };

  const u = encodeURIComponent(url);
  const txt = encodeURIComponent(text);
  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${txt}%20${u}`, Icon: SiWhatsapp },
    { label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${txt}`, Icon: SiTelegram },
    { label: 'X', href: `https://x.com/intent/post?text=${txt}&url=${u}`, Icon: SiX },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: SiLinkedin },
    { label: t('share.email'), href: `mailto:?subject=${encodeURIComponent(title)}&body=${txt}%0A${u}`, Icon: BiEnvelope },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button ref={buttonRef} type="button" className="control w-full" aria-expanded={open} onClick={share}>
        <BiShareAlt aria-hidden="true" className="h-4 w-4" />
        {t('day.share')}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-64 border border-line-strong bg-ink-2 py-1 shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
          <button type="button" data-first onClick={copy} className="notation flex min-h-12 w-full items-center gap-3 px-4 text-star hover:bg-ink">
            {copied ? <BiCheck aria-hidden="true" className="h-4 w-4 text-red" /> : <BiLink aria-hidden="true" className="h-4 w-4 text-muted" />}
            <span aria-live="polite">{copied ? t('share.copied') : t('share.copy')}</span>
          </button>
          {links.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="notation flex min-h-12 items-center gap-3 px-4 text-star hover:bg-ink"
            >
              <Icon aria-hidden="true" className="h-4 w-4 text-muted" />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
