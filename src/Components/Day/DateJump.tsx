import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n/I18n';
import { APOD_FIRST_DATE, apodToday, isValidApodDate } from '../../utils/date';

/** Every day has an address you can type: picking or typing a full date goes straight there. */
export const DateJump: React.FC<{ value?: string; className?: string; compact?: boolean }> = ({ value, className = '', compact = false }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const today = apodToday();

  return (
    <label className={`block ${className}`}>
      <span className={`text-small text-faint ${compact ? 'lg:sr-only' : ''}`}>{t('day.pickDate')}</span>
      {/* Uncontrolled, so a half-typed year (0002, 0020, 0202…) is not reset between keystrokes. */}
      <input
        key={value}
        type="date"
        className={`date-field field mt-2 block min-h-12 w-full px-5 lg:min-h-[3.25rem] ${compact ? 'lg:mt-0' : ''}`}
        min={APOD_FIRST_DATE}
        max={today}
        defaultValue={value}
        onChange={(e) => isValidApodDate(e.target.value, today) && navigate(`/apod/${e.target.value}`, { viewTransition: true })}
      />
    </label>
  );
};
