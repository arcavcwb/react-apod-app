import React from 'react';
import { Link } from 'react-router-dom';
import { Notice } from '../Components/Notice/Notice';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';

export const NotFound: React.FC = () => {
  const { t } = useI18n();
  useDocumentTitle(t('notFound.title'));
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10 lg:pt-16">
      <Notice level={1} title={t('notFound.title')} body={t('notFound.body')}>
        <Link to="/" className="btn btn-primary">
          {t('nav.today')}
        </Link>
        <Link to="/gallery" className="btn btn-ghost">
          {t('nav.gallery')}
        </Link>
      </Notice>
    </div>
  );
};
