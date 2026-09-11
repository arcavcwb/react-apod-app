export interface OrbitalStationConfig {
  id: string;
  name: string;
  designation: string;
  code: string;
  path: string;
  radius: number;
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
    designation: 'Observación Diaria APOD',
    code: 'STN-01',
    path: '/apod',
    radius: 6.8,
    speed: 0.012,
    color: '#22d3ee', // cyan-400
    emissive: '#0891b2',
    size: 0.72,
    hasMoon: true,
    description: 'Fotografía y explicación astrofísica del día capturada por la NASA.',
  },
  {
    id: 'station-gallery',
    name: 'Archivo Cósmico',
    designation: 'Galería Histórica',
    code: 'STN-02',
    path: '/gallery',
    radius: 11.2,
    speed: -0.007, // Contrarrotación
    color: '#a5b4fc', // indigo-300
    emissive: '#4f46e5',
    size: 0.62,
    description: 'Explora observaciones astronómicas pasadas de nuestro universo.',
  },
  {
    id: 'station-about',
    name: 'Acerca de la Misión',
    designation: 'Observatorio Web',
    code: 'STN-03',
    path: '/about',
    radius: 15.6,
    speed: 0.004,
    color: '#34d399', // emerald-400
    emissive: '#059669',
    size: 0.88,
    hasRing: true,
    description: 'Arquitectura del sistema, fuentes científicas y especificaciones.',
  },
];
