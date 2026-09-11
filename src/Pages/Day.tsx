import React from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { DayView } from '../Components/Day/DayView';
import { EmptyPlate } from '../Components/Plate/Plate';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { useI18n } from '../i18n/I18n';
import { isValidApodDate } from '../utils/date';

export const Day: React.FC = () => {
  const { date } = useParams();
  const { t } = useI18n();
  useDocumentTitle(isValidApodDate(date) ? undefined : t('error.invalid.title'));

  if (!isValidApodDate(date)) {
    return (
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10">
        <EmptyPlate className="min-h-[60svh]" title={t('error.invalid.title')} body={t('error.invalid.body')}>
          <Link to="/" className="control control-red">
            {t('error.today')}
          </Link>
          <Link to="/archive" className="control">
            {t('nav.archive')}
          </Link>
        </EmptyPlate>
      </div>
    );
  }
  // Not keyed by date: the ruler and date field keep keyboard focus while the day changes.
  return <DayView date={date} />;
};

/** Links shared before the redesign used /apod?date=YYYY-MM-DD. */
export const LegacyApodRedirect: React.FC = () => {
  const [params] = useSearchParams();
  const date = params.get('date');
  return <Navigate to={date ? `/apod/${date}` : '/'} replace />;
};
