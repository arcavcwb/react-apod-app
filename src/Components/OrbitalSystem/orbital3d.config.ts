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
    name: 'Estación Alfa',
    designation: 'APOD // VISOR DIARIO',
    code: 'STN-01',
    path: '/apod',
    radius: 6.8,
    speed: 0.012,
    color: '#22d3ee', // cyan-400
    emissive: '#0891b2',
    size: 0.7,
    hasMoon: true,
    description: 'Telemetría y fotografía astrofísica del día en resolución nativa.',
  },
  {
    id: 'station-gallery',
    name: 'Estación Beta',
    designation: 'ARCHIVO // GALERÍA',
    code: 'STN-02',
    path: '/gallery',
    radius: 11.2,
    speed: -0.007, // Contrarrotación
    color: '#a5b4fc', // indigo-300
    emissive: '#4f46e5',
    size: 0.6,
    description: 'Banco de observaciones históricas y saltos cuánticos aleatorios.',
  },
  {
    id: 'station-about',
    name: 'Estación Gamma',
    designation: 'MISIÓN // OBSERVATORIO',
    code: 'STN-03',
    path: '/about',
    radius: 15.6,
    speed: 0.004,
    color: '#34d399', // emerald-400
    emissive: '#059669',
    size: 0.85,
    hasRing: true,
    description: 'Especificaciones técnicas, contratos defensivos y arquitectura.',
  },
];
