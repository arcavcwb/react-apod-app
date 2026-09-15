import React from 'react';

/** A body and its orbit, with the one orbital-blue point. */
export const Mark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none">
    <ellipse cx="12" cy="12" rx="10.5" ry="4.75" transform="rotate(-24 12 12)" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.25" />
    <circle cx="12" cy="12" r="3.75" fill="currentColor" />
    <circle cx="21.6" cy="7.7" r="1.9" fill="var(--accent)" />
  </svg>
);
