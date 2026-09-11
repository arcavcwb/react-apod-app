import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Orbital3DSystem } from '../Components/OrbitalSystem/Orbital3DSystem';
import { ORBITAL_STATIONS, OrbitalStationConfig } from '../Components/OrbitalSystem/orbital3d.config';
import { navigateWithViewTransition } from '../utils/navigation';
import nasa from '../Assets/nasa.png';
import { BiRocket, BiImages, BiInfoCircle, BiChevronRight } from 'react-icons/bi';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredStation, setHoveredStation] = useState<OrbitalStationConfig | null>(null);

  const handleNavigate = (path: string) => {
    navigateWithViewTransition(navigate, path);
  };

  const getStationIcon = (id: string) => {
    if (id === 'station-apod') return <BiRocket className="w-4 h-4" />;
    if (id === 'station-gallery') return <BiImages className="w-4 h-4" />;
    return <BiInfoCircle className="w-4 h-4" />;
  };

  return (
    <div className="h-screen h-[100dvh] w-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-14 py-4 lg:py-6 overflow-hidden relative select-none">
      {/* Bloque Izquierdo: Título y Navegación Humana */}
      <section className="w-full lg:w-5/12 xl:w-5/12 flex flex-col justify-center h-full max-h-screen z-20 py-2">
        {/* Identidad NASA */}
        <header className="flex items-center space-x-3 mb-3 sm:mb-5">
          <img
            src={nasa}
            alt="NASA Logo"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              NASA APOD EXPLORER
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Astronomy Picture of the Day
            </span>
          </div>
        </header>

        {/* Título de Alto Impacto */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.06] mb-3 sm:mb-4 drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
          Explora la Frontera del{' '}
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            Cosmos
          </span>
        </h1>

        {/* Subtítulo Editorial Humano */}
        <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-lg mb-5 sm:mb-6 font-normal">
          Cada día, una ventana al universo observable curada por astrónomos de la NASA.
          Descubre nebulosas profundas, colisiones galácticas y los confines del espacio estelar.
        </p>

        {/* Panel Ergonómico de Navegación (Touch targets >= 48px & WCAG 2.1 AA) */}
        <nav
          aria-label="Destinos de navegación del observatorio"
          className="flex flex-col space-y-2.5 w-full max-w-md mb-4"
        >
          {ORBITAL_STATIONS.map((station) => {
            const isSelected = hoveredStation?.id === station.id;
            const isPrimary = station.id === 'station-apod';

            return (
              <button
                key={station.id}
                type="button"
                onClick={() => handleNavigate(station.path)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
                className={`min-h-[48px] px-4 py-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 active:scale-[0.98] ${
                  isPrimary
                    ? isSelected
                      ? 'bg-cyan-400 text-cyan-950 border-cyan-300 shadow-glow-cyan-lg'
                      : 'bg-cyan-500 text-cyan-950 border-cyan-400 hover:bg-cyan-400 shadow-glow-cyan'
                    : isSelected
                    ? 'bg-slate-900 border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: station.color }}
                  />
                  <div className="flex flex-col text-left">
                    <span className={isPrimary ? 'text-cyan-950 font-bold' : 'text-white'}>
                      {station.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono tracking-wider ${
                        isPrimary ? 'text-cyan-900' : 'text-slate-400'
                      }`}
                    >
                      {station.designation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={isPrimary ? 'text-cyan-950' : 'text-cyan-400'}>
                    {getStationIcon(station.id)}
                  </span>
                  <BiChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'translate-x-0.5' : ''
                    } ${isPrimary ? 'text-cyan-950' : 'text-slate-500'}`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Indicador reactivo de exploración */}
        <footer className="w-full max-w-md">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 backdrop-blur-md p-3 flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <p className="text-[11px] text-slate-300 font-normal leading-normal truncate">
              {hoveredStation
                ? hoveredStation.description
                : 'Toca o haz clic en los planetas en órbita para navegar.'}
            </p>
          </div>
        </footer>
      </section>

      {/* Bloque Derecho: Animación Orbital 3D Completa y Fluida */}
      <main className="w-full lg:w-7/12 xl:w-7/12 h-[380px] sm:h-[480px] lg:h-full relative flex items-center justify-center overflow-hidden">
        <Orbital3DSystem
          onHoverStation={setHoveredStation}
          activeStationId={hoveredStation?.id}
        />
      </main>
    </div>
  );
};
