import React from 'react';

interface NoticeProps {
  title: string;
  body: string;
  /** The page's own heading (1) or a section inside a page (2). */
  level?: 1 | 2;
  /** Announce it: for failures that happen after the page has loaded. */
  alert?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** Errors, missing days and wrong addresses: said plainly, flush-left, with the way out right below. */
export const Notice: React.FC<NoticeProps> = ({ title, body, level = 2, alert = false, className = '', children }) => {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div role={alert ? 'alert' : undefined} className={className}>
      <Heading className="max-w-2xl text-display font-light text-fg">{title}</Heading>
      <p className="mt-4 max-w-md text-muted">{body}</p>
      {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
    </div>
  );
};
