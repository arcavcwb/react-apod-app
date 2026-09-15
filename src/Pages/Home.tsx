import React from 'react';
import { RecentDays } from '../Components/Gallery/RecentDays';
import { ApodHero } from '../Components/Home/ApodHero';
import { useApodDay } from '../Hooks/useApod';

/** TODAY and the step to EXPLORE (the days just before it), on one screen. */
export const Home: React.FC = () => {
  const { result, retry } = useApodDay(undefined);
  return (
    <ApodHero result={result} retry={retry}>
      <RecentDays exclude={result?.data?.date} />
    </ApodHero>
  );
};
