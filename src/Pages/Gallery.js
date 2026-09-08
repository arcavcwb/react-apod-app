import React from "react";
import { Link } from "react-router-dom";
import { BiImages, BiRocket } from "react-icons/bi";

export const Gallery = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col items-center text-center">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6">
        <BiImages className="w-4 h-4" />
        <span>Explorador de Archivos Astronómicos</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
        Galería del Cosmos
      </h1>
      
      <p className="text-slate-400 max-w-2xl text-base sm:text-lg mb-8">
        Explora las imágenes más recientes capturadas por telescopios espaciales y misiones de la NASA a través de la API oficial APOD.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full my-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm text-left">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-bold">
            01
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Imagen del Día</h2>
          <p className="text-slate-400 text-sm mb-4">
            Fotografía astronómica destacada con explicación redactada por astrofísicos profesionales.
          </p>
          <Link
            to="/apod"
            className="inline-flex items-center space-x-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <span>Ver hoy</span>
            <BiRocket className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm text-left">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 font-bold">
            02
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Resolución 4K</h2>
          <p className="text-slate-400 text-sm mb-4">
            Acceso a tomas en alta definición provenientes del Telescopio Hubble y James Webb.
          </p>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Integrado vía API
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm text-left">
          <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-bold">
            03
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Archivo Histórico</h2>
          <p className="text-slate-400 text-sm mb-4">
            Base de datos cósmica preservada desde junio de 1995 hasta la actualidad.
          </p>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            +10,000 registros
          </span>
        </div>
      </div>

      <div className="mt-4">
        <Link
          to="/apod"
          className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-lg bg-cyan-500 text-cyan-950 font-bold hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          Explorar APOD de Hoy
        </Link>
      </div>
    </div>
  );
};
