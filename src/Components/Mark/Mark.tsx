import React from 'react';

/** Finder reticle: the circle an atlas draws around the field of view. */
export const Mark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1" />
    <path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="12" r="1.75" fill="var(--red)" />
  </svg>
);
