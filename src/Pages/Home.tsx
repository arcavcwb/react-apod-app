import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Orbital3DSystem } from '../Components/OrbitalSystem/Orbital3DSystem';
import { ORBITAL_STATIONS, OrbitalStationConfig } from '../Components/OrbitalSystem/orbital3d.config';
import { navigateWithViewTransition } from '../utils/navigation';
import { fetchTodayApod } from '../services/nasa.service';
import { ApodItem } from '../contracts/apod.contract';
import { BiChevronRight } from 'react-icons/bi';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredStation, setHoveredStation] = useState<OrbitalStationConfig | null>(null);
  const [todayApod, setTodayApod] = useState<ApodItem | null>(null);
  const [isLoadingApod, setIsLoadingApod] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    fetchTodayApod()
      .then((res) => {
        if (isMounted && res.data) {
          setTodayApod(res.data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingApod(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path: string) => {
    navigateWithViewTransition(navigate, path);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'OBSERVACIÓN EN TIEMPO REAL';
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj
        .toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative min-h-[100svh] h-[100dvh] w-full bg-[#020617] text-slate-100 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Minimal Observatory Header */}
      <header className="relative z-30 w-full px-5 sm:px-8 lg:px-12 py-3.5 sm:py-4 border-b border-slate-900/80 bg-[#020617]/80 backdrop-blur-sm flex items-center justify-between">
        {/* Left: NASA APOD Identification */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-cyan-500/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
              NASA APOD
            </span>
            <span className="font-mono text-[9px] text-slate-500 tracking-wider">
              DEEP SPACE OBSERVATORY
            </span>
          </div>
        </div>

        {/* Center: Observatory Navigation */}
        <nav
          aria-label="Navegación del observatorio"
          className="hidden md:flex items-center space-x-6 lg:space-x-8 font-mono text-[11px] uppercase tracking-widest text-slate-400"
        >
          <button
            type="button"
            onClick={() => handleNavigate('/apod')}
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-300 cursor-pointer min-h-[48px] inline-flex items-center"
          >
            Explorar
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('/gallery')}
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-300 cursor-pointer min-h-[48px] inline-flex items-center"
          >
            Archivo
          </button>
          <button
            type="button"
            onClick={() => handleNavigate('/about')}
            className="hover:text-cyan-400 transition-colors focus:outline-none focus:text-cyan-300 cursor-pointer min-h-[48px] inline-flex items-center"
          >
            Misión
          </button>
        </nav>

        {/* Right: Telemetry Status */}
        <div className="flex items-center space-x-2.5 font-mono text-[10px] tracking-widest text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-slate-500">SISTEMA //</span>
          <span className="text-slate-300 font-medium">EN LÍNEA</span>
        </div>
      </header>

      {/* 2. Main Hero Split: Left Editorial Text / Right Dominant Orbital System */}
      <div className="relative flex-1 w-full grid grid-cols-1 lg:grid-cols-12 items-center overflow-hidden">
        {/* Left Column (35-40% visual attention): Editorial Typography & Direct CTAs */}
        <section className="lg:col-span-5 xl:col-span-5 z-20 flex flex-col justify-center px-6 sm:px-10 lg:pl-12 lg:pr-4 py-4 sm:py-6 h-full max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <span className="h-[1px] w-5 bg-cyan-500/70" />
            <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-widest text-cyan-400 uppercase">
              NASA / APOD EXPLORER • OBSERVATORIO
            </span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-serif font-normal text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.04] mb-3 sm:mb-4">
            EXPLORA
            <br />
            EL COSMOS
          </h1>

          {/* Supporting Copy */}
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed font-normal mb-6 sm:mb-8 max-w-md">
            Descubre una nueva ventana al universo. Explora la imagen astronómica del día y navega
            por nuestro archivo cósmico.
          </p>

          {/* Primary and Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full mb-6">
            <button
              type="button"
              onClick={() => handleNavigate('/apod')}
              className="min-h-[48px] px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] focus:outline-none focus:ring-2 focus:ring-cyan-300 active:scale-[0.98] cursor-pointer"
            >
              <span>EXPLORAR APOD DE HOY</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/gallery')}
              className="min-h-[48px] px-5 py-3 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900/80 text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-slate-600 active:scale-[0.98] cursor-pointer"
            >
              VER ARCHIVO
            </button>
          </div>

          {/* Subtle Telemetry Instrumentation */}
          <div className="font-mono text-[10px] text-slate-500 tracking-wider space-y-1 pt-3 border-t border-slate-900/90 hidden sm:block">
            <div className="flex items-center justify-between max-w-xs">
              <span>NODO ACTIVO:</span>
              <span className="text-slate-400">
                {hoveredStation ? hoveredStation.objectName : 'TERRA // APOD-01'}
              </span>
            </div>
            <div className="flex items-center justify-between max-w-xs">
              <span>COORDENADAS:</span>
              <span className="text-slate-400">
                {hoveredStation ? hoveredStation.coordinates : 'RA 18h 36m // DEC +38°47′'}
              </span>
            </div>
          </div>
        </section>

        {/* Right Column (60-65% visual attention): Dominant Three.js Orbital System */}
        <section className="lg:col-span-7 xl:col-span-7 h-[360px] sm:h-[480px] lg:h-full w-full relative flex items-center justify-center overflow-visible">
          {/* Scientific Reticle Overlay Guides */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            <div className="absolute top-8 right-8 font-mono text-[9px] text-slate-600 tracking-widest">
              TELEMETRÍA // ORBITAL-SYS-01
            </div>
            <div className="absolute bottom-12 right-8 font-mono text-[9px] text-slate-600 tracking-widest text-right">
              PLANOS ORBITALES: 03
              <br />
              SEGUIMIENTO: ACTIVO
            </div>
          </div>

          {/* Three.js Canvas Container */}
          <div className="w-full h-full relative">
            <Orbital3DSystem
              onHoverStation={setHoveredStation}
              activeStationId={hoveredStation?.id}
            />
          </div>
        </section>
      </div>

      {/* 3. Real APOD Observation Status Strip */}
      <footer className="relative z-30 w-full px-5 sm:px-8 lg:px-12 py-3 border-t border-slate-900/80 bg-[#020617]/90 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] tracking-wider text-slate-400">
        <div className="flex items-center space-x-3 overflow-hidden">
          <span className="text-cyan-400 font-semibold uppercase flex-shrink-0">
            OBSERVACIÓN DE HOY //
          </span>
          <span className="text-slate-500 flex-shrink-0">
            {formatDate(todayApod?.date)}
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-white truncate max-w-xs sm:max-w-md lg:max-w-lg">
            {isLoadingApod
              ? 'Conectando con el catálogo de la NASA...'
              : todayApod?.title || 'LDN 1295: The Giraffe Nebula'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleNavigate('/apod')}
          className="hover:text-cyan-300 text-cyan-400 flex items-center space-x-1 uppercase font-semibold transition-colors focus:outline-none cursor-pointer flex-shrink-0"
        >
          <span>EXPLORAR OBSERVACIÓN</span>
          <BiChevronRight className="w-3.5 h-3.5" />
        </button>
      </footer>
    </div>
  );
};
