import React from "react";
import { BiRadar } from "react-icons/bi";

interface SpinnerProps {
  loading?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ loading = true }) => {
  if (!loading) return null;

  return (
    <div
      role="status"
      aria-label="Calibrando telescopio orbital y cargando telemetría"
      className="flex flex-col items-center justify-center min-h-[45vh] w-full space-y-4"
    >
      <div className="relative flex items-center justify-center">
        {/* Anillo exterior rotatorio */}
        <div className="w-20 h-20 rounded-full border-2 border-slate-800 border-t-cyan-400 border-r-indigo-500/50 animate-spin" />
        {/* Anillo interior contrarrotatorio */}
        <div
          className="absolute w-12 h-12 rounded-full border border-dashed border-cyan-500/40 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '6s' }}
        />
        {/* Icono central de radar */}
        <BiRadar className="absolute w-6 h-6 text-cyan-400 animate-pulse" />
      </div>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Sincronizando Sensor Espacial...</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">APOD OPTICAL PIPELINE ACQUIRING DATA</span>
      </div>
      <span className="sr-only">Cargando...</span>
    </div>
  );
};
