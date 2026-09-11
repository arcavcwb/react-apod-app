import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiRocket, BiImages, BiCalendar, BiRadar, BiPlanet, BiShieldQuarter } from 'react-icons/bi';
import { navigateWithViewTransition } from '../utils/navigation';
import nasa from '../Assets/nasa.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigateWithViewTransition(navigate, path);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">
      {/* Badge de Telemetría Orbital */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold mb-8 backdrop-blur-xl shadow-glow-cyan">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="tracking-widest uppercase">CONSOLA ORBITAL EN LÍNEA</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">APOD PROTOCOL v2.0</span>
      </div>

      {/* Hero Header con Anillos y Radar Simulado */}
      <div className="text-center max-w-3xl mb-12 relative">
        <div className="flex justify-center mb-8 relative">
          {/* Anillos orbitales decorativos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-cyan-500/20 animate-spin pointer-events-none" style={{ animationDuration: '24s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-dashed border-indigo-500/20 pointer-events-none" />

          <div className="relative z-10 p-3 rounded-full bg-slate-950/80 border border-cyan-500/30 shadow-glow-cyan">
            <img
              src={nasa}
              alt="NASA Insignia"
              className="w-24 h-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
          Explora la Frontera Inexplorada del{' '}
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            Cosmos
          </span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
          Consola científica de vanguardia para la exploración del archivo astronómico de la NASA. Observaciones de alta definición procesadas en el Edge con latencia ultra-baja y contratos defensivos.
        </p>
      </div>

      {/* Botones de Acción Primaria */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
        <Link
          to="/apod"
          onClick={(e) => handleNavigate(e, '/apod')}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-mono font-bold text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2 shadow-glow-cyan hover:shadow-glow-cyan-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50 active:scale-95 cursor-pointer"
        >
          <BiRocket className="w-5 h-5" />
          <span>Visor de Hoy</span>
        </Link>
        <Link
          to="/gallery"
          onClick={(e) => handleNavigate(e, '/gallery')}
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-500/60 font-mono font-semibold text-sm uppercase tracking-wider inline-flex items-center justify-center space-x-2 transition-all shadow-hud-panel focus:outline-none focus:ring-2 focus:ring-cyan-400/50 active:scale-95 cursor-pointer"
        >
          <BiImages className="w-5 h-5 text-cyan-400" />
          <span>Archivo Orbital</span>
        </Link>
      </div>

      {/* Tarjetas de Capacidades del Observatorio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 backdrop-blur-xl flex flex-col items-start transition-all hover:border-cyan-500/40 hover:shadow-glow-cyan group hud-corner-brackets">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4 shadow-glow-cyan group-hover:scale-105 transition-transform">
            <BiPlanet className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1 tracking-wider">
            SISTEMA 01
          </span>
          <h2 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            Observación Diaria
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Fotografía astrofísica actualizada cada 24 horas sincronizada directamente con los servidores centrales de la NASA.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 backdrop-blur-xl flex flex-col items-start transition-all hover:border-indigo-500/40 hover:shadow-glow-indigo group hud-corner-brackets">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 shadow-glow-indigo group-hover:scale-105 transition-transform">
            <BiCalendar className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold mb-1 tracking-wider">
            SISTEMA 02
          </span>
          <h2 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            Navegación Temporal
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Búsqueda retrospectiva y saltos cuánticos aleatorios en el archivo histórico preservado desde junio de 1995.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 backdrop-blur-xl flex flex-col items-start transition-all hover:border-emerald-500/40 hover:shadow-glow-emerald group hud-corner-brackets">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-glow-emerald group-hover:scale-105 transition-transform">
            <BiShieldQuarter className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1 tracking-wider">
            SISTEMA 03
          </span>
          <h2 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
            Resiliencia Zero-Downtime
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Circuit Breaker y caché en el Edge que aseguran 0ms de espera y entrega ininterrumpida ante saturación de cuota.
          </p>
        </div>
      </div>
    </div>
  );
};
