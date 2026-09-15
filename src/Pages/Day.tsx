import React from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { DayView } from '../Components/Day/DayView';
import { Notice } from '../Components/Notice/Notice';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';
import { isValidApodDate } from '../utils/date';

export const Day: React.FC = () => {
  const { date } = useParams();
  const { t } = useI18n();
  useDocumentTitle(isValidApodDate(date) ? undefined : t('error.invalid.title'));

  if (!isValidApodDate(date)) {
    return (
      <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10 lg:pt-16">
        <Notice level={1} title={t('error.invalid.title')} body={t('error.invalid.body')}>
          <Link to="/" className="btn btn-primary">
            {t('error.today')}
          </Link>
          <Link to="/gallery" className="btn btn-ghost">
            {t('nav.gallery')}
          </Link>
        </Notice>
      </div>
    );
  }
  // Not keyed by date: the date field and keyboard focus survive the change of day.
  return <DayView date={date} />;
};

/** Links shared before the redesign used /apod?date=YYYY-MM-DD. */
export const LegacyApodRedirect: React.FC = () => {
  const [params] = useSearchParams();
  const date = params.get('date');
  return <Navigate to={date ? `/apod/${date}` : '/'} replace />;
};
