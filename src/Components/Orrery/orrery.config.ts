export type StationId = 'today' | 'archive' | 'about';

export interface OrreryStation {
  id: StationId;
  path: string;
  radius: number;
  inclination: number;
  /** Radians per second; negative orbits run backwards. */
  speed: number;
  size: number;
  kind: 'planet' | 'probe';
  hasMoon?: boolean;
  hasRing?: boolean;
}

export const STATIONS: OrreryStation[] = [
  { id: 'today', path: '/', radius: 7.2, inclination: 0.08, speed: 0.36, size: 0.62, kind: 'planet', hasMoon: true },
  { id: 'archive', path: '/archive', radius: 11.8, inclination: -0.12, speed: -0.24, size: 0.55, kind: 'probe' },
  { id: 'about', path: '/about', radius: 16.4, inclination: 0.16, speed: 0.14, size: 0.78, kind: 'planet', hasRing: true },
];
