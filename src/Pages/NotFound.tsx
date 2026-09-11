import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyPlate } from '../Components/Plate/Plate';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';

export const NotFound: React.FC = () => {
  const { t } = useI18n();
  useDocumentTitle(t('notFound.title'));
  return (
    <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10">
      <EmptyPlate className="min-h-[60svh]" title={t('notFound.title')} body={t('notFound.body')}>
        <Link to="/" className="control">
          {t('nav.today')}
        </Link>
        <Link to="/archive" className="control">
          {t('nav.archive')}
        </Link>
      </EmptyPlate>
    </div>
  );
};
