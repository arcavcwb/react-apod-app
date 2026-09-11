import React from 'react';
import { DayView } from '../Components/Day/DayView';
import { OrrerySection } from '../Components/Orrery/OrrerySection';

/** Today's plate first; the 3D orrery waits below and loads only when approached. */
export const Home: React.FC = () => (
  <>
    <DayView />
    <OrrerySection />
  </>
);
