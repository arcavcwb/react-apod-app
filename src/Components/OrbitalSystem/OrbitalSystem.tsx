import React from 'react';
import nasa from '../../Assets/nasa.png';

export const OrbitalSystem: React.FC = () => {
  return (
    <div
      aria-label="Sistema orbital concéntrico NASA"
      className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] mx-auto select-none pointer-events-none"
    >
      {/* Fondo de radar/telémetria con SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <circle cx="210" cy="210" r="205" fill="none" stroke="currentColor" className="text-cyan-800/60" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="210" cy="210" r="160" fill="none" stroke="currentColor" className="text-cyan-900/50" strokeWidth="1" strokeDasharray="2 6" />
        <path d="M210 5 L210 415 M5 210 L415 210" stroke="currentColor" className="text-cyan-800/40" strokeWidth="1" />
      </svg>

      {/* Resplandor nebular central */}
      <div
        aria-hidden="true"
        className="absolute w-48 h-48 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none"
      />

      {/* Marcadores de Grados Cardinales */}
      <span aria-hidden="true" className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/80 tracking-widest">
        000°
      </span>
      <span aria-hidden="true" className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-400/80 tracking-widest">
        180°
      </span>
      <span aria-hidden="true" className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-400/80 tracking-widest">
        270°
      </span>
      <span aria-hidden="true" className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cyan-400/80 tracking-widest">
        090°
      </span>

      {/* ÓRBITA 3: Planeta Exterior con luna (Rotación Horaria Lenta) */}
      <div
        aria-hidden="true"
        className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] rounded-full border border-sky-400/40 animate-spin motion-reduce:animate-none"
        style={{ animationDuration: '40s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6">
          {/* Planeta Esmeralda/Azul Profundo */}
          <div className="absolute inset-0 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
          {/* Luna orbital (gira en torno al planeta) */}
          <div 
            className="absolute -inset-4 rounded-full border border-emerald-400/40 animate-spin motion-reduce:animate-none"
            style={{ animationDuration: '4s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
          >
             <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-200 shadow-[0_0_6px_rgba(167,243,208,1)]" />
          </div>
        </div>
      </div>

      {/* ÓRBITA 2: Sonda espacial / Baliza (Contrarrotación) */}
      <div
        aria-hidden="true"
        className="absolute w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] rounded-full border border-dashed border-indigo-400/60 animate-spin motion-reduce:animate-none"
        style={{ animationDuration: '25s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', animationDirection: 'reverse' }}
      >
        <div className="absolute top-[14.6%] right-[14.6%] w-3 h-3 translate-x-1/2 -translate-y-1/2">
          {/* Sonda espacial */}
          <div className="absolute inset-0 bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,1)] rotate-45" />
          {/* Baliza pulsante */}
          <div className="absolute inset-[-6px] rounded-full border-2 border-indigo-400 animate-ping opacity-80" />
        </div>
      </div>

      {/* ÓRBITA 1: Planeta/satélite interior (Rotación rápida) */}
      <div
        aria-hidden="true"
        className="absolute w-[160px] h-[160px] sm:w-[190px] sm:h-[190px] rounded-full border border-cyan-400/60 animate-spin motion-reduce:animate-none"
        style={{ animationDuration: '15s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
      >
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,1)]" />
      </div>

      {/* Núcleo Central: Insignia NASA con Marco de Acoplamiento */}
      <div className="relative z-20 flex items-center justify-center w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-full bg-slate-950 border border-cyan-500/70 shadow-[0_0_35px_rgba(6,182,212,0.4)] backdrop-blur-xl pointer-events-auto group">
        {/* Anillo de rotación interno del núcleo */}
        <div 
          className="absolute inset-[-2px] rounded-full border-2 border-dashed border-cyan-400/60 animate-spin motion-reduce:animate-none" 
          style={{ animationDuration: '8s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }} 
        />
        <img
          src={nasa}
          alt="Insignia oficial de la NASA"
          className="w-[60px] h-[60px] sm:w-[75px] sm:h-[75px] object-contain drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  );
};
