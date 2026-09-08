import React from 'react';
import { Link } from 'react-router-dom';
import { BiRocket, BiImages, BiCalendar, BiSearchAlt, BiPlanet } from 'react-icons/bi';
import nasa from '../Assets/nasa.png';

export const Home: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">
      {/* Badge de Estado del Observatorio */}
      <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="tracking-wide">Observatorio NASA Conectado</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">APOD v1.0</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mb-10">
        <div className="flex justify-center mb-6">
          <img
            src={nasa}
            alt="NASA Insignia"
            className="w-24 h-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-6">
          Explora la Belleza Inexplorada del{' '}
          <span className="text-cyan-400">
            Cosmos
          </span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Descubre diariamente una nueva perspectiva del universo, explicada por astrofísicos profesionales y capturada por los telescopios espaciales más avanzados de la humanidad.
        </p>
      </div>

      {/* Botones de Acción Primaria */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
        <Link
          to="/apod"
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold text-base inline-flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <BiRocket className="w-5 h-5" />
          <span>Ver Imagen de Hoy</span>
        </Link>
        <Link
          to="/gallery"
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-base inline-flex items-center justify-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        >
          <BiImages className="w-5 h-5 text-cyan-400" />
          <span>Galería Cósmica</span>
        </Link>
      </div>

      {/* Tarjetas de Capacidades del Observatorio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col items-start transition-all hover:border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <BiPlanet className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Imagen Diaria</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Actualización oficial a medianoche UTC con imágenes procesadas por la NASA y astrónomos asociados.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col items-start transition-all hover:border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
            <BiCalendar className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Archivo Histórico</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Explora cualquier fecha desde el 16 de junio de 1995. Décadas de descubrimientos a un clic.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-md flex flex-col items-start transition-all hover:border-slate-700/80">
          <div className="w-12 h-12 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
            <BiSearchAlt className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Alta Definición</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Acceso directo a tomas 4K sin compresión capturadas por el Telescopio Espacial James Webb y Hubble.
          </p>
        </div>
      </div>
    </div>
  );
};
