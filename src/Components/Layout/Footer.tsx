import React from 'react';
import { useI18n } from '../../i18n/I18n';

const REPO_URL = 'https://github.com/arcavcwb/react-apod-app';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-2 px-4 py-8 text-sm text-faint sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
        <p>{t('footer.disclaimer')}</p>
        <a href={REPO_URL} className="link notation inline-flex min-h-12 items-center text-muted" rel="noopener noreferrer" target="_blank">
          {t('footer.source')}
        </a>
      </div>
    </footer>
  );
};
