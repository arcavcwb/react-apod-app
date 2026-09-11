export interface OrbitalStationConfig {
  id: string;
  name: string;
  designation: string;
  code: string;
  objectName: string;
  distanceAU: string;
  statusTelemetry: string;
  coordinates: string;
  path: string;
  radius: number;
  inclination: number;
  speed: number;
  color: string;
  emissive: string;
  size: number;
  hasRing?: boolean;
  hasMoon?: boolean;
  description: string;
}

export const ORBITAL_STATIONS: OrbitalStationConfig[] = [
  {
    id: 'station-apod',
    name: 'Foto de Hoy',
    designation: 'OBSERVACIÓN ACTIVA',
    code: 'OBS-01',
    objectName: 'TERRA // APOD NODE',
    distanceAU: '1.00 AU',
    statusTelemetry: 'TRANSMITTING',
    coordinates: 'RA 18h 36m // DEC +38°47′',
    path: '/apod',
    radius: 7.2,
    inclination: 0.08,
    speed: 0.009,
    color: '#22d3ee', // cyan-400
    emissive: '#0891b2',
    size: 0.68,
    hasMoon: true,
    description: 'Fotografía astronómica del día y telemetría astrofísica en tiempo real.',
  },
  {
    id: 'station-gallery',
    name: 'Archivo Cósmico',
    designation: 'BANCO HISTÓRICO',
    code: 'ARC-02',
    objectName: 'HUBBLE-JWST DEEP FIELD',
    distanceAU: '2.45 AU',
    statusTelemetry: 'ONLINE // READY',
    coordinates: 'RA 05h 35m // DEC -05°23′',
    path: '/gallery',
    radius: 11.8,
    inclination: -0.12,
    speed: -0.006, // Contrarrotación
    color: '#a5b4fc', // indigo-300
    emissive: '#4338ca',
    size: 0.58,
    description: 'Catálogo profundo de observaciones pasadas curadas por la NASA.',
  },
  {
    id: 'station-about',
    name: 'Acerca de la Misión',
    designation: 'SISTEMA OBSERVATORIO',
    code: 'SYS-03',
    objectName: 'AEROSPACE ARCHITECTURE',
    distanceAU: '5.20 AU',
    statusTelemetry: 'NOMINAL',
    coordinates: 'RA 12h 51m // DEC +27°07′',
    path: '/about',
    radius: 16.4,
    inclination: 0.16,
    speed: 0.0035,
    color: '#34d399', // emerald-400
    emissive: '#059669',
    size: 0.82,
    hasRing: true,
    description: 'Especificaciones técnicas, contratos defensivos y fuentes científicas.',
  },
];
