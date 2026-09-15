import React from 'react';
import { Explanation } from '../../Hooks/useExplanation';
import { useI18n } from '../../i18n/I18n';

const LINES = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-2/3'];

/**
 * NASA's explanation as the reader gets it: translated for Spanish and Portuguese readers and always saying
 * so, with the original a tap away. While a first translation is on its way, the lines hold its place.
 */
export const ExplanationText: React.FC<{ explanation: Explanation }> = ({ explanation: e }) => {
  const { t } = useI18n();

  if (e.status === 'waiting') {
    return (
      <div className="max-w-[66ch]">
        <span role="status" className="sr-only">
          {t('translate.loading')}
        </span>
        <div aria-hidden="true" className="space-y-3 pt-1.5">
          {LINES.map((width, i) => (
            <div key={i} className={`skeleton h-4 rounded-full ${width}`} />
          ))}
        </div>
      </div>
    );
  }

  const note =
    e.status === 'translating'
      ? t('translate.loading')
      : e.status === 'translated' && !e.showingOriginal
        ? t('translate.auto')
        : t('day.originalLanguage');

  return (
    <>
      <p key={e.lang} lang={e.lang} className="max-w-[66ch] animate-[develop_500ms_ease-out_both] leading-[1.75] text-fg">
        {e.text}
      </p>
      {(note || e.canToggle) && (
        <p aria-live="polite" className="mt-3 flex flex-wrap items-center gap-x-2 text-small text-faint">
          {note && <span>{note}</span>}
          {e.canToggle && (
            <button type="button" onClick={e.toggle} className="link inline-flex min-h-12 items-center rounded-full px-1 text-muted hover:text-fg">
              {t(e.showingOriginal ? 'translate.showTranslation' : 'translate.showOriginal')}
            </button>
          )}
        </p>
      )}
    </>
  );
};
