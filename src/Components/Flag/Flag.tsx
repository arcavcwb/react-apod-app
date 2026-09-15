import React from 'react';
import { Locale } from '../../i18n/messages';

// Flags drawn as SVG (the interface uses no emoji), composed for a round crop of a 64 x 64 square.
const US_STARS = [
  [5, 6], [12, 6], [19, 6], [26, 6],
  [8.5, 13], [15.5, 13], [22.5, 13],
  [5, 20], [12, 20], [19, 20], [26, 20],
  [8.5, 27], [15.5, 27], [22.5, 27],
];

const FLAGS: Record<Locale, React.ReactNode> = {
  // Spain: red, a yellow band twice as tall, red; the arms reduced to their shield.
  es: (
    <>
      <rect width="64" height="64" fill="#c60b1e" />
      <rect y="16" width="64" height="32" fill="#ffc400" />
      <rect x="14" y="25" width="9" height="13" rx="2.5" fill="#ad1519" />
    </>
  ),
  // The United States, NASA's home: thirteen stripes and a starred canton.
  en: (
    <>
      <rect width="64" height="64" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={(i * 128) / 13} width="64" height={64 / 13} fill="#b22234" />
      ))}
      <rect width="32" height={(64 * 7) / 13} fill="#3c3b6e" />
      {US_STARS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="#fff" />
      ))}
    </>
  ),
  // Brazil: the green field, the yellow rhombus, the blue globe and its white band.
  'pt-BR': (
    <>
      <rect width="64" height="64" fill="#009c3b" />
      <polygon points="32,8 60,32 32,56 4,32" fill="#ffdf00" />
      <circle cx="32" cy="32" r="13" fill="#002776" />
      <path d="M19.3 29.2c8.3-1.9 17.4-.4 25 4.5" fill="none" stroke="#fff" strokeWidth="2.6" />
    </>
  ),
};

/**
 * A language's round flag under a little starlight (a sheen and a fine rim, see .flag in index.css).
 * The current language is ringed in aurora; the others rest slightly dimmed.
 */
export const Flag: React.FC<{ locale: Locale; current?: boolean; className?: string }> = ({ locale, current = false, className = '' }) => (
  <span aria-hidden="true" className={`flag ${current ? 'flag-current' : 'flag-dim'} ${className}`}>
    <svg viewBox="0 0 64 64" focusable="false">
      {FLAGS[locale]}
    </svg>
  </span>
);
